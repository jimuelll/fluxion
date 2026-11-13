import {
  Anchor, BadgeCheck, CloudOff, Droplets, Fish, Gauge, Landmark, Leaf, Map, Mountain, Ruler, Sprout, Sun, TreePine, Waves,
} from 'lucide-react';
import { Fragment } from 'react';
import { PHOTOS, type PhotoName } from './content';

const ICONS = { Anchor, BadgeCheck, CloudOff, Droplets, Fish, Gauge, Landmark, Leaf, Map, Mountain, Ruler, Sprout, Sun, TreePine, Waves };
export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const C = ICONS[name];
  return <C size={size} strokeWidth={1.6} aria-hidden />;
}

export function Photo({ name, className = '', priority = false }: { name: PhotoName; className?: string; priority?: boolean }) {
  return (
    <img
      className={`photo ${className}`}
      src={`/bakawan/${name}.webp`}
      alt={PHOTOS[name].alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** Splits text into words that blur in one after another when the parent reveals. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        // Space stays outside the inline-block so line wrapping still works.
        <Fragment key={i}>
          <span className="word" style={{ '--i': start + i } as React.CSSProperties}>
            {w}
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <span className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{children}</span>;
}

export function Mark({ size = 24 }: { size?: number }) {
  // Three tide lines rising out of a curve; our own mark.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M3 17c3-3 6-3 9 0s6 3 9 0" fill="none" stroke="var(--deep)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M5 11.5c2.4-2.2 4.6-2.2 7 0s4.6 2.2 7 0" fill="none" stroke="var(--accent-deep)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 6c1.4-1.3 2.6-1.3 4 0s2.6 1.3 4 0" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
