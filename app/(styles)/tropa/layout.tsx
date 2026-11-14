import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import { Chrome } from '@/components/chrome/Chrome';
import { Motion } from './_parts/Motion';
import './style.css';

// One grotesk for both voices, like Skydive's Aeonik + Inter pairing collapsed: 500 for display, 400 for body.
const onest = Onest({ subsets: ['latin'], variable: '--tr-font' });

export const metadata: Metadata = {
  title: 'Tropa · AI crew for your negosyo',
  description: 'Fictional AI-crew product for Filipino small businesses. A Fluxion style.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable} suppressHydrationWarning>
      <body>
        {/* Hidden-before-reveal states only apply once JS is known to run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <Motion />
        <Chrome slug="tropa" />
      </body>
    </html>
  );
}
