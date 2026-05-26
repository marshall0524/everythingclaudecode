import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'InsureOS',
  description: 'Your insurance command centre',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = localStorage.getItem('theme');
            if(t === 'light') document.documentElement.classList.remove('dark');
            else document.documentElement.classList.add('dark');
          })()
        ` }} />
      </head>
      <body className={inter.variable}>
        <Navigation />
        <main className="pt-14 pb-20 min-h-screen max-w-[430px] mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
