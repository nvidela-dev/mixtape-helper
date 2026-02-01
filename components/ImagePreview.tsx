'use client';

import { useEffect, useRef } from 'react';
import { drawPreviewFrame } from '@/lib/image';
import type { UploadedImage, Resolution } from '@/types';

interface ImagePreviewProps {
  image: UploadedImage;
  resolution: Resolution;
  backgroundColor?: string;
}

export function ImagePreview({
  image,
  resolution,
  backgroundColor = '#3D2B1F',
}: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      drawPreviewFrame(ctx, img, resolution, backgroundColor);
    };
    img.src = image.previewUrl;
  }, [image, resolution, backgroundColor]);

  const aspectRatio = resolution.width / resolution.height;
  const previewWidth = Math.min(500, resolution.width);
  const previewHeight = previewWidth / aspectRatio;

  return (
    <div>
      <h3 className="text-sm font-medium text-brown/60 mb-3">Output Preview</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={resolution.width}
          height={resolution.height}
          className="image-preview__canvas"
          style={
            {
              '--preview-width': `${previewWidth}px`,
              '--preview-height': `${previewHeight}px`,
              width: 'var(--preview-width)',
              height: 'var(--preview-height)',
            } as React.CSSProperties
          }
        />
      </div>
      <p className="text-xs text-brown/40 text-center mt-2">
        {resolution.width} x {resolution.height} (16:9)
      </p>
    </div>
  );
}
