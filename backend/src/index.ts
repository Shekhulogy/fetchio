import express from "express";
import cors from "cors";
import mediaRouter from "./routes/media";
import YTDlpWrap from "yt-dlp-wrap";
import path from "path";
import fs from "fs";

// Load .env file if present (for FFMPEG_PATH override)
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
    console.log("📄 Loaded .env");
  }
} catch {}

const app = express();
const PORT = process.env.PORT || 3001;

// Allow frontend dev server + production
app.use(
  cors({
    origin: [
      "https://YOUR_USERNAME.github.io",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:3000",
    ],
    methods: ["GET"],
  }),
);

app.use(express.json());
app.use("/api", mediaRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Auto-download yt-dlp binary if not present
async function ensureYtDlp() {
  const isWindows = process.platform === "win32";
  const binName = isWindows ? "yt-dlp.exe" : "yt-dlp";
  const binDir = path.join(__dirname, "..", "bin");
  const binPath = path.join(binDir, binName);

  if (!fs.existsSync(binPath)) {
    console.log("⬇️  Downloading yt-dlp binary...");
    fs.mkdirSync(binDir, { recursive: true });
    await YTDlpWrap.downloadFromGithub(binPath);
    // Make executable on Unix
    if (!isWindows) fs.chmodSync(binPath, "755");
    console.log("✅  yt-dlp binary ready:", binPath);
  }
  return binPath;
}

ensureYtDlp()
  .then((binPath) => {
    // Set binary path globally so routes can use it
    process.env.YTDLP_BIN = binPath;
    app.listen(PORT, () => {
      console.log(`🚀  Fetch.io backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialise yt-dlp:", err);
    // Still start server — system yt-dlp might be available
    app.listen(PORT, () => {
      console.log(
        `🚀  Fetch.io backend running at http://localhost:${PORT} (yt-dlp from PATH)`,
      );
    });
  });
