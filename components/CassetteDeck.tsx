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
        setReelRotation((prev) => prev + delta * degreesPerMs);

        animationRef.current = requestAnimationFrame(spin);
      };

      animationRef.current = requestAnimationFrame(spin);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isProcessing, isInserted]);

  const spindleTransform = `translateY(-50%) rotate(${reelRotation}deg)`;
  const tapeReelTransform = `translateY(-50%) rotate(${reelRotation}deg)`;

  const getLedClass = () => {
    if (isProcessing) return 'cassette-deck__led cassette-deck__led--processing';
    if (isComplete) return 'cassette-deck__led cassette-deck__led--complete';
    return 'cassette-deck__led cassette-deck__led--idle';
  };

  return (
    <div className="cassette-deck">
      {/* Cassette Deck Housing */}
      <div className="cassette-deck__housing">
        {/* Main deck body */}
        <div className="cassette-deck__body">
          {/* Deck face plate */}
          <div className="cassette-deck__faceplate">
            {/* Cassette window/slot */}
            <div className="cassette-deck__window">
              {/* Window glass effect */}
              <div className="cassette-deck__glass-effect" />

              {/* Reel spindles (visible in window) */}
              <div
                className="cassette-deck__spindle cassette-deck__spindle--left"
                style={{ transform: spindleTransform }}
              />
              <div
                className="cassette-deck__spindle cassette-deck__spindle--right"
                style={{ transform: spindleTransform }}
              />

              {/* Cassette tape (animated insertion) */}
              <div
                className={`cassette-deck__tape ${isInserted ? 'cassette-deck__tape--inserted' : 'cassette-deck__tape--ejected'}`}
              >
                {/* Cassette body */}
                <div className="cassette-deck__cassette-body">
                  {/* Label area with logo */}
                  <div className="cassette-deck__label">
                    <img
                      src="/logo.png"
                      alt="Mixtape"
                      className="cassette-deck__label-image"
                      draggable={false}
                    />
                  </div>

                  {/* Tape window */}
                  <div className="cassette-deck__tape-window">
                    {/* Tape reels */}
                    <div
                      className="cassette-deck__tape-reel cassette-deck__tape-reel--left"
                      style={{ transform: tapeReelTransform }}
                    />
                    <div
                      className="cassette-deck__tape-reel cassette-deck__tape-reel--right"
                      style={{ transform: tapeReelTransform }}
                    />
                    {/* Tape between reels */}
                    <div className="cassette-deck__tape-line" />
                  </div>

                  {/* Cassette teeth/grip */}
                  <div className="cassette-deck__grip">
                    {[...Array(5)].map((_, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={i} className="cassette-deck__grip-tooth" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deck controls - Status LED */}
            <div className="cassette-deck__controls">
              <div className={getLedClass()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
