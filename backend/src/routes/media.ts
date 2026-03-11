import { Router, Request, Response } from "express";
import YTDlpWrap from "yt-dlp-wrap";
import https from "https";
import http from "http";
import fs from "fs";
import { execSync, execFileSync } from "child_process";
import path from "path";

const router = Router();

// ── Detect ffmpeg ──────────────────────────────────────────────────────────
function findFfmpeg(): {
  path: string | null;
  tried: string[];
  method: string;
} {
  const tried: string[] = [];

  if (process.env.FFMPEG_PATH) {
    tried.push(`ENV:FFMPEG_PATH = ${process.env.FFMPEG_PATH}`);
    if (fs.existsSync(process.env.FFMPEG_PATH)) {
      return {
        path: process.env.FFMPEG_PATH,
        tried,
        method: "FFMPEG_PATH env var",
      };
    }
  }

  try {
    const out = execFileSync("ffmpeg", ["-version"], {
      stdio: "pipe",
      timeout: 5000,
    }).toString();
    if (out.includes("ffmpeg version")) {
      try {
        const cmd =
          process.platform === "win32" ? "where ffmpeg" : "which ffmpeg";
        const result = execSync(cmd, { stdio: "pipe", timeout: 3000 })
          .toString()
          .trim()
          .split(/\r?\n/)[0]
          .trim();
        tried.push(`PATH spawn OK → ${result}`);
        return { path: result, tried, method: "system PATH" };
      } catch {
        tried.push('PATH spawn OK, where failed → bare "ffmpeg"');
        return { path: "ffmpeg", tried, method: "system PATH (bare)" };
      }
    }
  } catch (e: any) {
    tried.push(`PATH spawn failed: ${e.message}`);
  }

  try {
    const cmd = process.platform === "win32" ? "where ffmpeg" : "which ffmpeg";
    const result = execSync(cmd, { stdio: "pipe", timeout: 3000 })
      .toString()
      .trim()
      .split(/\r?\n/)[0]
      .trim();
    tried.push(`where/which → ${result}`);
    if (result && fs.existsSync(result))
      return { path: result, tried, method: "where/which" };
  } catch (e: any) {
    tried.push(`where/which failed: ${e.message}`);
  }

  if (process.platform === "win32") {
    const u = process.env.USERPROFILE || "C:\\Users\\User";
    const la = process.env.LOCALAPPDATA || path.join(u, "AppData", "Local");
    const pf = process.env.ProgramFiles || "C:\\Program Files";
    const pf8 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";

    const wingetPaths: string[] = [];
    try {
      const base = path.join(la, "Microsoft", "WinGet", "Packages");
      if (fs.existsSync(base)) {
        for (const dir of fs.readdirSync(base)) {
          if (dir.toLowerCase().startsWith("gyan.ffmpeg")) {
            for (const sub of fs.readdirSync(path.join(base, dir))) {
              wingetPaths.push(path.join(base, dir, sub, "bin", "ffmpeg.exe"));
            }
          }
        }
      }
    } catch {}

    const candidates = [
      "C:\\ffmpeg\\bin\\ffmpeg.exe",
      "C:\\ffmpeg\\ffmpeg.exe",
      `${pf}\\ffmpeg\\bin\\ffmpeg.exe`,
      `${pf8}\\ffmpeg\\bin\\ffmpeg.exe`,
      `${u}\\ffmpeg\\bin\\ffmpeg.exe`,
      `${u}\\ffmpeg\\ffmpeg.exe`,
      `${u}\\Downloads\\ffmpeg\\bin\\ffmpeg.exe`,
      `${u}\\OneDrive\\Desktop\\ffmpeg\\bin\\ffmpeg.exe`,
      path.join(la, "Microsoft", "WinGet", "Links", "ffmpeg.exe"),
      `${u}\\scoop\\shims\\ffmpeg.exe`,
      `${u}\\scoop\\apps\\ffmpeg\\current\\bin\\ffmpeg.exe`,
      "C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe",
      "C:\\tools\\ffmpeg\\bin\\ffmpeg.exe",
      ...wingetPaths,
    ];

    for (const p of candidates) {
      tried.push(`check: ${p}`);
      if (fs.existsSync(p))
        return { path: p, tried, method: `Windows path scan` };
    }
  }

  return { path: null, tried, method: "not found" };
}

let _ffmpegResult: ReturnType<typeof findFfmpeg> | undefined;
function getFfmpegResult() {
  if (!_ffmpegResult) {
    _ffmpegResult = findFfmpeg();
    if (_ffmpegResult.path) {
      console.log(`✅ ffmpeg [${_ffmpegResult.method}]: ${_ffmpegResult.path}`);
    } else {
      console.warn(
        "⚠️  ffmpeg NOT found. 1080p/4K capped at 720p. Set FFMPEG_PATH in .env",
      );
    }
  }
  return _ffmpegResult;
}

function getFfmpegPath(): string | null {
  return getFfmpegResult().path;
}
function getFfmpegLocationDir(): string | null {
  const p = getFfmpegPath();
  if (!p || !path.isAbsolute(p)) return null;
  return path.dirname(p);
}

function getYtDlp() {
  const bin = process.env.YTDLP_BIN;
  if (bin && fs.existsSync(bin)) return new YTDlpWrap(bin);
  return new YTDlpWrap();
}

// Extra args to bypass YouTube bot detection on server IPs
const YT_BYPASS_ARGS = [
  "--extractor-args",
  "youtube:player_client=tv_embedded",
  "--add-headers",
  "Origin:https://www.youtube.com",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function detectPlatform(url: string): "instagram" | "youtube" | "other" {
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  return "other";
}

// ── Format selector ────────────────────────────────────────────────────────
//
// INSTAGRAM: only pre-merged streams exist.
//   `bestvideo+bestaudio` → "Requested format not available" ALWAYS.
//   Must use `best[ext=mp4]/best`.
//
// YOUTUBE 4K/2K: VP9 or AV1 in WebM — never mp4/h264.
//   Do NOT filter [ext=mp4] or [vcodec^=avc1] for these heights.
//   ffmpeg merges webm video + m4a audio into mp4 output perfectly.
//
// YOUTUBE ≤720p: pre-merged H264/mp4 available — no ffmpeg needed.
//
function buildFormatArgs(
  quality: string,
  url: string,
  hasFfmpeg: boolean,
  ffmpegLocationDir: string | null,
): {
  formatArg: string;
  extraArgs: string[];
  actualQuality: string;
  needsFfmpeg: boolean;
} {
  const platform = detectPlatform(url);
  const isInstagram = platform === "instagram" || platform === "other";
  const ffLocArgs =
    hasFfmpeg && ffmpegLocationDir
      ? ["--ffmpeg-location", ffmpegLocationDir]
      : [];

  // ── Instagram ─────────────────────────────────────────────────────────────
  if (isInstagram) {
    if (quality === "mp3") {
      return {
        formatArg: "bestaudio/best",
        extraArgs: ["-x", "--audio-format", "mp3", ...ffLocArgs],
        actualQuality: "mp3",
        needsFfmpeg: false,
      };
    }
    // Instagram videos are single pre-merged streams — just pick best
    return {
      formatArg: "best[ext=mp4]/best",
      extraArgs: [],
      actualQuality: quality,
      needsFfmpeg: false,
    };
  }

  // ── YouTube / other: MP3 ──────────────────────────────────────────────────
  if (quality === "mp3") {
    return {
      formatArg: "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio",
      extraArgs: ["-x", "--audio-format", "mp3", ...ffLocArgs],
      actualQuality: "mp3",
      needsFfmpeg: false,
    };
  }

  // ── YouTube video ─────────────────────────────────────────────────────────
  const heightMap: Record<string, number> = {
    "4k": 2160,
    "2k": 1440,
    "1080p": 1080,
    "720p": 720,
    "480p": 480,
  };
  const height = heightMap[quality] ?? 1080;
  const needsFfmpeg = height > 720 && !hasFfmpeg;
  const resolvedHeight = needsFfmpeg ? 720 : height;
  const actualQuality = needsFfmpeg ? "720p" : quality;

  if (hasFfmpeg) {
    return {
      formatArg: [
        `bestvideo[height<=${resolvedHeight}][vcodec!=none]+bestaudio[ext=m4a]`,
        `bestvideo[height<=${resolvedHeight}][vcodec!=none]+bestaudio`,
        `best[height<=${resolvedHeight}][vcodec!=none][acodec!=none]`,
      ].join("/"),
      extraArgs: ["--merge-output-format", "mp4", ...ffLocArgs],
      actualQuality,
      needsFfmpeg: false,
    };
  }

  // No ffmpeg — pre-merged only
  return {
    formatArg: [
      `best[height<=${resolvedHeight}][ext=mp4][vcodec!=none][acodec!=none]`,
      `best[height<=${resolvedHeight}][vcodec!=none][acodec!=none]`,
      `best[vcodec!=none][acodec!=none]`,
    ].join("/"),
    extraArgs: [],
    actualQuality,
    needsFfmpeg: true,
  };
}

// ── GET /api/ffmpeg-status ─────────────────────────────────────────────────
router.get("/ffmpeg-status", (_req: Request, res: Response) => {
  const result = getFfmpegResult();
  res.json({
    found: !!result.path,
    path: result.path,
    method: result.method,
    tried: result.tried,
    tip: result.path
      ? "✅ ffmpeg detected correctly"
      : "❌ Set FFMPEG_PATH=C:\\path\\to\\ffmpeg.exe in backend/.env",
  });
});

// ── GET /api/info ──────────────────────────────────────────────────────────
router.get("/info", async (req: Request, res: Response) => {
  const { url } = req.query;
  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "url query param required" });

  try {
    const ytDlp = getYtDlp();
    const info = await ytDlp.getVideoInfo([
      url,
      "--no-playlist",
      ...YT_BYPASS_ARGS,
    ]);

    const formats: any[] = (info.formats ?? [])
      .filter((f: any) => f.ext !== "mhtml")
      .filter((f: any) => f.vcodec !== "none" || f.acodec !== "none");

    const duration = (info.duration as number) ?? 0;

    // Get bytes for a stream — prefer real filesize, then tbr-based calc, then filesize_approx
    // tbr * duration / 8 = bytes, but real files are ~85% of this (encoder efficiency)
    function streamBytes(f: any): number | null {
      if (f?.filesize && f.filesize > 0) return f.filesize;
      if (f?.tbr && duration > 0)
        return Math.round(((f.tbr * 1000) / 8) * duration * 0.85);
      if (f?.filesize_approx && f.filesize_approx > 0)
        return Math.round(f.filesize_approx * 0.85);
      return null;
    }

    // Best audio stream (m4a preferred, matches what download actually picks)
    const bestAudioM4a = formats
      .filter(
        (f: any) =>
          f.acodec &&
          f.acodec !== "none" &&
          (!f.vcodec || f.vcodec === "none") &&
          f.ext === "m4a",
      )
      .sort((a: any, b: any) => (b.tbr ?? 0) - (a.tbr ?? 0))[0];
    const bestAudioAny = formats
      .filter(
        (f: any) =>
          f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none"),
      )
      .sort((a: any, b: any) => (b.tbr ?? 0) - (a.tbr ?? 0))[0];
    const audioStream = bestAudioM4a ?? bestAudioAny;
    const audioBytes = streamBytes(audioStream);

    // Estimate file size for each quality label
    const heightMap: Record<string, number> = {
      "4k": 2160,
      "2k": 1440,
      "1080p": 1080,
      "720p": 720,
      "480p": 480,
    };
    const qualityFilesizes: Record<string, string | null> = {};

    for (const [label, h] of Object.entries(heightMap)) {
      // Pick the EXACT best video stream ≤ height — same logic as download selector
      const videoStream = formats
        .filter(
          (f: any) => f.vcodec && f.vcodec !== "none" && (f.height ?? 0) <= h,
        )
        .sort((a: any, b: any) => {
          // Sort by height desc, then tbr desc — mirrors yt-dlp bestvideo selection
          if ((b.height ?? 0) !== (a.height ?? 0))
            return (b.height ?? 0) - (a.height ?? 0);
          return (b.tbr ?? 0) - (a.tbr ?? 0);
        })[0];

      const vBytes = streamBytes(videoStream);

      if (vBytes || audioBytes) {
        qualityFilesizes[label] = formatBytes(
          (vBytes ?? 0) + (audioBytes ?? 0),
        );
      } else {
        qualityFilesizes[label] = null;
      }
    }

    // MP3 size — audio only, no correction needed (it's just the audio stream)
    qualityFilesizes["mp3"] = audioBytes ? formatBytes(audioBytes) : null;

    // Max available video height — used by frontend to hide unavailable quality options
    const maxHeight = Math.max(
      0,
      ...formats
        .filter((f: any) => f.vcodec && f.vcodec !== "none" && f.height)
        .map((f: any) => f.height as number),
    );

    return res.json({
      title: info.title ?? "Unknown Title",
      author: info.uploader ?? info.channel ?? "",
      thumbnail: info.thumbnail ?? null,
      duration: info.duration_string ?? null,
      platform: (info.extractor_key ?? "unknown").toLowerCase(),
      webpage_url: info.webpage_url ?? url,
      qualityFilesizes,
      maxHeight: maxHeight || null,
      ffmpegFound: !!getFfmpegPath(),
    });
  } catch (err: any) {
    console.error("[/api/info]", err.message);
    return res
      .status(500)
      .json({ error: err.message ?? "Failed to fetch media info" });
  }
});

// ── GET /api/thumbnail ─────────────────────────────────────────────────────
router.get("/thumbnail", (req: Request, res: Response) => {
  const { url } = req.query;
  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "url query param required" });

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const client = parsedUrl.protocol === "https:" ? https : http;
  const proxyReq = client.get(
    url,
    { headers: { "User-Agent": "Mozilla/5.0" } },
    (imgRes) => {
      res.setHeader(
        "Content-Type",
        imgRes.headers["content-type"] ?? "image/jpeg",
      );
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Access-Control-Allow-Origin", "*");
      imgRes.pipe(res);
    },
  );
  proxyReq.on("error", (err) => {
    console.error("[/api/thumbnail]", err.message);
    res.status(502).json({ error: "Failed to proxy thumbnail" });
  });
});

// ── GET /api/download ──────────────────────────────────────────────────────
router.get("/download", async (req: Request, res: Response) => {
  const { url, format = "1080p" } = req.query;
  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "url query param required" });

  const hasFfmpeg = !!getFfmpegPath();
  const ffmpegLocationDir = getFfmpegLocationDir();

  const { formatArg, extraArgs, actualQuality, needsFfmpeg } = buildFormatArgs(
    format as string,
    url,
    hasFfmpeg,
    ffmpegLocationDir,
  );

  if (needsFfmpeg)
    console.warn(
      `⚠️  ffmpeg not found — ${format} needs ffmpeg. Falling back to ${actualQuality}.`,
    );

  const isAudio = format === "mp3";
  const tmpDir = path.join(__dirname, "..", "..", "tmp");
  const tmpId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const tmpOut = path.join(tmpDir, `${tmpId}.%(ext)s`);

  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const ytDlp = getYtDlp();

    const info = await ytDlp.getVideoInfo([
      url,
      "--no-playlist",
      ...YT_BYPASS_ARGS,
    ]);
    const safeName =
      (info.title ?? "media")
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
        .replace(/[^\x20-\x7E]/g, "")
        .replace(/\s+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 80) || "download";
    const dlExt = isAudio ? "mp3" : "mp4";
    const dlName = `${safeName}.${dlExt}`;

    const encodedName = encodeURIComponent(dlName).replace(/['()]/g, escape);
    const contentDisposition = `attachment; filename="${dlName}"; filename*=UTF-8''${encodedName}`;

    const args: string[] = [
      url,
      "-f",
      formatArg,
      ...extraArgs,
      "--no-playlist",
      "--no-warnings",
      ...YT_BYPASS_ARGS,
      "-o",
      tmpOut,
    ];

    console.log(
      `[download] platform=${detectPlatform(url)} fmt=${format} actual=${actualQuality}`,
    );
    console.log(
      `[download] ffmpeg=${ffmpegLocationDir ?? (hasFfmpeg ? "in PATH" : "NOT FOUND")}`,
    );
    console.log(`[download] -f "${formatArg}"`);

    await ytDlp.execPromise(args);

    const files = fs.readdirSync(tmpDir).filter((f) => f.startsWith(tmpId));
    if (!files.length) throw new Error("yt-dlp produced no output file");

    const tmpFile = path.join(tmpDir, files[0]);
    const stat = fs.statSync(tmpFile);

    res.setHeader("Content-Disposition", contentDisposition);
    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");
    res.setHeader("Content-Length", stat.size);
    if (needsFfmpeg) res.setHeader("X-Actual-Quality", actualQuality);

    const rs = fs.createReadStream(tmpFile);
    rs.pipe(res);
    rs.on("close", () => fs.unlink(tmpFile, () => {}));
  } catch (err: any) {
    console.error("[/api/download]", err.message);
    try {
      fs.readdirSync(tmpDir)
        .filter((f) => f.startsWith(tmpId))
        .forEach((f) => fs.unlink(path.join(tmpDir, f), () => {}));
    } catch {}
    if (!res.headersSent)
      res.status(500).json({ error: err.message ?? "Download failed" });
  }
});

export default router;
