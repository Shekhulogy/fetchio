# Fetch.io — Media Downloader

Full-stack YouTube & Instagram downloader.  
**Frontend:** Vite + React + TypeScript + Tailwind CSS  
**Backend:** Express.js + TypeScript + yt-dlp

---

## Project Structure

```
fetchio/
├── backend/          Express API server
│   └── src/
│       ├── index.ts           Entry point + yt-dlp auto-download
│       └── routes/media.ts    /api/info  /api/thumbnail  /api/download
└── frontend/         Vite React app
    └── src/
        ├── components/
        │   ├── Nav.tsx
        │   ├── Hero.tsx
        │   ├── Downloader.tsx      Main input + format selector
        │   ├── PreviewSection.tsx  Thumbnail + meta + download button
        │   └── Misc.tsx            Steps, Platforms, Footer
        ├── hooks/useDownloader.ts  Fetch + download logic
        ├── types/index.ts
        └── App.tsx
```

---

## Setup

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

On first run it **auto-downloads the yt-dlp binary** into `backend/bin/`.  
The server starts at **http://localhost:3001**.

> **Note:** If auto-download fails or you get an `ENOENT` error:
>
> **Windows** — delete `backend/bin/` folder (if it exists), then run `npm run dev` again. It will re-download `yt-dlp.exe` automatically.  
> Or install manually via **winget**:
> ```powershell
> winget install yt-dlp
> ```
> Or via **pip**:
> ```powershell
> pip install yt-dlp
> ```
>
> **macOS:**
> ```bash
> brew install yt-dlp
> ```
>
> **Linux:**
> ```bash
> sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
> sudo chmod a+rx /usr/local/bin/yt-dlp
> ```
>
> Also install **ffmpeg** for merging video+audio streams:
> ```bash
> winget install ffmpeg          # Windows
> brew install ffmpeg            # macOS
> sudo apt install ffmpeg        # Linux
> ```

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

Opens at **http://localhost:5173**.  
The Vite dev server proxies `/api/*` → `http://localhost:3001`.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/info?url=` | Returns title, author, thumbnail URL, duration, formats |
| GET | `/api/thumbnail?url=` | Proxies thumbnail image (bypasses browser CORS) |
| GET | `/api/download?url=&format=` | Streams file download (mp4 / mp3) |
| GET | `/health` | Server health check |

### Format values
`4k` · `1080p` · `720p` · `480p` · `mp3`

---

## How thumbnails work

The browser can't load `i.ytimg.com` images directly due to CORS.  
The frontend calls `/api/thumbnail?url=<thumbnail-url>` → Express fetches  
the image server-side and streams it back — no CORS issue.

---

## Production build

```bash
# Build frontend
cd frontend && npm run build   # outputs to frontend/dist/

# Build backend
cd backend && npm run build    # outputs to backend/dist/

# Serve frontend from Express (add to backend/src/index.ts):
# app.use(express.static(path.join(__dirname, '../../frontend/dist')))
```
