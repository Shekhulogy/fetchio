import express from "express";
import cors from "cors";
import mediaRouter from "./routes/media";
import path from "path";
import fs from "fs";

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
  if (process.env.YTDLP_BIN && fs.existsSync(process.env.YTDLP_BIN)) {
    return process.env.YTDLP_BIN;
  }

  // 2. Local bin (downloaded during Railway build via nixpacks)
  const localBin = path.join(__dirname, "..", "bin", "yt-dlp");
  if (fs.existsSync(localBin)) {
    console.log("✅  yt-dlp from local bin:", localBin);
    return localBin;
  }

  // 3. Windows local bin
  const winBin = path.join(__dirname, "..", "bin", "yt-dlp.exe");
  if (fs.existsSync(winBin)) return winBin;

  // 4. Common system paths
  const sysPaths = ["/usr/local/bin/yt-dlp", "/usr/bin/yt-dlp"];
  for (const p of sysPaths) {
    if (fs.existsSync(p)) {
      console.log("✅  yt-dlp from system:", p);
      return p;
    }
  }

  console.warn("⚠️  yt-dlp not found anywhere!");
  return "yt-dlp";
}

const ytdlpBin = findYtDlp();
process.env.YTDLP_BIN = ytdlpBin;

app.listen(PORT, () => {
  console.log(`🚀  Fetch.io backend at http://localhost:${PORT}`);
  console.log(`🎬  yt-dlp: ${ytdlpBin}`);
});
