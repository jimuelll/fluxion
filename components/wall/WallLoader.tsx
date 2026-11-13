'use client';

import dynamic from 'next/dynamic';

// WebGL and window access only exist in the browser.
const Wall = dynamic(() => import('./Wall'), { ssr: false });

export default Wall;
