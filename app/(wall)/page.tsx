import Wall from '@/components/wall/WallLoader';
import { STYLES } from '@/lib/styles';
import s from './wall.module.css';

export default function Home() {
  return (
    <main>
      <h1 className={s.hidden}>Fluxion</h1>
      {/* Keyboard, screen-reader and no-WebGL path to every style; appears when focused. */}
      <nav aria-label="Styles" className={s.channels}>
        {STYLES.map((st) => (
          <a key={st.slug} href={`/${st.slug}/`}>
            {st.name} <span>{st.category}</span>
          </a>
        ))}
      </nav>
      <Wall />
    </main>
  );
}
