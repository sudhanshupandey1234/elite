import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
