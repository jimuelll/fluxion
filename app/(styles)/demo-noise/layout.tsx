import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import { Chrome } from '@/components/chrome/Chrome';
import './style.css';

const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = { title: 'Demo Noise · Fluxion' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        {children}
        <Chrome slug="demo-noise" />
      </body>
    </html>
  );
}
