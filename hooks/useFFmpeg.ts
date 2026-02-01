'use client';

import { useState, useCallback, useRef } from 'react';
import { loadFFmpeg, encodeVideo, isSharedArrayBufferSupported } from '@/lib/ffmpeg';

interface UseFFmpegReturn {
  encode: (
    audioFile: File,
    imageFile: File,
    onProgress?: (progress: number) => void
  ) => Promise<string>;
  cancel: () => void;
  isLoaded: boolean;
  isSupported: boolean;
}

export function useFFmpeg(): UseFFmpegReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const encode = useCallback(
    async (
      audioFile: File,
      imageFile: File,
      onProgress?: (progress: number) => void
    ): Promise<string> => {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        // Load FFmpeg if not already loaded
        await loadFFmpeg();
        setIsLoaded(true);

        if (signal.aborted) {
          throw new Error('Encoding cancelled');
        }

        // Encode video
        const data = await encodeVideo(audioFile, imageFile, onProgress, signal);

        if (signal.aborted) {
          throw new Error('Encoding cancelled');
        }

        // Create blob URL for download
        const blob = new Blob([new Uint8Array(data)], { type: 'video/mp4' });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('FFmpeg error:', error);
        throw error;
      } finally {
        abortControllerRef.current = null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    encode,
    cancel,
    isLoaded,
    isSupported: isSharedArrayBufferSupported(),
  };
}
