import { createWriteStream, mkdirSync, chmodSync, existsSync } from 'fs';
import { get } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const binDir  = join(__dirname, '..', 'bin');
const binPath = join(binDir, 'yt-dlp');

// Skip on Windows (use yt-dlp-wrap auto-download instead)
if (process.platform === 'win32') {
  console.log('Windows detected — skipping yt-dlp download');
  process.exit(0);
}

if (existsSync(binPath)) {
  console.log('yt-dlp already exists at', binPath);
  process.exit(0);
}

mkdirSync(binDir, { recursive: true });

const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
console.log('Downloading yt-dlp from', url);

function download(url, dest, redirects = 0) {
  if (redirects > 5) throw new Error('Too many redirects');
  get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return download(res.headers.location, dest, redirects + 1);
    }
    if (res.statusCode !== 200) {
      console.error('Failed to download yt-dlp, status:', res.statusCode);
      process.exit(1);
    }
    const file = createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      chmodSync(dest, '755');
      console.log('✅ yt-dlp downloaded to', dest);
    });
  }).on('error', (err) => {
    console.error('Download error:', err.message);
    process.exit(1);
  });
}

download(url, binPath);
