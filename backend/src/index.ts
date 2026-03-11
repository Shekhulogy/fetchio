import express from "express";
import cors from "cors";
import mediaRouter from "./routes/media";
import path from "path";
import fs from "fs";

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
  // Windows
  if (process.platform === "win32") {
    const winBin = path.join(__dirname, "..", "bin", "yt-dlp.exe");
    if (fs.existsSync(winBin)) return winBin;
    return "yt-dlp";
  }

  // Delete stale bin if exists
  const stale = path.join(__dirname, "..", "bin", "yt-dlp");
  try {
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  } catch {}

  // Check all possible Linux paths
  const candidates = [
    "/app/ytdlp/bin/yt-dlp", // pip --target install
    "/usr/local/bin/yt-dlp",
    "/usr/bin/yt-dlp",
    "/root/.local/bin/yt-dlp",
    "/home/user/.local/bin/yt-dlp",
    "/nix/var/nix/profiles/default/bin/yt-dlp",
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log("✅ yt-dlp found at:", p);
      return p;
    }
  }

  // List what's in /app/ytdlp for debugging
  try {
    const dirs = ["/app/ytdlp", "/app/ytdlp/bin"];
    for (const d of dirs) {
      if (fs.existsSync(d))
        console.log(`📂 ${d}:`, fs.readdirSync(d).join(", "));
    }
  } catch {}

  console.error("❌ yt-dlp not found anywhere!");
  return "yt-dlp";
}

process.env.YTDLP_BIN = findYtDlp();
console.log(`🎬 yt-dlp binary: ${process.env.YTDLP_BIN}`);

app.listen(PORT, () =>
  console.log(`🚀 Fetch.io backend at http://localhost:${PORT}`),
);
