import express from "express";
import cors from "cors";
import mediaRouter from "./routes/media";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

// Load .env file if present
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
  // 1. Explicit env override
  if (process.env.YTDLP_BIN) {
    console.log("✅  yt-dlp from env:", process.env.YTDLP_BIN);
    return process.env.YTDLP_BIN;
  }

  // 2. System PATH (Railway nixpkgs installs here)
  try {
    const systemPath = execSync("which yt-dlp 2>/dev/null").toString().trim();
    if (systemPath) {
      console.log("✅  yt-dlp from system PATH:", systemPath);
      return systemPath;
    }
  } catch {}

  // 3. Common nix store paths on Railway
  const nixPaths = [
    "/root/.nix-profile/bin/yt-dlp",
    "/nix/var/nix/profiles/default/bin/yt-dlp",
    "/usr/local/bin/yt-dlp",
    "/usr/bin/yt-dlp",
  ];
  for (const p of nixPaths) {
    if (fs.existsSync(p)) {
      console.log("✅  yt-dlp found at:", p);
      return p;
    }
  }

  // 4. Windows local binary
  if (process.platform === "win32") {
    const winPath = path.join(__dirname, "..", "bin", "yt-dlp.exe");
    if (fs.existsSync(winPath)) return winPath;
  }

  // 5. Last resort — hope it's in PATH
  console.warn("⚠️  yt-dlp not found, using bare command");
  return "yt-dlp";
}

// Delete stale downloaded binary if it exists (it's a Python script that won't work without Python)
const localBin = path.join(__dirname, "..", "bin", "yt-dlp");
if (fs.existsSync(localBin)) {
  try {
    fs.unlinkSync(localBin);
    console.log("🗑️  Removed stale local yt-dlp binary");
  } catch {}
}

const ytdlpBin = findYtDlp();
process.env.YTDLP_BIN = ytdlpBin;

app.listen(PORT, () => {
  console.log(`🚀  Fetch.io backend running at http://localhost:${PORT}`);
  console.log(`🎬  yt-dlp: ${ytdlpBin}`);
});
