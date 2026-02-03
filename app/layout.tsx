import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Homeflix',
    template: '%s | Homeflix',
  },
  description:
    'A unified management interface for your self-hosted media services. Manage movies, shows, music, and books in one household-friendly dashboard.',
  applicationName: 'Homeflix',
  keywords: ['media server', 'home media', 'sonarr', 'radarr', 'plex', 'jellyfin', 'self-hosted', 'media management'],
  authors: [{ name: 'Homeflix' }],
  creator: 'Homeflix',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Homeflix',
    title: 'Homeflix',
    description:
      'A unified management interface for your self-hosted media services. Manage movies, shows, music, and books in one household-friendly dashboard.',
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
