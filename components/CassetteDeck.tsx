'use client';

import { useState, useEffect, useRef } from 'react';

interface CassetteDeckProps {
  isProcessing?: boolean;
  isComplete?: boolean;
}

export function CassetteDeck({ isProcessing = false, isComplete = false }: CassetteDeckProps) {
  const [isInserted, setIsInserted] = useState(false);
  const [reelRotation, setReelRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Auto-insert on mount with a slight delay for effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInserted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Reel spinning animation when processing
  useEffect(() => {
    if (isProcessing && isInserted) {
      let lastTime = performance.now();

      const spin = () => {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;

        // Spin at ~60 RPM
        const degreesPerMs = 360 / 1000;
        setReelRotation(prev => prev + delta * degreesPerMs);

        animationRef.current = requestAnimationFrame(spin);
      };

      animationRef.current = requestAnimationFrame(spin);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isProcessing, isInserted]);

  return (
    <div className="relative select-none">
      {/* Cassette Deck Housing */}
      <div className="relative w-48 h-32">
        {/* Main deck body */}
        <div className="absolute inset-0 bg-brown rounded-xl shadow-lg border-4 border-brown">
          {/* Deck face plate */}
          <div className="absolute inset-2 bg-gradient-to-b from-tan/40 to-tan/20 rounded-lg">
            {/* Cassette window/slot */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-36 h-20 bg-brown/80 rounded-md overflow-hidden border-2 border-brown/60">
              {/* Window glass effect */}
              <div className="absolute inset-1 bg-gradient-to-br from-cream/10 to-transparent rounded pointer-events-none" />

              {/* Reel spindles (visible in window) */}
              <div
                className="absolute top-1/2 left-6 w-5 h-5 rounded-full bg-brown/60 border-2 border-tan/30"
                style={{ transform: `translateY(-50%) rotate(${reelRotation}deg)` }}
              >
                <div className="absolute inset-1 rounded-full border border-tan/20" />
              </div>
              <div
                className="absolute top-1/2 right-6 w-5 h-5 rounded-full bg-brown/60 border-2 border-tan/30"
                style={{ transform: `translateY(-50%) rotate(${reelRotation}deg)` }}
              >
                <div className="absolute inset-1 rounded-full border border-tan/20" />
              </div>

              {/* Cassette tape (animated insertion) */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-32 h-20"
                style={{
                  top: isInserted ? 0 : 96,
                  transition: 'top 0.5s ease-out',
                }}
              >
                {/* Cassette body */}
                <div className="absolute inset-0 bg-cream rounded border-2 border-tan shadow-md">
                  {/* Label area with logo */}
                  <div className="absolute top-1 left-1 right-1 h-10 bg-paper rounded-sm overflow-hidden border border-tan/50">
                    <img
                      src="/logo.png"
                      alt="Mixtape"
                      className="w-full h-full object-cover opacity-90"
                      draggable={false}
                    />
                  </div>

                  {/* Tape window */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-brown/30 rounded-sm border border-tan/30">
                    {/* Tape reels */}
                    <div
                      className="absolute top-1/2 left-2 w-3 h-3 rounded-full bg-brown/60 border border-tan/40"
                      style={{ transform: `translateY(-50%) rotate(${reelRotation}deg)` }}
                    >
                      <div className="absolute inset-0.5 rounded-full bg-brown/40" />
                    </div>
                    <div
                      className="absolute top-1/2 right-2 w-3 h-3 rounded-full bg-brown/60 border border-tan/40"
                      style={{ transform: `translateY(-50%) rotate(${reelRotation}deg)` }}
                    >
                      <div className="absolute inset-0.5 rounded-full bg-brown/40" />
                    </div>
                    {/* Tape between reels */}
                    <div className="absolute top-1/2 left-5 right-5 h-0.5 bg-brown/40 -translate-y-1/2" />
                  </div>

                  {/* Cassette teeth/grip */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-1.5 bg-tan/60 rounded-t-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deck controls - Status LED */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              <div className={`
                w-2 h-2 rounded-full transition-colors duration-300
                ${isProcessing ? 'bg-olive animate-pulse' : isComplete ? 'bg-olive' : 'bg-tan/40'}
              `} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
