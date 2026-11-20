// backdrop behind the cutout art, drawn in the art's pixel space (2348x1412) so it tracks the image at every width.
// depth, back to front: haze → blurred far planes → gouache strokes → linework → specks; a radial mask dissolves it all into the page
export default function Paint() {
  return (
      <svg className="hero-paint" viewBox="0 0 2348 1412" aria-hidden="true">
        <defs>
          <filter id="gouache" x="-15%" y="-40%" width="130%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="3" seed="3" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="46" xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0015 0.16" numOctaves="2" seed="9" result="streak" />
            <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -0.75" result="dry" />
            <feComposite in="shape" in2="dry" operator="in" result="brushed" />
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="1" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 0.62" result="chalk" />
            <feComposite in="brushed" in2="chalk" operator="in" />
          </filter>
          <filter id="far" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16" /></filter>
          <filter id="bokeh" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" /></filter>
          <radialGradient id="haze" cx="1300" cy="560" r="1100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#CBE3DE" />
            <stop offset=".55" stopColor="#E4EFEC" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fadeGrad" cx="1220" cy="640" r="1250" gradientUnits="userSpaceOnUse">
            <stop offset=".45" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="fade" maskUnits="userSpaceOnUse" x="-600" y="-600" width="3600" height="2600">
            <rect x="-600" y="-600" width="3600" height="2600" fill="url(#fadeGrad)" />
          </mask>
        </defs>
        <g mask="url(#fade)">
          <rect x="-600" y="-400" width="3600" height="2200" fill="url(#haze)" />
  
          <g filter="url(#far)">
            <g filter="url(#gouache)">
              <path fill="#D9E7E4" d="M760 170 1880 70 2240 520 980 650Z" />
              <path fill="#D3DBE3" d="M260 930 1120 690 1270 820 360 1120Z" />
              <path fill="#E8D9DE" d="M1700 860 2300 760 2380 900 1760 990Z" />
            </g>
          </g>
  
          <g transform="translate(1520 1010) rotate(-20)" filter="url(#gouache)">
            <path fill="#B5D6D0" d="M-1000 15C-700-110-200-150 350-135 700-125 950-70 1060-20 900 50 500 120 0 135-450 145-800 100-1000 15Z" />
            <path fill="#6FA9A1" d="M-650-80C-300-128 300-132 900-96 600-58 0-52-650-80Z" />
          </g>
          <g transform="translate(1330 330) rotate(-12)" filter="url(#gouache)">
            <path fill="#C9DFDA" d="M-520 6C-250-40 200-46 560-14 260 20-180 34-520 6Z" />
          </g>
  
          <g fill="none" strokeLinecap="round">
            <circle cx="1080" cy="640" r="560" stroke="#8DBDB6" strokeWidth="3" strokeDasharray="1300 50 260 40 820 2000" transform="rotate(-150 1080 640)" />
            <circle cx="1080" cy="640" r="610" stroke="#A4667D" strokeWidth="1.5" strokeDasharray="180 28 520 4000" transform="rotate(-40 1080 640)" />
            <path stroke="#8DBDB6" strokeWidth="3" d="M1690 470l26-8M1702 520l26-6M1710 572l26-4" />
          </g>
  
          <g fill="#6FA9A1">
            <rect x="1890" y="300" width="14" height="5" transform="rotate(-20 1890 300)" />
            <rect x="2050" y="420" width="9" height="4" transform="rotate(-20 2050 420)" />
            <rect x="1600" y="230" width="6" height="6" />
            <rect x="2140" y="980" width="12" height="4" transform="rotate(-20 2140 980)" />
            <rect x="420" y="560" width="8" height="8" fill="#3B6FB6" />
            <rect x="1960" y="610" width="22" height="5" fill="#C4123E" transform="rotate(-20 1960 610)" />
          </g>
          <g filter="url(#bokeh)" fill="#9CC8C1" opacity=".7">
            <circle cx="1780" cy="180" r="16" />
            <circle cx="2230" cy="640" r="22" />
            <circle cx="520" cy="300" r="12" />
            <circle cx="1450" cy="1180" r="18" fill="#E2B6C4" />
          </g>
        </g>
      </svg>
  );
}
