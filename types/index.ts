export interface UploadedAudio {
  file: File;
  duration: number;
  name: string;
}

export interface UploadedImage {
  file: File;
  width: number;
  height: number;
  name: string;
  previewUrl: string;
}

export interface Resolution {
  width: number;
  height: number;
}

export interface Settings {
  resolution: '1080p' | '720p' | '480p';
  backgroundColor: string;
  audioBitrate: '128k' | '192k' | '256k' | '320k';
}

export type ExportStatus = 'idle' | 'loading' | 'processing' | 'complete' | 'error';

export interface ExportState {
  status: ExportStatus;
  progress: number;
  error?: string;
}

export const RESOLUTION_MAP: Record<Settings['resolution'], Resolution> = {
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
  '480p': { width: 854, height: 480 },
};

export const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/aac',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
];

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
