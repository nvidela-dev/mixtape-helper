'use client';

import { useCallback } from 'react';

interface DownloadButtonProps {
  url: string;
  filename: string;
}

export function DownloadButton({ url, filename }: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [url, filename]);

  return (
    <button
      onClick={handleDownload}
      className="w-full py-3 px-4 bg-olive hover:bg-forest text-cream rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download MP4
    </button>
  );
}
