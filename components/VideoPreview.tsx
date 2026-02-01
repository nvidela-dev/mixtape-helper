'use client';

import { DownloadButton } from './DownloadButton';

interface VideoPreviewProps {
  url: string;
  filename: string;
}

export function VideoPreview({ url, filename }: VideoPreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-brown/60">Your Video</h3>
      <div className="aspect-video rounded-lg overflow-hidden bg-brown border border-tan">
        <video
          src={url}
          controls
          className="w-full h-full"
          playsInline
        />
      </div>
      <DownloadButton url={url} filename={filename} />
    </div>
  );
}
