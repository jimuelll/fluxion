'use client';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header" data-open={open}>
      <div className="header-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" fill="none" strokeLinecap="round">
            <path d="M4 24 C10 16, 16 9, 24 4" stroke="#2E5F5E" strokeWidth="3.2" />
            <path d="M8 26 C14 19, 19 13, 26 9" stroke="#4FA7A0" strokeWidth="1.6" />
            <path d="M2 14 H26" stroke="#B43C69" strokeWidth="1" />
          </svg>
          <span>ECHOFALL</span>
        </a>
        <button type="button" className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <nav id="primary-nav" className="nav" aria-label="Primary" onClick={(e) => (e.target as Element).closest('a') && setOpen(false)}>
          <a href="#world">World</a>
          <a href="#characters">Characters</a>
          <a href="#news">News</a>
          <a href="#media">Media</a>
          <a href="#preregister" className="cta">Pre-register</a>
        </nav>
      </div>
    </header>
  );
}
