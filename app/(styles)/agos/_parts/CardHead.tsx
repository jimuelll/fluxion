import type { LucideIcon } from 'lucide-react';

/** Card header band: raised icon tile, title, muted sub-label, then any extras pushed right. */
export function CardHead({ icon: Icon, title, sub, children }: { icon: LucideIcon; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <header className="card__head">
      <span className="tile">
        <Icon size={15} strokeWidth={1.7} aria-hidden />
      </span>
      <h2>{title}</h2>
      {sub && <small>{sub}</small>}
      {children}
    </header>
  );
}
