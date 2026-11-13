import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Chrome } from '@/components/chrome/Chrome';
import { Motion } from './_parts/Motion';
import './style.css';

const sans = Geist({ subsets: ['latin'], variable: '--tw-sans' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--tw-mono' });

export const metadata: Metadata = {
  title: 'Bakawan · Coastal restoration',
  description: 'Fictional Philippine coastal restoration studio. A Fluxion style.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {/* Hidden-before-reveal states only apply once JS is known to run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <Motion />
        <Chrome slug="bakawan" />
      </body>
    </html>
  );
}
