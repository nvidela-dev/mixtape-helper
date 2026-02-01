# Audio to Video Generator — Development Plan

Browser-based tool that combines an audio file and an image into a YouTube-ready MP4 video.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Video Processing:** FFmpeg.wasm
- **Deployment:** Cloudflare Pages (static export)

## Architecture

```
User uploads audio (.mp3/.wav/.flac) + image (.jpg/.png)
        ↓
Image scaled/padded to target aspect ratio (16:9)
        ↓
FFmpeg.wasm combines:
  - Image → H.264 video stream (static frame for audio duration)
  - Audio → AAC audio stream
        ↓
Output MP4 download (YouTube-ready)
```

---

## YouTube Spec Compliance

| Parameter | Target |
|-----------|--------|
| Container | MP4 |
| Video Codec | H.264 |
| Audio Codec | AAC |
| Resolution | 1920×1080 (1080p) or 1280×720 (720p) |
| Aspect Ratio | 16:9 |
| Frame Rate | 1 fps (static image, saves encoding time) |
| Audio Sample Rate | 44.1kHz or 48kHz |

---

## Phase 1: Project Scaffolding

- [ ] Initialize Next.js with TypeScript and Tailwind
- [ ] Configure `next.config.js` for static export
- [ ] Set up folder structure: `/components`, `/lib`, `/hooks`, `/types`
- [ ] Install FFmpeg.wasm: `@ffmpeg/ffmpeg`, `@ffmpeg/util`
- [ ] Configure webpack for WASM and SharedArrayBuffer
- [ ] Add required headers for cross-origin isolation (COOP/COEP)
- [ ] Verify build succeeds

**Critical Note:** FFmpeg.wasm requires these headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**Validation:** `npm run build` completes, headers configured in `next.config.js`.

---

## Phase 2: File Upload Components

- [ ] Create `<AudioUpload />` component
  - Accept: .mp3, .wav, .flac, .aac, .ogg, .m4a
  - Validate file size (limit: 100MB)
  - Display filename and duration after upload
- [ ] Create `<ImageUpload />` component
  - Accept: .jpg, .jpeg, .png, .webp
  - Validate file size (limit: 20MB)
  - Display image preview after upload
- [ ] Create unified `<UploadZone />` with both areas
- [ ] Store files in state as `File` objects
- [ ] Add clear/remove buttons for each upload
- [ ] Error handling for invalid files

**Validation:** Upload audio → shows duration. Upload image → shows preview.

---

## Phase 3: Image Preview & Processing

- [ ] Display uploaded image at actual dimensions
- [ ] Show target output dimensions (1920×1080)
- [ ] Preview how image will be scaled/letterboxed
- [ ] Implement scaling logic:
  - If image is 16:9 → scale to fit
  - If image is taller → pillarbox (bars on sides)
  - If image is wider → letterbox (bars top/bottom)
- [ ] Let user choose background color for bars (default: black)
- [ ] Canvas-based preview of final frame

**Validation:** Upload square image → preview shows with pillarboxing.

---

## Phase 4: Audio Preview

- [ ] Simple audio player for uploaded file
- [ ] Display duration in mm:ss format
- [ ] Waveform visualization (optional, reuse from sample-analyzer)
- [ ] Warn if audio > 15 minutes (long encode time)

**Validation:** Upload audio → can play back, duration displayed.

---

## Phase 5: FFmpeg.wasm Integration

- [ ] Lazy load FFmpeg.wasm on first export
- [ ] Implement loading state with progress (FFmpeg core is ~30MB)
- [ ] Write uploaded files to FFmpeg virtual filesystem
- [ ] Build FFmpeg command:
```bash
ffmpeg -loop 1 -i image.jpg -i audio.mp3 \
  -c:v libx264 -tune stillimage -c:a aac \
  -b:a 192k -pix_fmt yuv420p \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -shortest -movflags +faststart \
  output.mp4
```
- [ ] Handle FFmpeg progress events
- [ ] Handle FFmpeg errors gracefully
- [ ] Read output file from virtual filesystem

**FFmpeg Flags Explained:**
- `-loop 1` — loop image infinitely
- `-tune stillimage` — optimize for static content
- `-shortest` — stop when shortest input ends (audio)
- `-movflags +faststart` — move metadata to front for streaming

**Validation:** Process test image + audio → valid MP4 output.

---

## Phase 6: Export Progress UI

- [ ] Show encoding progress percentage
- [ ] Display estimated time remaining
- [ ] Show current stage: "Loading FFmpeg..." → "Processing..." → "Finalizing..."
- [ ] Cancel button to abort encoding
- [ ] Handle browser tab close warning during encoding
- [ ] Memory usage indicator (optional)

**Validation:** Full encode shows progress 0% → 100%, cancel works.

---

## Phase 7: Output & Download

- [ ] Create object URL from output MP4
- [ ] Video preview player for result
- [ ] Download button with suggested filename: `{audio-filename}-video.mp4`
- [ ] Display output file size
- [ ] "Start Over" button to reset all state
- [ ] Copy video specs to clipboard (for YouTube description)

**Validation:** Download works, video plays in VLC/QuickTime.

---

## Phase 8: Settings Panel

- [ ] Resolution selector: 1080p / 720p / 480p
- [ ] Background color picker for letterbox/pillarbox
- [ ] Audio bitrate: 128k / 192k / 256k / 320k
- [ ] Output filename customization
- [ ] Persist settings to localStorage

**Default Settings:**
```
Resolution: 1080p (1920×1080)
Background: #000000 (black)
Audio Bitrate: 192k
```

**Validation:** Change resolution → output matches selected size.

---

## Phase 9: Polish & Edge Cases

- [ ] Error boundary for FFmpeg crashes
- [ ] Empty state with clear instructions
- [ ] Mobile-friendly layout (though encoding will be slow)
- [ ] Accessibility: keyboard nav, ARIA labels
- [ ] Handle very long audio (> 1 hour) — warn about time/memory
- [ ] Handle very large images (> 8000px) — warn or auto-downscale
- [ ] OG meta tags for social sharing
- [ ] Add FAQ section explaining YouTube upload process

**Validation:** App handles edge cases without crashing.

---

## Phase 10: Deployment

- [ ] Create Cloudflare Pages project
- [ ] Configure custom headers for COOP/COEP in `_headers` file:
```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```
- [ ] Connect GitHub repo
- [ ] Configure build: `npm run build`, output: `out`
- [ ] Test SharedArrayBuffer works in production
- [ ] (Optional) Custom domain

**Validation:** Production URL loads, encoding works.

---

## Dependencies

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
npm install -D @types/node
```

## File Structure

```
audio-to-video/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── AudioUpload.tsx
│   ├── ImageUpload.tsx
│   ├── ImagePreview.tsx
│   ├── AudioPlayer.tsx
│   ├── VideoPreview.tsx
│   ├── ExportProgress.tsx
│   ├── SettingsPanel.tsx
│   └── DownloadButton.tsx
├── lib/
│   ├── ffmpeg.ts          # FFmpeg.wasm loader + commands
│   ├── image.ts           # Image scaling/padding logic
│   └── utils.ts           # Duration formatting, file helpers
├── hooks/
│   ├── useFFmpeg.ts
│   ├── useAudioDuration.ts
│   └── useSettings.ts
├── types/
│   └── index.ts
├── public/
│   └── _headers           # COOP/COEP headers for Cloudflare
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── plan.md
```

---

## Milestones

| Milestone | Phases | Goal |
|-----------|--------|------|
| M1: POC | 1-2, partial 5 | Upload files → MP4 downloads (no preview) |
| M2: MVP | 3-4, 6-7 | Full flow with previews and progress |
| M3: RC | 8-9 | Settings panel + polish |
| M4: Production | 10 | Deployed to Cloudflare |

---

## Known Risks

| Risk | Mitigation |
|------|------------|
| FFmpeg.wasm fails to load | Clear error message, suggest desktop Chrome |
| SharedArrayBuffer not available | Detect and show browser requirements |
| Memory crash on long audio | Warn at 15+ minutes, limit at 60 minutes |
| Slow encoding on mobile | Warn users, recommend desktop |
| COOP/COEP breaks external resources | Use local assets only, no external CDNs |

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 92+ | ✅ Full support |
| Edge 92+ | ✅ Full support |
| Firefox 79+ | ✅ Full support |
| Safari 15.2+ | ⚠️ Requires flags, may be unstable |
| Mobile browsers | ⚠️ Works but slow, memory-limited |

**Note:** SharedArrayBuffer requires secure context (HTTPS) and COOP/COEP headers.

---

## FFmpeg Command Reference

**Basic encode:**
```bash
ffmpeg -loop 1 -i image.jpg -i audio.mp3 \
  -c:v libx264 -tune stillimage \
  -c:a aac -b:a 192k \
  -pix_fmt yuv420p \
  -shortest \
  output.mp4
```

**With scaling to 1080p (preserves aspect ratio, adds padding):**
```bash
ffmpeg -loop 1 -i image.jpg -i audio.mp3 \
  -c:v libx264 -tune stillimage \
  -c:a aac -b:a 192k \
  -pix_fmt yuv420p \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -shortest -movflags +faststart \
  output.mp4
```

**With custom background color (#1a1a2e):**
```bash
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:0x1a1a2e"
```

---

## Commands Reference

```bash
# Development
npm run dev

# Build static export
npm run build

# Preview production build (with headers)
npx serve out --cors

# Deploy (via Cloudflare Pages git integration)
git push origin main
```
