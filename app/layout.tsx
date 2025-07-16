'use client';

// ThemeWrapper'ı kaldıralım ve doğrudan dark class'ını ana layout'a ekleyelim
import { Poppins } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const poppins = Poppins({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.className} scroll-smooth dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-[#1A0F0A] to-[#3A2A1E]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
