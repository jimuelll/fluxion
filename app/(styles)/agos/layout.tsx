import type { Metadata } from 'next';
import { IBM_Plex_Mono, Onest } from 'next/font/google';
import { Chrome } from '@/components/chrome/Chrome';
import { Shell } from './_parts/Shell';
import './style.css';

const sans = Onest({ subsets: ['latin'], variable: '--ag-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ag-mono' });

export const metadata: Metadata = {
  title: 'Agos · Network operations',
  description: 'Fictional Philippine courier operations dashboard. A Fluxion style.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
        <Chrome slug="agos" />
      </body>
    </html>
  );
}
