import type { Resolution } from '@/types';

export interface ScaledDimensions {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export function calculateScaledDimensions(
  imageWidth: number,
  imageHeight: number,
  target: Resolution
): ScaledDimensions {
  const imageAspect = imageWidth / imageHeight;
  const targetAspect = target.width / target.height;

  let scaledWidth: number;
  let scaledHeight: number;

  if (imageAspect > targetAspect) {
    // Image is wider than target - fit to width, letterbox top/bottom
    scaledWidth = target.width;
    scaledHeight = target.width / imageAspect;
  } else {
    // Image is taller than target - fit to height, pillarbox left/right
    scaledHeight = target.height;
    scaledWidth = target.height * imageAspect;
  }

  return {
    width: Math.round(scaledWidth),
    height: Math.round(scaledHeight),
    offsetX: Math.round((target.width - scaledWidth) / 2),
    offsetY: Math.round((target.height - scaledHeight) / 2),
  };
}

export function drawPreviewFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  target: Resolution,
  backgroundColor: string = '#000000'
): void {
  const { width, height, offsetX, offsetY } = calculateScaledDimensions(
    image.naturalWidth,
    image.naturalHeight,
    target
  );

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, target.width, target.height);

  // Draw scaled image
  ctx.drawImage(image, offsetX, offsetY, width, height);
}
