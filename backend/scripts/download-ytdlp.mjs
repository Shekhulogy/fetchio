import { createWriteStream, chmodSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const binDir  = join(__dirname, '..', 'bin');
const binPath = join(binDir, 'yt-dlp');

// Skip on Windows
if (process.platform === 'win32') {
  console.log('⏭️  Skipping yt-dlp download on Windows (use local binary)');
  process.exit(0);
}

if (existsSync(binPath)) {
  console.log('✅  yt-dlp already exists at:', binPath);
  // Make sure it's executable
  chmodSync(binPath, '755');
  process.exit(0);
}

console.log('⬇️  Downloading yt-dlp_linux standalone binary...');
mkdirSync(binDir, { recursive: true });

const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';

function download(url, dest, redirectCount = 0) {
  if (redirectCount > 5) throw new Error('Too many redirects');
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return resolve(download(res.headers.location, dest, redirectCount + 1));
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        chmodSync(dest, '755');
        console.log('✅  yt-dlp downloaded to:', dest);
        resolve();
      });
    }).on('error', reject);
  });
}

download(url, binPath).catch(err => {
  console.error('❌  Failed to download yt-dlp:', err.message);
  process.exit(1);
});
