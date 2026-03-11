import { createWriteStream, chmodSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const binDir  = join(__dirname, '..', 'bin');
const binPath = join(binDir, 'yt-dlp');

if (process.platform === 'win32') process.exit(0);

// Always re-download to get latest version
if (existsSync(binPath)) {
  try { unlinkSync(binPath); } catch {}
}

console.log('⬇️  Downloading latest yt-dlp_linux...');
mkdirSync(binDir, { recursive: true });

// Use specific latest release URL
const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';

function download(url, dest, redirectCount = 0) {
  if (redirectCount > 10) throw new Error('Too many redirects');
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'yt-dlp-installer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        return resolve(download(res.headers.location, dest, redirectCount + 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const file = createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        chmodSync(dest, '755');
        console.log('✅  yt-dlp_linux downloaded:', dest);
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

download(url, binPath).catch(err => {
  console.error('❌  Failed:', err.message);
  process.exit(1);
});
