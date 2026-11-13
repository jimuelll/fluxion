import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false, // the dev-only "N" badge sits on top of the styles' own corners
};

export default config;
