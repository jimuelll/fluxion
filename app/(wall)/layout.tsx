import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fluxion',
  description: 'A wall of TVs, each tuned to a different UI style.',
};

export default function WallLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000', overflow: 'hidden' }}>{children}</body>
    </html>
  );
}
