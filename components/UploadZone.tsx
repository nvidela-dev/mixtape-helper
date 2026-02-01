'use client';

import { AudioUpload } from './AudioUpload';
import { ImageUpload } from './ImageUpload';
import type { UploadedAudio, UploadedImage } from '@/types';

interface UploadZoneProps {
  audio: UploadedAudio | null;
  image: UploadedImage | null;
  onAudioChange: (audio: UploadedAudio | null) => void;
  onImageChange: (image: UploadedImage | null) => void;
  disabled?: boolean;
}

export function UploadZone({
  audio,
  image,
  onAudioChange,
  onImageChange,
  disabled,
}: UploadZoneProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-sm font-medium text-brown/60 mb-2">Audio</h2>
        <AudioUpload audio={audio} onChange={onAudioChange} disabled={disabled} />
      </div>
      <div>
        <h2 className="text-sm font-medium text-brown/60 mb-2">Cover Image</h2>
        <ImageUpload image={image} onChange={onImageChange} disabled={disabled} />
      </div>
    </div>
  );
}
