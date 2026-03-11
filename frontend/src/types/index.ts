export type Platform = 'yt' | 'ig' | 'other'
export type Quality  = '4k' | '2k' | '1080p' | '720p' | '480p' | 'mp3'

export interface MediaInfo {
  title:            string
  author:           string
  thumbnail:        string | null
  duration:         string | null
  platform:         string
  webpage_url:      string
  qualityFilesizes: Record<string, string | null>
  maxHeight:        number | null
  ffmpegFound:      boolean
}

export type PreviewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error';   message: string }
  | { status: 'success'; info: MediaInfo }

export type DownloadState = 'idle' | 'downloading' | 'done' | 'error'
