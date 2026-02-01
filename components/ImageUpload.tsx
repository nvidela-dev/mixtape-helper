'use client';

import { useCallback } from 'react';
import { validateImageFile, getImageDimensions, formatFileSize } from '@/lib/utils';
import type { UploadedImage } from '@/types';

interface ImageUploadProps {
  image: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ image, onChange, disabled }: ImageUploadProps) {
  const handleFile = useCallback(
    async (file: File) => {
      const error = validateImageFile(file);
      if (error) {
        alert(error);
        return;
      }

      try {
        const dimensions = await getImageDimensions(file);
        const previewUrl = URL.createObjectURL(file);
        onChange({
          file,
          width: dimensions.width,
          height: dimensions.height,
          name: file.name,
          previewUrl,
        });
      } catch {
        alert('Failed to read image file');
      }
    },
    [onChange],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
      onChange(null);
    }
  }, [image, onChange]);

  if (image) {
    return (
      <div className="p-4 bg-paper rounded-lg border border-tan">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={image.previewUrl}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-lg border border-tan"
            />
            <div>
              <p className="font-medium text-brown truncate max-w-[200px]">{image.name}</p>
              <p className="text-sm text-brown/60">
                {image.width} x {image.height} &middot; {formatFileSize(image.file.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="p-2 text-brown/40 hover:text-brown hover:bg-tan/20 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Remove image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {(image.width > 8000 || image.height > 8000) && (
          <p className="mt-2 text-sm text-orange">
            Very large image ({image.width}x{image.height}). Encoding may take a while.
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
        accept=".jpg,.jpeg,.png,.webp,image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="text-brown/60">
        <svg className="w-8 h-8 mx-auto mb-2 text-tan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-medium">Drop image file here</p>
        <p className="text-sm mt-1">or click to browse</p>
        <p className="text-xs mt-2 text-brown/40">JPG, PNG, WebP (max 20MB)</p>
      </div>
    </label>
  );
}
