import { ArrowRight } from 'lucide-react';
import { PHOTOS, type PhotoName } from './content';

export function Photo({ name, className = '' }: { name: PhotoName; className?: string }) {
  return <img className={`photo ${className}`} src={`/kaye/${name}.webp`} alt={PHOTOS[name].alt} loading="lazy" decoding="async" />;
}

/** Tilted label stuck onto headlines and paragraphs. */
export function Sticker({ children, tone = 'ink', tilt = -6, className = '', delay = 0 }: { children: React.ReactNode; tone?: 'ink' | 'ube' | 'mango'; tilt?: number; className?: string; delay?: number }) {
  return (
    <span className={`sticker sticker--${tone} ${className}`} style={{ '--tilt': `${tilt}deg`, '--sd': `${delay}ms` } as React.CSSProperties}>
      {children}
    </span>
  );
}

/** Pill button with the round arrow badge. */
export function Btn({ children, tone = 'ink', href = '#contact', type }: { children: React.ReactNode; tone?: 'ink' | 'outline' | 'ube'; href?: string; type?: 'submit' }) {
  const inner = (
    <>
      <span>{children}</span>
      <span className="btn__dot" aria-hidden>
        <ArrowRight size={14} strokeWidth={2.4} />
      </span>
    </>
  );
  return type ? (
    <button type={type} className={`btn btn--${tone}`}>
      {inner}
    </button>
  ) : (
    <a href={href} className={`btn btn--${tone}`}>
      {inner}
    </a>
  );
}

/** Heading with an optional ube second line, in the condensed display cut. */
export function Heading({ ink, accent, as: Tag = 'h2', className = '' }: { ink: string; accent?: string; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <Tag className={`display ${className}`} data-reveal>
      {ink}
      {accent && (
        <>
          {' '}
          <span className="accent">{accent}</span>
        </>
      )}
    </Tag>
  );
}

// One 1000-unit tile. It ends where it starts (x 210) heading the same way, so Motion can stack tiles seamlessly.
const LOOP = 'M210 0 C 300 110, 90 170, 130 300 C 160 390, 290 380, 250 300 C 215 230, 110 300, 150 420 C 200 560, 320 600, 230 720 C 150 830, 120 890, 210 1000';

/** Thick ube line down a section edge; Motion draws it in as the section scrolls into view and leaves it drawn. */
export function Squiggle({ side = 'left', top = '0' }: { side?: 'left' | 'right'; top?: string }) {
  return (
    // Fixed 324x1000 box (never stretched) so the 22px stroke stays even along the whole curve.
    <svg className={`squiggle squiggle--${side}`} style={{ top }} viewBox="0 0 324 1000" aria-hidden data-squiggle>
      <path d={LOOP} pathLength={1} />
    </svg>
  );
}

/** Phone-shaped frame for portrait media. */
export function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen">{children}</div>
    </div>
  );
}
