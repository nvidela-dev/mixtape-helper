import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mixtape Helper | Audio to Video Generator',
  description: 'Convert audio files to YouTube-ready MP4 videos with a static image. Perfect for music uploads, podcasts, and mixtapes.',
  keywords: ['audio to video', 'mp4 converter', 'youtube video maker', 'music video', 'mixtape', 'ffmpeg'],
  authors: [{ name: 'nvidela', url: 'https://nvidela.dev' }],
  creator: 'nvidela',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Mixtape Helper',
    description: 'Convert audio files to YouTube-ready MP4 videos with a static image.',
    url: 'https://mixtape-helper.nvidela.dev',
    siteName: 'Mixtape Helper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mixtape Helper',
    description: 'Convert audio files to YouTube-ready MP4 videos with a static image.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3D2B1F',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
