import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'HealthOS',
  description: 'Your personal health command centre.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'HealthOS' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Apply saved theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = localStorage.getItem('theme');
            if(t === 'light') document.documentElement.classList.remove('dark');
            else document.documentElement.classList.add('dark');
          })()
        ` }} />
      </head>
      <body>
        <Navigation />
        <main className="pt-14 pb-20 min-h-screen max-w-lg mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
