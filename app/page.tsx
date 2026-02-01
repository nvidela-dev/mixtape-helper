'use client';

import { useState, useCallback } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { AudioPlayer } from '@/components/AudioPlayer';
import { ExportProgress } from '@/components/ExportProgress';
import { VideoPreview } from '@/components/VideoPreview';
import { CassetteDeck } from '@/components/CassetteDeck';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import type { UploadedAudio, UploadedImage, ExportState } from '@/types';

function LeafDecoration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 155 Q60 80 60 10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M60 130 Q30 120 20 100 Q35 105 60 115" fill="currentColor" opacity="0.4" />
      <path d="M60 100 Q25 85 15 60 Q35 70 60 85" fill="currentColor" opacity="0.5" />
      <path d="M60 70 Q30 50 25 25 Q40 40 60 55" fill="currentColor" opacity="0.6" />
      <path d="M60 120 Q90 110 100 90 Q85 95 60 105" fill="currentColor" opacity="0.4" />
      <path d="M60 90 Q95 75 105 50 Q85 60 60 75" fill="currentColor" opacity="0.5" />
      <path d="M60 55 Q85 35 90 15 Q75 30 60 45" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function Home() {
  const [audio, setAudio] = useState<UploadedAudio | null>(null);
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [exportState, setExportState] = useState<ExportState>({
    status: 'idle',
    progress: 0,
  });
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const { encode, cancel, isSupported } = useFFmpeg();

  const handleExport = useCallback(async () => {
    if (!audio || !image) return;

    setExportState({ status: 'loading', progress: 0 });
    setOutputUrl(null);

    try {
      const result = await encode(audio.file, image.file, (progress) => {
        setExportState({ status: 'processing', progress });
      });

      setOutputUrl(result);
      setExportState({ status: 'complete', progress: 100 });
    } catch (error) {
      console.error('Export error:', error);
      if (error instanceof Error && error.message === 'Encoding cancelled') {
        setExportState({ status: 'idle', progress: 0 });
      } else {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String(error.message);
        }
        setExportState({
          status: 'error',
          progress: 0,
          error: errorMessage,
        });
      }
    }
  }, [audio, image, encode]);

  const handleCancel = useCallback(() => {
    cancel();
    setExportState({ status: 'idle', progress: 0 });
  }, [cancel]);

  const handleReset = useCallback(() => {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }
    setAudio(null);
    setImage(null);
    setOutputUrl(null);
    setExportState({ status: 'idle', progress: 0 });
  }, [outputUrl]);

  const canExport = audio && image && exportState.status === 'idle';
  const isExporting = exportState.status === 'loading' || exportState.status === 'processing';

  return (
    <main className="min-h-screen flex flex-col items-center pt-16 pb-24 p-8 relative overflow-hidden">
      {/* Decorative leaves */}
      <LeafDecoration className="absolute -top-8 -right-8 w-72 h-96 text-olive rotate-[25deg] opacity-50" />
      <LeafDecoration className="absolute -bottom-12 -left-8 w-64 h-88 text-forest rotate-[-160deg] opacity-40" />

      {/* Header */}
      <div className="flex flex-col items-center relative z-10 mb-8">
        <CassetteDeck
          isProcessing={isExporting}
          isComplete={exportState.status === 'complete'}
        />
        <h1 className="font-display text-5xl text-brown mb-3 tracking-wide mt-4">
          Mixtape Helper
        </h1>
        <p className="text-lg text-brown/60 max-w-md text-center">
          Turn your audio into a YouTube-ready video
        </p>
      </div>

      {/* Main content */}
      <div className="w-full max-w-2xl relative">
        {/* Collage background images */}
        <img
          src="/mpc.jpg"
          alt=""
          className="absolute -left-96 -top-32 w-[1400px] opacity-20 -rotate-6 pointer-events-none z-0"
        />
        <img
          src="/piano.jpg"
          alt=""
          className="absolute -right-96 -top-48 w-[1400px] opacity-20 rotate-3 pointer-events-none z-0"
        />
        {outputUrl ? (
          <div className="space-y-4 relative z-10">
            <div className="rounded-2xl border-3 border-dashed border-tan bg-cream/80 backdrop-blur-sm p-6">
              <VideoPreview
                url={outputUrl}
                filename={audio?.name.replace(/\.[^.]+$/, '') + '-video.mp4'}
              />
            </div>
            <button
              onClick={handleReset}
              className="w-full text-sm text-forest hover:text-cream py-2 border border-olive rounded-lg hover:bg-olive transition-all"
            >
              Create another video
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {/* Upload zone */}
            <div className="rounded-2xl border-3 border-dashed border-tan bg-cream/80 backdrop-blur-sm p-6 hover:border-olive transition-colors">
              <UploadZone
                audio={audio}
                image={image}
                onAudioChange={setAudio}
                onImageChange={setImage}
                disabled={isExporting}
              />
            </div>

            {/* Preview section */}
            {(image || audio) && (
              <div className="rounded-2xl border-3 border-dashed border-tan bg-cream/80 backdrop-blur-sm p-6 space-y-4">
                {image && (
                  <ImagePreview
                    image={image}
                    resolution={{ width: 1920, height: 1080 }}
                  />
                )}
                {audio && <AudioPlayer audio={audio} />}
              </div>
            )}

            {/* Export button or progress */}
            {isExporting ? (
              <div className="rounded-2xl border-3 border-dashed border-tan bg-cream/80 backdrop-blur-sm p-6">
                <ExportProgress state={exportState} onCancel={handleCancel} />
              </div>
            ) : (
              <button
                onClick={handleExport}
                disabled={!canExport}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
                  canExport
                    ? 'bg-olive text-cream hover:bg-forest'
                    : 'bg-tan/30 text-brown/40 cursor-not-allowed'
                }`}
              >
                {!audio && !image
                  ? 'Upload audio and image to continue'
                  : !audio
                    ? 'Upload audio to continue'
                    : !image
                      ? 'Upload image to continue'
                      : 'Create Video'}
              </button>
            )}

            {/* Warnings */}
            {!isSupported && (
              <div className="p-4 bg-orange/20 border border-orange rounded-lg text-brown">
                <p className="font-medium">Browser compatibility warning</p>
                <p className="text-sm mt-1 opacity-80">
                  SharedArrayBuffer is not available. Deploy to Vercel or use Chrome for full support.
                </p>
              </div>
            )}

            {exportState.status === 'error' && (
              <div className="p-4 bg-orange/20 border border-orange rounded-lg text-brown">
                Error: {exportState.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-brown flex items-center justify-between px-8 z-50">
        <a
          href="https://github.com/nvidela-dev/mixtape-helper"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream hover:text-white text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          Source
        </a>
        <a
          href="https://nvidela.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-2xl text-cream hover:text-white transition-colors tracking-wide"
        >
          nvidela.dev
        </a>
      </div>
    </main>
  );
}
