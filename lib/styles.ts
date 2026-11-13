export type Category = 'landing' | 'marketing' | 'product' | 'dashboard' | 'creative';

export type StyleEntry = {
  slug: string;
  name: string;
  category: Category;
  /** Basename in /public/previews → <preview>.webm / .mp4. Omit until recorded; the TV shows a test card instead. */
  preview?: string;
  /** Index into WALL_SLOTS. */
  slot: number;
};

// Placeholders that prove the pipeline; replaced once the real 6–8 styles are chosen.
export const STYLES: StyleEntry[] = [
  { slug: 'bakawan', name: 'Bakawan', category: 'landing', preview: 'bakawan', slot: 12 },
  { slug: 'kaye', name: 'Kaye Eats', category: 'marketing', preview: 'kaye', slot: 2 },
  { slug: 'demo-noise', name: 'Demo Noise', category: 'creative', slot: 3 },
];

export type Slot = {
  x: number;
  z: number;
  /** Height the TV rests on (floor = 0). */
  base: number;
  w: number;
  h: number;
  rotY: number;
  /** Kept on the lighter mobile / low-power wall. */
  mobile?: boolean;
};

// The stack's art direction lives here, not in the style entries. Any slot without a style shows NO SIGNAL.
export const WALL_SLOTS: Slot[] = [
  // floor row
  { x: -2.45, z: 0.35, base: 0, w: 0.75, h: 0.7, rotY: 0.35 },
  { x: -1.55, z: 0.1, base: 0, w: 0.85, h: 0.7, rotY: 0.15, mobile: true },
  { x: -0.5, z: 0, base: 0, w: 0.95, h: 0.7, rotY: 0.05, mobile: true },
  { x: 0.5, z: 0, base: 0, w: 0.9, h: 0.7, rotY: -0.05, mobile: true },
  { x: 1.5, z: 0.1, base: 0, w: 0.85, h: 0.7, rotY: -0.15, mobile: true },
  { x: 2.45, z: 0.35, base: 0, w: 0.75, h: 0.7, rotY: -0.35 },
  { x: -1.05, z: 1.05, base: 0, w: 0.55, h: 0.45, rotY: 0.2 },
  // second row
  { x: -2.05, z: 0.2, base: 0.7, w: 0.65, h: 0.5, rotY: 0.3 },
  { x: -1.05, z: 0.02, base: 0.7, w: 0.6, h: 0.5, rotY: 0.12, mobile: true },
  { x: 0, z: -0.05, base: 0.7, w: 0.62, h: 0.5, rotY: 0 },
  { x: 1.05, z: 0.02, base: 0.7, w: 0.6, h: 0.5, rotY: -0.12, mobile: true },
  { x: 2.05, z: 0.2, base: 0.7, w: 0.65, h: 0.5, rotY: -0.3 },
  // top row
  { x: 0, z: -0.12, base: 1.2, w: 1.05, h: 0.8, rotY: 0, mobile: true },
  { x: -1.1, z: -0.05, base: 1.2, w: 0.5, h: 0.66, rotY: 0.15 },
  { x: 1.1, z: -0.05, base: 1.2, w: 0.58, h: 0.45, rotY: -0.15 },
];

export const styleAt = (slot: number) => STYLES.find((s) => s.slot === slot);
export const styleBySlug = (slug: string) => STYLES.find((s) => s.slug === slug);
