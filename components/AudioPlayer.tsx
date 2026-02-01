'use client';

import { useRef, useState, useCallback } from 'react';
import { formatDuration } from '@/lib/utils';
import type { UploadedAudio } from '@/types';

interface AudioPlayerProps {
  audio: UploadedAudio;
}

export function AudioPlayer({ audio }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
    } else {
      el.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (el) setCurrentTime(el.currentTime);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (el) {
      el.currentTime = Number(e.target.value);
      setCurrentTime(el.currentTime);
    }
  }, []);

  return (
    <div>
      <h3 className="text-sm font-medium text-brown/60 mb-3">Audio Preview</h3>
      <audio
        ref={audioRef}
        src={URL.createObjectURL(audio.file)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-olive hover:bg-forest text-cream rounded-full transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={audio.duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
        </div>
        <span className="text-sm text-brown/60 tabular-nums">
          {formatDuration(currentTime)} / {formatDuration(audio.duration)}
        </span>
      </div>
    </div>
  );
}
