import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<boolean> | null = null;

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg?.loaded) {
    return ffmpeg;
  }

  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }

  if (!loadPromise) {
    // Load FFmpeg core - uses default CDN with proper CORS headers
    // COOP/COEP headers are set in next.config.mjs (dev) and vercel.json (prod)
    loadPromise = ffmpeg.load();
  }

  await loadPromise;
  return ffmpeg;
}

export async function encodeVideo(
  audioFile: File,
  imageFile: File,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  const ff = await loadFFmpeg();

  if (signal?.aborted) {
    throw new Error('Encoding cancelled');
  }

  // Write input files to virtual filesystem
  const audioExt = audioFile.name.split('.').pop() || 'mp3';
  const imageExt = imageFile.name.split('.').pop() || 'jpg';

  await ff.writeFile(`input.${audioExt}`, await fetchFile(audioFile));
  await ff.writeFile(`input.${imageExt}`, await fetchFile(imageFile));

  if (signal?.aborted) {
    throw new Error('Encoding cancelled');
  }

  // Set up progress handler
  let duration = 0;
  ff.on('log', ({ message }) => {
    // Parse duration from FFmpeg output
    const durationMatch = message.match(/Duration: (\d{2}):(\d{2}):(\d{2})/);
    if (durationMatch) {
      const [, hours, minutes, seconds] = durationMatch;
      duration = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    }

    // Parse current time for progress
    const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch && duration > 0) {
      const [, hours, minutes, seconds] = timeMatch;
      const currentTime = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
      const progress = Math.min((currentTime / duration) * 100, 99);
      onProgress?.(progress);
    }
  });

  // Run FFmpeg command
  await ff.exec([
    '-loop', '1',
    '-i', `input.${imageExt}`,
    '-i', `input.${audioExt}`,
    '-c:v', 'libx264',
    '-tune', 'stillimage',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black',
    '-shortest',
    '-movflags', '+faststart',
    'output.mp4',
  ]);

  if (signal?.aborted) {
    throw new Error('Encoding cancelled');
  }

  // Read output file
  const data = await ff.readFile('output.mp4');

  // Cleanup virtual filesystem
  await ff.deleteFile(`input.${audioExt}`);
  await ff.deleteFile(`input.${imageExt}`);
  await ff.deleteFile('output.mp4');

  onProgress?.(100);

  return data as Uint8Array;
}

export function isSharedArrayBufferSupported(): boolean {
  try {
    return typeof SharedArrayBuffer !== 'undefined';
  } catch {
    return false;
  }
}
