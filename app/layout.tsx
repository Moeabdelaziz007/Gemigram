import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gemigram',
  description: 'The Voice-Native AI Social Nexus.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050B14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/aether-entity.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('aether-theme');
                  const theme = savedTheme || 'dark';

                  if (theme === 'system') {
                    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
                  } else {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased selection:bg-aether-neon/30 overflow-x-hidden bg-theme-primary text-theme-primary">
        <div className="fixed inset-0 pointer-events-none hud-grid opacity-10 z-[0]" />
        {children}
      </body>
    </html>
  );
}
