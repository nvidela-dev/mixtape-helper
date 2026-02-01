'use client';

import type { ExportState } from '@/types';

interface ExportProgressProps {
  state: ExportState;
  onCancel: () => void;
}

export function ExportProgress({ state, onCancel }: ExportProgressProps) {
  const statusText = {
    idle: '',
    loading: 'Loading FFmpeg...',
    processing: 'Encoding video...',
    complete: 'Complete!',
    error: 'Error',
  }[state.status];

  const progressWidth = state.status === 'loading' ? '10%' : `${state.progress}%`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-medium text-brown">{statusText}</p>
          {state.status === 'processing' && (
            <p className="text-sm text-brown/60">
              {Math.round(state.progress)}% complete
            </p>
          )}
          {state.status === 'loading' && (
            <p className="text-sm text-brown/60">
              Downloading FFmpeg core (~30MB)
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-tan text-brown/60 hover:text-brown hover:border-olive rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
      <div className="export-progress__bar-container">
        <div
          className="export-progress__bar"
          style={
            {
              '--progress-width': progressWidth,
              width: 'var(--progress-width)',
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
