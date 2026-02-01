'use client';

import { useCallback } from 'react';
import { validateAudioFile, getAudioDuration, formatDuration, formatFileSize } from '@/lib/utils';
import type { UploadedAudio } from '@/types';

interface AudioUploadProps {
  audio: UploadedAudio | null;
  onChange: (audio: UploadedAudio | null) => void;
  disabled?: boolean;
}

export function AudioUpload({ audio, onChange, disabled }: AudioUploadProps) {
  const handleFile = useCallback(
    async (file: File) => {
      const error = validateAudioFile(file);
      if (error) {
        alert(error);
        return;
      }

      try {
        const duration = await getAudioDuration(file);
        onChange({
          file,
          duration,
          name: file.name,
        });
      } catch {
        alert('Failed to read audio file');
      }
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (audio) {
    return (
      <div className="p-4 bg-paper rounded-lg border border-tan">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-olive rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-brown truncate max-w-[200px]">{audio.name}</p>
              <p className="text-sm text-brown/60">
                {formatDuration(audio.duration)} &middot; {formatFileSize(audio.file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChange(null)}
            disabled={disabled}
            className="p-2 text-brown/40 hover:text-brown hover:bg-tan/20 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Remove audio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {audio.duration > 15 * 60 && (
          <p className="mt-2 text-sm text-orange">
            Long audio detected ({formatDuration(audio.duration)}). Encoding may take a while.
          </p>
        )}
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`block p-6 border-2 border-dashed border-tan rounded-lg text-center cursor-pointer hover:border-olive transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        type="file"
        accept=".mp3,.wav,.flac,.aac,.ogg,.m4a,audio/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="text-brown/60">
        <svg className="w-8 h-8 mx-auto mb-2 text-tan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <p className="font-medium">Drop audio file here</p>
        <p className="text-sm mt-1">or click to browse</p>
        <p className="text-xs mt-2 text-brown/40">MP3, WAV, FLAC, AAC, OGG, M4A (max 100MB)</p>
      </div>
    </label>
  );
}
