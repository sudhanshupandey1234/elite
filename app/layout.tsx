import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EliteGlobex | Building Digital Solutions That Move Businesses Forward',
    template: '%s | EliteGlobex',
  },
  description:
    'EliteGlobex is a global technology and digital transformation company delivering enterprise cloud architecture, applied AI solutions, modern web engineering, mobile apps, and workflow automation.',
  keywords: [
    'Enterprise Software',
    'Cloud Architecture',
    'DevOps',
    'Artificial Intelligence',
    'Next.js Development',
    'Digital Transformation',
    'EliteGlobex',
    'Software Consulting',
  ],
  authors: [{ name: 'EliteGlobex' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'EliteGlobex',
    title: 'EliteGlobex | Global Technology & Digital Solutions',
    description: 'Transforming global organizations with enterprise-grade cloud, AI, and software systems.',
  },
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
