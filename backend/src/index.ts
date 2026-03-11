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
  if (process.env.YTDLP_BIN && fs.existsSync(process.env.YTDLP_BIN)) {
    console.log("✅ yt-dlp from env:", process.env.YTDLP_BIN);
    return process.env.YTDLP_BIN;
  }

  // Downloaded by postinstall script
  const localBin = path.join(
    __dirname,
    "..",
    "bin",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp",
  );
  if (fs.existsSync(localBin)) {
    console.log("✅ yt-dlp from bin:", localBin);
    return localBin;
  }

  console.error("❌ yt-dlp not found!");
  return "yt-dlp";
}

process.env.YTDLP_BIN = findYtDlp();
console.log(`🎬 yt-dlp: ${process.env.YTDLP_BIN}`);

app.listen(PORT, () =>
  console.log(`🚀 Fetch.io backend at http://localhost:${PORT}`),
);
