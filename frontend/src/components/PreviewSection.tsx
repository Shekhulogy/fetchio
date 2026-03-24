import { useState } from "react";
import type { MediaInfo, Quality, DownloadState } from "../types";

interface Props {
  info: MediaInfo;
  quality: Quality;
  downloadState: DownloadState;
  onDownload: () => void;
  filesize?: string | null;
  isExactSize?: boolean;
  downloadProgress?: number;
}

export default function PreviewSection({
  info,
  quality,
  downloadState,
  onDownload,
  filesize,
  isExactSize,
  downloadProgress = 0,
}: Props) {
  const isAudio = quality === "mp3";
  const API_BASE = import.meta.env.VITE_API_BASE ?? "";
  const thumbUrl = info.thumbnail
    ? `${API_BASE}/api/thumbnail?url=${encodeURIComponent(info.thumbnail)}`
    : null;
  const watchUrl = info.webpage_url;
  const fmt = isAudio ? "MP3 Audio" : quality.toUpperCase();
  const [imgError, setImgError] = useState(false);

  const isYT = info.platform === "youtube";
  const isIG = info.platform === "instagram";
  const isVideoMedia = !isIG || !!info.duration;

  // Platform accent colors
  const platformColor = isYT ? "#ff4444" : isIG ? "#e1306c" : "#888";
  const platformBorder = isYT
    ? "rgba(255,68,68,0.25)"
    : isIG
      ? "rgba(225,48,108,0.25)"
      : "rgba(255,255,255,0.07)";
  const platformBg = isYT
    ? "rgba(255,68,68,0.08)"
    : isIG
      ? "rgba(225,48,108,0.08)"
      : "rgba(255,255,255,0.04)";
  const platformLabel = isYT ? "YouTube" : isIG ? "Instagram" : info.platform;

  return (
    <div className="mt-3.5 fade-up">
      {/* ── Thumbnail ── */}
      {isVideoMedia ? (
        <div
          className="relative w-full rounded-t-xl overflow-hidden bg-[#111] border-b-0 cursor-pointer group"
          style={{ aspectRatio: "16/9", border: `1px solid ${platformBorder}` }}
          onClick={() => window.open(watchUrl, "_blank")}
        >
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={info.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
            />
          ) : (
            <ThumbnailFallback
              title={info.title}
              author={info.author}
              color={platformColor}
            />
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
            <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-[0_6px_28px_rgba(255,68,68,0.4)] transition-transform group-hover:scale-110 grad-bg">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>

          {/* Format badge */}
          <div className="absolute bottom-2.5 right-3 bg-black/75 text-white text-[11px] font-semibold px-2 py-0.5 rounded z-10 tracking-[0.05em]">
            {fmt}
          </div>

          {/* Platform badge — colored */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md z-10 tracking-[0.04em]"
            style={{
              background: "rgba(0,0,0,0.55)",
              color: platformColor,
              backdropFilter: "blur(4px)",
            }}
          >
            <PlatformIcon platform={info.platform} color={platformColor} />
            {platformLabel}
          </div>
        </div>
      ) : (
        <div
          className="rounded-t-xl overflow-hidden bg-black border-b-0"
          style={{ border: `1px solid ${platformBorder}` }}
        >
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={info.title}
              className="w-full max-h-[520px] object-contain block"
              onError={() => setImgError(true)}
            />
          ) : (
            <ThumbnailFallback
              title={info.title}
              author={info.author}
              color={platformColor}
            />
          )}
        </div>
      )}

      {/* ── Meta bar ── */}
      <div
        className="flex flex-col rounded-b-xl overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${platformBg}, rgba(17,17,17,1) 60%)`,
          border: `1px solid ${platformBorder}`,
          borderTop: "none",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3.5 px-3.5 sm:px-4 py-3 sm:py-3.5">
          {/* Gradient left stripe */}
          <div
            className="hidden sm:block w-[3px] self-stretch rounded-full flex-shrink-0 grad-bg"
            style={{ opacity: 0.85 }}
          />
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-[20px] sm:text-[22px] flex-shrink-0">
              {isAudio ? "🎵" : isVideoMedia ? "🎬" : "🖼️"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] sm:text-[13.5px] font-medium text-text truncate">
                {info.title}
              </p>
              <p className="text-[11px] sm:text-[11.5px] text-muted2 mt-0.5">
                {info.author ? `${info.author} · ` : ""}
                {info.duration ? `${info.duration} · ` : ""}
                {fmt}
                {filesize
                  ? ` · ${isExactSize ? filesize : `~${filesize}`}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 sm:ml-0 ml-auto">
            {/* Platform-colored type badge */}
            <span
              className="text-[9px] sm:text-[10px] font-semibold tracking-[0.06em] uppercase px-2 sm:px-2.5 py-1 rounded-full hidden sm:block"
              style={{
                background: platformBg,
                border: `1px solid ${platformBorder}`,
                color: platformColor,
              }}
            >
              {isAudio ? "Audio" : isVideoMedia ? "Video" : "Photo"}
            </span>

            {/* Watch / Open button */}
            {(isYT || isIG) && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[32px] sm:h-[34px] px-3 sm:px-3.5 rounded-[7px] border border-white/[0.07] bg-transparent text-muted2 text-[12px] sm:text-[12.5px] font-medium flex items-center gap-1.5 hover:text-text hover:border-white/[0.14] transition-all whitespace-nowrap"
              >
                <ExternalIcon />
                {isYT ? "Watch" : "Open"}
              </a>
            )}

            <DownloadButton
              state={downloadState}
              onClick={onDownload}
              color={platformColor}
              progress={downloadProgress}
            />
          </div>
        </div>

        {/* ── Progress Bar (inside meta bar) ── */}
        {(downloadState === "downloading" || downloadState === "done") && (
          <div className="px-3.5 sm:px-4 pb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted2">
                {downloadState === "done"
                  ? "✓ Download complete!"
                  : downloadProgress === -1
                    ? "Processing…"
                    : downloadProgress < 5
                      ? "Starting…"
                      : "Downloading…"}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{
                  color: downloadState === "done" ? "#22c55e" : platformColor,
                }}
              >
                {downloadState === "done"
                  ? filesize
                    ? isExactSize
                      ? filesize
                      : `~${filesize}`
                    : ""
                  : downloadProgress > 0
                    ? `${downloadProgress}%`
                    : ""}
              </span>
            </div>
            {/* Track */}
            <div
              className="h-[3px] w-full rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              {downloadState === "done" ? (
                <div
                  className="h-full w-full rounded-full transition-all duration-500"
                  style={{ background: "#22c55e" }}
                />
              ) : downloadProgress === -1 ? (
                // Indeterminate — server is processing (yt-dlp running)
                <div
                  className="h-full rounded-full grad-bg"
                  style={{
                    width: "35%",
                    animation: "slideProgress 1.2s ease-in-out infinite",
                    boxShadow: "0 0 6px rgba(255,68,68,0.6)",
                  }}
                />
              ) : (
                // Determinate — real progress from Content-Length
                <div
                  className="h-full rounded-full grad-bg transition-all duration-200 ease-out"
                  style={{
                    width: `${downloadProgress}%`,
                    boxShadow: "0 0 6px rgba(255,68,68,0.5)",
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Download button with states ── */
function DownloadButton({
  state,
  onClick,
  color,
  progress,
}: {
  state: DownloadState;
  onClick: () => void;
  color: string;
  progress: number;
}) {
  const base =
    "h-[32px] sm:h-[34px] px-3.5 sm:px-4 rounded-[7px] border text-[12px] sm:text-[12.5px] font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap";

  if (state === "downloading") {
    const isIndeterminate = progress === -1;
    const pct = isIndeterminate ? 0 : progress;
    return (
      <button
        disabled
        className={`${base} cursor-not-allowed`}
        style={{ background: color + "15", borderColor: color + "50", color }}
      >
        <Spinner color={color} />
        {isIndeterminate || pct < 5 ? "Processing…" : `Downloading… ${pct}%`}
      </button>
    );
  }
  if (state === "done")
    return (
      <button
        disabled
        className={`${base}`}
        style={{
          background: "rgba(34,197,94,0.15)",
          borderColor: "rgba(34,197,94,0.35)",
          color: "#22c55e",
        }}
      >
        ✓ Done
      </button>
    );
  if (state === "error")
    return (
      <button
        onClick={onClick}
        className={`${base} bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30`}
      >
        ↺ Retry
      </button>
    );
  return (
    <button
      onClick={onClick}
      className={`${base} active:scale-95 grad-bg`}
      style={{
        borderColor: "transparent",
        color: "#fff",
        boxShadow: "0 0 20px rgba(255,68,68,0.4)",
      }}
    >
      <DownloadIcon />
      Download
    </button>
  );
}

/* ── Fallback when thumbnail fails ── */
function ThumbnailFallback({
  title,
  author,
  color,
}: {
  title: string;
  author: string;
  color: string;
}) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-4 px-8 text-center"
      style={{
        aspectRatio: "16/9",
        background: `radial-gradient(ellipse at center, ${color}10 0%, #111 70%)`,
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill={color}
          opacity="0.7"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
      <div>
        <p className="text-[15px] font-semibold text-white/80 leading-snug max-w-md">
          {title}
        </p>
        {author && <p className="text-[12px] text-white/30 mt-1">{author}</p>}
      </div>
    </div>
  );
}

/* ── Icons ── */
function PlatformIcon({
  platform,
  color,
}: {
  platform: string;
  color: string;
}) {
  if (platform === "youtube") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <div
      className="w-3 h-3 rounded-full border-[1.5px] animate-spin flex-shrink-0"
      style={{ borderColor: color + "33", borderTopColor: color }}
    />
  );
}
