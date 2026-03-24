import { useState, useCallback } from "react";
import type { Platform, Quality, PreviewState, DownloadState } from "../types";

function normalizeUrl(raw: string): string {
  if (/^https?:\/\//i.test(raw)) return raw;
  return "https://" + raw;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function detectPlatform(url: string): Platform {
  if (/youtube\.com|youtu\.be/i.test(url)) return "yt";
  if (/instagram\.com/i.test(url)) return "ig";
  return "other";
}

export function useDownloader() {
  const [preview, setPreview] = useState<PreviewState>({ status: "idle" });
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [exactFilesize, setExactFilesize] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0); // 0–100, -1 = indeterminate

  const fetchInfo = useCallback(async (rawUrl: string, platform: Platform) => {
    const url = normalizeUrl(rawUrl);

    if (platform === "yt") {
      const ytPatterns = [
        /[?&]v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /\/shorts\/([a-zA-Z0-9_-]{11})/,
        /\/embed\/([a-zA-Z0-9_-]{11})/,
        /\/live\/([a-zA-Z0-9_-]{11})/,
      ];
      if (!ytPatterns.some((p) => p.test(url))) {
        setPreview({
          status: "error",
          message:
            "Couldn't extract a YouTube video ID. Try copying the full URL.",
        });
        return;
      }
    }

    setPreview({ status: "loading" });
    setExactFilesize(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/info?url=${encodeURIComponent(url)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setPreview({
          status: "error",
          message: data.error ?? "Failed to fetch media info.",
        });
        return;
      }
      setPreview({ status: "success", info: data });
    } catch {
      setPreview({
        status: "error",
        message: "Cannot reach server. Make sure the backend is running.",
      });
    }
  }, []);

  const download = useCallback(
    async (url: string, quality: Quality, filename?: string) => {
      setDownloadState("downloading");
      setDownloadProgress(-1); // indeterminate while server processes
      setExactFilesize(null);

      try {
        const normalized = normalizeUrl(url);
        const dlUrl = `${API_BASE}/api/download?url=${encodeURIComponent(normalized)}&format=${quality}`;

        const res = await fetch(dlUrl);
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: "Download failed" }));
          throw new Error(err.error ?? "Download failed");
        }

        // Server responded — we now have Content-Length, switch to determinate
        const contentLength = res.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : null;
        setDownloadProgress(0);

        // Stream with real progress
        const reader = res.body!.getReader();
        const chunks: Uint8Array<ArrayBuffer>[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (total) setDownloadProgress(Math.round((received / total) * 100));
        }

        setDownloadProgress(100);

        const blob = new Blob(chunks);
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const ext = quality === "mp3" ? "mp3" : "mp4";
        a.href = blobUrl;
        a.download = filename
          ? `${filename}.${ext}`
          : `fetchio_download.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

        setExactFilesize(
          total
            ? formatBytes(total)
            : blob.size > 0
              ? formatBytes(blob.size)
              : null,
        );
        setDownloadState("done");
        setTimeout(() => {
          setDownloadState("idle");
          setDownloadProgress(0);
        }, 4000);
      } catch (err: any) {
        setDownloadState("error");
        setDownloadProgress(0);
        setTimeout(() => setDownloadState("idle"), 3000);
        throw err;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setPreview({ status: "idle" });
    setDownloadState("idle");
    setExactFilesize(null);
    setDownloadProgress(0);
  }, []);

  return {
    preview,
    downloadState,
    fetchInfo,
    download,
    reset,
    exactFilesize,
    downloadProgress,
  };
}
