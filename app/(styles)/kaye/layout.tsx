import type { Metadata } from 'next';
import { Archivo, Instrument_Sans } from 'next/font/google';
import { Chrome } from '@/components/chrome/Chrome';
import { Motion } from './_parts/Motion';
import './style.css';

// Archivo's width axis gives the extra-condensed display cut; Instrument Sans carries the body copy.
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--nr-display' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--nr-body' });

export const metadata: Metadata = {
  title: 'Kaye Eats · Food creator',
  description: 'Fictional Filipino food and kitchen UGC creator. A Fluxion style.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        {/* Hidden-before-reveal states only apply once JS is known to run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <Motion />
        <Chrome slug="kaye" />
      </body>
    </html>
  );
}
