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
  // Windows: use local bin
  if (process.platform === "win32") {
    const winBin = path.join(__dirname, "..", "bin", "yt-dlp.exe");
    if (fs.existsSync(winBin)) return winBin;
    return "yt-dlp";
  }

  // Linux/Railway: find via which
  try {
    const p = execSync("which yt-dlp").toString().trim();
    if (p) {
      console.log("✅ yt-dlp:", p);
      return p;
    }
  } catch {}

  // Common paths
  for (const p of [
    "/usr/local/bin/yt-dlp",
    "/usr/bin/yt-dlp",
    "/root/.local/bin/yt-dlp",
  ]) {
    if (fs.existsSync(p)) return p;
  }

  return "yt-dlp";
}

// On Linux: never use /app/bin/yt-dlp (it's a Python script that needs Python)
if (process.platform !== "win32") {
  const stale = path.join(__dirname, "..", "bin", "yt-dlp");
  try {
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  } catch {}
}

process.env.YTDLP_BIN = findYtDlp();
console.log(`🎬 yt-dlp: ${process.env.YTDLP_BIN}`);

app.listen(PORT, () =>
  console.log(`🚀 Fetch.io backend at http://localhost:${PORT}`),
);
