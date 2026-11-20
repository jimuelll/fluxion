import type { Metadata } from 'next';
import { Big_Shoulders, Inter } from 'next/font/google';
import { Chrome } from '@/components/chrome/Chrome';
import './style.css';

// Condensed display for the echoed titles, Inter for reading. Global CSS is safe: this route is its own root layout.
const display = Big_Shoulders({ subsets: ['latin'], variable: '--font-display', adjustFontFallback: false });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Echofall · Pre-register',
  description: 'Fictional action game launch page. A Fluxion style.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body>
        {children}
        <Chrome slug="echofall" />
      </body>
    </html>
  );
}
