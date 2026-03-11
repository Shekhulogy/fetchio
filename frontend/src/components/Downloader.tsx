import { useState, useRef, useEffect } from "react";
import type { Platform, Quality } from "../types";
import { useDownloader, detectPlatform } from "../hooks/useDownloader";
import PreviewSection from "./PreviewSection";

const QUALITIES: { value: Quality; label: string; tag?: string }[] = [
  { value: "4k", label: "4K", tag: "4K" },
  { value: "2k", label: "2K", tag: "2K" },
  { value: "1080p", label: "1080p", tag: "HD" },
  { value: "720p", label: "720p" },
  { value: "480p", label: "480p" },
  { value: "mp3", label: "MP3 Audio", tag: "AUDIO" },
];

const TABS: {
  id: Platform;
  label: string;
  icon: React.ReactNode;
  color: string;
  border: string;
}[] = [
  {
    id: "yt",
    label: "YouTube",
    color: "#ff4444",
    border: "rgba(255,68,68,0.22)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "ig",
    label: "Instagram",
    color: "#e1306c",
    border: "rgba(225,48,108,0.22)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Any Site",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.22)",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const PLACEHOLDER: Record<Platform, string> = {
  yt: "Paste YouTube URL… (watch?v=, youtu.be/, /shorts/)",
  ig: "Paste Instagram URL… (instagram.com/p/, /reel/)",
  other: "Paste any URL — TikTok, Twitter/X, Facebook, Vimeo, Reddit…",
};

export default function Downloader() {
  const [tab, setTab] = useState<Platform>("yt");
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<Quality>("1080p");
  const inputRef = useRef<HTMLInputElement>(null);

  const { preview, downloadState, fetchInfo, download, reset, exactFilesize } =
    useDownloader();

  const currentTab = TABS.find((t) => t.id === tab)!;

  // Auto-switch tab when URL is pasted
  useEffect(() => {
    if (!url) return;
    const detected = detectPlatform(url);
    if (detected !== tab) setTab(detected);
  }, [url]);

  const handleFetch = () => {
    if (!url.trim()) return;
    fetchInfo(url.trim(), tab);
  };

  const handleDownload = async () => {
    if (preview.status !== "success") return;
    await download(url.trim(), quality, preview.info.title);
  };

  const handleTabSwitch = (t: Platform) => {
    setTab(t);
    reset();
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setUrl("");
    reset();
    inputRef.current?.focus();
  };

  // Filter qualities by what the video actually has
  const maxHeight =
    preview.status === "success"
      ? (preview.info.maxHeight ?? Infinity)
      : Infinity;
  const heightMap: Record<Quality, number> = {
    "4k": 2160,
    "2k": 1440,
    "1080p": 1080,
    "720p": 720,
    "480p": 480,
    mp3: 0,
  };
  const availableQualities = QUALITIES.filter(
    (q) =>
      q.value === "mp3" ||
      preview.status !== "success" ||
      heightMap[q.value] <= maxHeight,
  );

  // Auto-select best available quality when info loads
  useEffect(() => {
    if (preview.status === "success" && preview.info.maxHeight) {
      const best = QUALITIES.find(
        (q) =>
          q.value !== "mp3" && heightMap[q.value] <= preview.info.maxHeight!,
      );
      if (best && heightMap[quality] > preview.info.maxHeight)
        setQuality(best.value);
    }
  }, [preview.status]);

  // Show quality selector for YouTube and "other" platforms (not IG — no quality choice)
  const showQuality = tab !== "ig";

  return (
    <div className="fade-up">
      {/* ── Tabs ── */}
      <div className="flex gap-1.5 bg-card border border-white/[0.07] rounded-[13px] p-1.5 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabSwitch(t.id)}
            className="flex-1 py-2 sm:py-2.5 px-2 sm:px-5 rounded-[9px] border text-[12px] sm:text-[13.5px] font-medium flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all"
            style={
              tab === t.id
                ? {
                    background: t.color + "12",
                    color: "#fff",
                    borderColor: t.color + "50",
                  }
                : {
                    background: "transparent",
                    color: "#555",
                    borderColor: "transparent",
                  }
            }
          >
            <span
              style={
                tab === t.id ? { color: t.color } : { color: "currentColor" }
              }
            >
              {t.icon}
            </span>
            <span className="hidden xs:inline sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Input card ── */}
      <div
        className="bg-card rounded-2xl p-4 sm:p-[22px] transition-all"
        style={{
          border: `1px solid ${currentTab.border}`,
          boxShadow: `0 0 32px ${currentTab.color}08`,
        }}
      >
        {/* URL input row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <LinkIcon />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder={PLACEHOLDER[tab]}
              className="w-full h-[46px] sm:h-[50px] bg-surface border border-white/[0.07] rounded-[9px] pl-[42px] pr-10 text-text placeholder:text-muted text-[13px] sm:text-[13.5px] outline-none transition-colors focus:border-white/[0.14]"
            />
            {url && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleFetch}
            disabled={preview.status === "loading"}
            className="h-[46px] sm:h-[50px] px-5 sm:px-6 rounded-[9px] border-0 grad-bg text-white text-[13px] sm:text-[13.5px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-wait whitespace-nowrap"
            style={{
              boxShadow:
                preview.status === "loading"
                  ? "none"
                  : "0 0 22px rgba(255,68,68,0.35)",
            }}
          >
            {preview.status === "loading" ? (
              <Spinner color="#fff" />
            ) : (
              <FetchIcon />
            )}
            {preview.status === "loading" ? "Fetching…" : "Fetch"}
          </button>
        </div>

        {/* Quality selector */}
        {showQuality && (
          <div className="mt-4">
            <p className="text-[10.5px] font-medium text-muted uppercase tracking-[0.1em] mb-2.5">
              Quality & Format
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableQualities.map((q) => {
                const filesize =
                  preview.status === "success"
                    ? (preview.info.qualityFilesizes?.[q.value] ?? null)
                    : null;
                const isSelected = quality === q.value;
                return (
                  <button
                    key={q.value}
                    onClick={() => setQuality(q.value)}
                    className="px-3 sm:px-3.5 py-1.5 rounded-[7px] border text-[12px] sm:text-[12.5px] font-medium flex items-center gap-1.5 transition-all"
                    style={
                      isSelected
                        ? {
                            color: "#fff",
                            borderColor: "rgba(255,68,68,0.4)",
                            background: "rgba(255,68,68,0.12)",
                            boxShadow: "0 0 10px rgba(255,68,68,0.15)",
                          }
                        : {
                            color: "#888",
                            borderColor: "rgba(255,255,255,0.07)",
                            background: "transparent",
                          }
                    }
                  >
                    {q.label}
                    {q.tag && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-muted2 font-bold tracking-[0.05em]">
                        {q.tag}
                      </span>
                    )}
                    {filesize && (
                      <span className="text-[10px] opacity-50 ml-0.5">
                        ~{filesize}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ffmpeg warning */}
        {preview.status === "success" &&
          !preview.info.ffmpegFound &&
          ["1080p", "2k", "4k"].includes(quality) && (
            <div className="flex items-start gap-2.5 mt-3 px-3.5 py-2.5 bg-yellow-500/[0.07] border border-yellow-500/20 rounded-[8px] text-yellow-300/80 text-[12.5px] leading-relaxed">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 mt-0.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>
                <strong className="text-yellow-300 font-semibold">
                  ffmpeg not found
                </strong>{" "}
                — {quality} requires ffmpeg to merge video+audio. Will fall back
                to 720p.{" "}
                <code className="bg-white/[0.06] px-1 rounded text-[11px]">
                  winget install ffmpeg
                </code>{" "}
                then restart the backend.
              </span>
            </div>
          )}

        {/* Supported sites hint for "other" tab */}
        {tab === "other" && preview.status === "idle" && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              "TikTok",
              "Twitter/X",
              "Facebook",
              "Reddit",
              "Vimeo",
              "Twitch",
              "SoundCloud",
              "Dailymotion",
              "Pinterest",
              "1000+ more",
            ].map((s) => (
              <span
                key={s}
                className="text-[10.5px] text-muted2 border border-white/[0.07] px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {preview.status === "error" && (
          <div className="flex items-center gap-2.5 mt-3 px-3.5 py-2.5 bg-red-500/[0.06] border border-red-500/20 rounded-[8px] text-red-300 text-[13px]">
            <ErrorIcon />
            {preview.message}
          </div>
        )}
      </div>

      {/* ── Preview ── */}
      {preview.status === "success" && (
        <PreviewSection
          info={preview.info}
          quality={quality}
          downloadState={downloadState}
          onDownload={handleDownload}
          filesize={
            exactFilesize ?? preview.info.qualityFilesizes?.[quality] ?? null
          }
          isExactSize={!!exactFilesize}
        />
      )}
    </div>
  );
}

function Spinner({ color = "#0a0a0a" }: { color?: string }) {
  return (
    <div
      className="w-4 h-4 rounded-full border-[1.5px] animate-spin"
      style={{ borderColor: color + "44", borderTopColor: color }}
    />
  );
}
function FetchIcon() {
  return (
    <svg
      width="14"
      height="14"
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
function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function ErrorIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
