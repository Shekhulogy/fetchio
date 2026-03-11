import express from "express";
import cors from "cors";
import mediaRouter from "./routes/media";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

try {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed
        .slice(idx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch {}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({ origin: allowedOrigins, methods: ["GET"] }));
app.use(express.json());
app.use("/api", mediaRouter);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

function findYtDlp(): string {
  // 1. Env override
  if (process.env.YTDLP_BIN && fs.existsSync(process.env.YTDLP_BIN)) {
    console.log("✅ yt-dlp from YTDLP_BIN env");
    return process.env.YTDLP_BIN;
  }

  // 2. Try which command (finds pip-installed or system yt-dlp)
  try {
    const p = execSync("which yt-dlp").toString().trim();
    if (p) {
      console.log("✅ yt-dlp from PATH:", p);
      return p;
    }
  } catch {}

  // 3. Common locations
  const candidates = [
    "/usr/local/bin/yt-dlp",
    "/usr/bin/yt-dlp",
    "/root/.local/bin/yt-dlp",
    path.join(__dirname, "..", "bin", "yt-dlp"),
    path.join(__dirname, "..", "bin", "yt-dlp.exe"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log("✅ yt-dlp at:", p);
      return p;
    }
  }

  // 4. Windows fallback — auto download
  if (process.platform === "win32") {
    const winBin = path.join(__dirname, "..", "bin", "yt-dlp.exe");
    if (!fs.existsSync(winBin)) {
      const { default: YTDlpWrap } = require("yt-dlp-wrap");
      fs.mkdirSync(path.dirname(winBin), { recursive: true });
      YTDlpWrap.downloadFromGithub(winBin);
    }
    return winBin;
  }

  console.warn("⚠️ yt-dlp not found!");
  return "yt-dlp";
}

const ytdlpBin = findYtDlp();
process.env.YTDLP_BIN = ytdlpBin;
console.log(`🎬 yt-dlp binary: ${ytdlpBin}`);

app.listen(PORT, () => {
  console.log(`🚀 Fetch.io backend at http://localhost:${PORT}`);
});
