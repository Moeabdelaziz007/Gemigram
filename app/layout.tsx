import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/Providers';
import AppShell from '@/components/AppShell';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Gemigram',
  description: 'The Voice-Native AI Social Nexus.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050B14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/aether-entity.png" />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased text-white selection:bg-aether-neon/30 overflow-x-hidden" style={{ backgroundColor: 'var(--color-carbon-black)' }}>
        <div className="fixed inset-0 pointer-events-none hud-grid opacity-10 z-[0]" />
        <AuthProvider>
          <AppShell>
            <main className="relative z-[1]">
              {children}
            </main>
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
