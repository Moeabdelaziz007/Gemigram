import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import './globals.css'; // Global styles

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Gemigram',
  description: 'The Voice-Native AI Social Nexus.',
};

import { AuthProvider } from '@/components/Providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050B14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/aether-entity.png" />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#050B14] text-white selection:bg-cyan-500/30">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
