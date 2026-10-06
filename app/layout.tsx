import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'Elite Globex — IT Products, Solutions & GeM Services in Lucknow',
    template: '%s | Elite Globex',
  },
  description:
    'Elite Globex (Lucknow) — your one-stop IT solutions partner: computers, printers, interactive panels, online class studio setups, servers, toner cartridges, drones & more. GeM portal services, government tenders, AMC & bulk supply across India.',
  keywords: [
    'Elite Globex',
    'IT solutions Lucknow',
    'computer dealer Lucknow',
    'interactive panel Lucknow',
    'online class studio setup',
    'printer scanner dealer',
    'GeM portal services',
    'government tender supplier',
    'toner cartridge supplier',
    'server NAS supplier India',
    'drone camera dealer',
    'AMC services Lucknow',
    'bulk IT supply',
    'office equipment supplier UP',
  ],
  authors: [{ name: 'Elite Globex' }],
  creator: 'Elite Globex',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Elite Globex',
    title: 'Elite Globex — IT Products, Solutions & GeM Services in Lucknow',
    description:
      'Your every problem has one solution. Computers, printers, interactive panels, studio setups, GeM & tender services — from Lucknow to all of India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite Globex — IT Products, Solutions & GeM Services in Lucknow',
    description:
      'Your every problem has one solution. IT products, GeM portal services, government tenders & AMC — Lucknow, India.',
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
