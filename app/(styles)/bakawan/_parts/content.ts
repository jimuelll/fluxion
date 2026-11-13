// Filler copy for a fictional company. The design is the point; the words are buzzwords on purpose.

/** Photo slots. Each one is public/bakawan/<name>.webp; sources and photographers are in CREDITS.md. */
export const PHOTOS = {
  hero1: { alt: 'River winding across marsh plains under a cloudy sky' },
  hero2: { alt: 'Misty river valley between green hills' },
  hero3: { alt: 'Seagrass seen half above and half below the waterline' },
  stats: { alt: 'Grassy islands in a wide river, seen from above' },
  marsh: { alt: 'Tall marsh grass around shallow pools' },
  seagrass: { alt: 'Seagrass meadow underwater' },
  reef: { alt: 'Mussels and barnacles at the waterline' },
  shoreline: { alt: 'Dune grass growing on a sandy beach' },
  credits: { alt: 'Researchers working aboard a boat' },
  monitoring: { alt: 'Turquoise tidal flats seen from above' },
  values: { alt: 'Misty lake with trees reflected in it' },
  purpose: { alt: 'Person standing in a creek at sunset' },
  journal1: { alt: 'Mangrove roots in clear shallow water' },
  journal2: { alt: 'Woman planting a sapling' },
  journal3: { alt: 'Waves crashing over a harbour wall' },
  journal4: { alt: 'Sunlit kelp forest' },
  cta: { alt: 'Marsh grass under a pink sunset sky' },
} satisfies Record<string, { alt: string }>;

export type PhotoName = keyof typeof PHOTOS;

export const NAV = ['Restoration', 'Credits', 'Science', 'Journal', 'About'];

export const MARQUEE = ['Blue Carbon', 'Bakawan Forests', 'Seagrass Recovery', 'Typhoon Resilience', 'Healthy Seas, Full Nets'];

export const BLOBS = [
  // Resting place in a 1280px-wide pile: left/bottom in px (bottom > 0 = sits on a neighbour), rotation (deg), fall delay (ms).
  // Mobile positions are in style.css.
  { label: 'Typhoon Buffer', icon: 'Waves', shape: 'squircle', color: 'mango', left: 80, bottom: 0, r: -12, d: 0 },
  { label: 'Low Upkeep', icon: 'Sprout', shape: 'pill', color: 'peach', left: 272, bottom: 0, r: 2, d: 160 },
  { label: 'Carbon Capture', icon: 'Leaf', shape: 'flower', color: 'sage', left: 360, bottom: 74, r: 6, d: 420 },
  { label: 'Fuller Nets', icon: 'Fish', shape: 'tri', color: 'mango', left: 600, bottom: 0, r: -14, d: 240 },
  { label: 'Clearer Water', icon: 'Droplets', shape: 'diamond', color: 'sky', left: 840, bottom: 0, r: 30, d: 520 },
  { label: 'Verified Credits', icon: 'BadgeCheck', shape: 'circle', color: 'deep', left: 1064, bottom: 0, r: 0, d: 320 },
] as const;

export const STATS = [
  { icon: 'Map', label: 'Hectares of bakawan replanted', to: 1240, suffix: '' },
  { icon: 'CloudOff', label: 'Tonnes CO₂e locked', to: 86, suffix: 'K' },
  { icon: 'Sprout', label: 'Seedling survival', to: 91, suffix: '%' },
  { icon: 'Landmark', label: 'Partner LGUs', to: 38, suffix: '' },
  { icon: 'Ruler', label: 'Km of coastline monitored', to: 412, suffix: '' },
  { icon: 'Gauge', label: 'Faster verification', to: 3, suffix: '×' },
] as const;

export const SERVICES: { title: string; body: string; photo: PhotoName }[] = [
  { title: 'Mangrove Revival', body: 'Native bakawan and pagatpat, planted where the tide wants them, not where it is convenient.', photo: 'marsh' },
  { title: 'Seagrass Meadows', body: 'Seed, monitor and scale the quiet carbon sink under every lagoon.', photo: 'seagrass' },
  { title: 'Reef & Shellfish Beds', body: 'Living breakwaters that filter water, feed fishers and grow with the sea.', photo: 'reef' },
  { title: 'Living Shorelines', body: 'Soft engineering that outlasts seawalls through typhoon season after typhoon season.', photo: 'shoreline' },
  { title: 'Blue Carbon Credits', body: 'High-integrity credits, verified from putik core sample to registry.', photo: 'credits' },
  { title: 'Coastal Monitoring', body: 'Drone, sensor and satellite data in one dashboard your LGU can actually use.', photo: 'monitoring' },
];

export const SPLIT = [
  {
    title: 'See how mangroves can outlast concrete seawalls.',
    body: 'From feasibility studies to long-term stewardship, we help LGUs, resorts and port operators turn exposed coastline into a resilient, revenue-generating asset.',
    cta: 'Explore Approaches',
  },
  {
    title: 'Discover how barangays are turning restoration into real income.',
    body: 'Programmes from Bohol to Palawan that cut storm damage, brought back the catch and unlocked verified carbon revenue for the fishing communities that host them.',
    cta: 'Read Case Studies',
  },
];

export const LOGOS = [
  { name: 'Isla Verde Trust', icon: 'TreePine' },
  { name: 'Baybay Capital', icon: 'Sun' },
  { name: 'Dagat Labs', icon: 'Waves' },
  { name: 'Lambat Co.', icon: 'Anchor' },
  { name: 'Pawikan Fund', icon: 'Sprout' },
  { name: 'Sinag Ports', icon: 'Mountain' },
] as const;

export const VALUES = [
  { title: 'Science First', body: 'Every planting is grounded in peer-reviewed ecology and measured against a real baseline, not a press release.' },
  { title: 'Bayanihan by Design', body: 'The fisherfolk who live with the tide shape the plan, share the income and steward the result.' },
  { title: 'Radically Transparent', body: 'Open data, open methods and credits you can trace from the putik to the registry.' },
  { title: 'Built for Generations', body: 'We design for the sea level our apo will live with, not the next election cycle.' },
];

export const QUOTES = [
  { quote: 'Bakawan turned a failing seawall budget into a living mangrove belt. After the last typhoon, our coastal barangays barely flooded.', name: 'Maricel Dela Cruz', role: 'Municipal Environment Officer', org: 'Bantayan, Cebu' },
  { quote: 'Their monitoring made our blue carbon credits the easiest due diligence our investors have ever done.', name: 'Paolo Reyes', role: 'Director of Climate Finance', org: 'Baybay Capital' },
  { quote: 'Two seasons in, the catch near our seagrass beds tripled. Salamat, they listened to us before they planted anything.', name: 'Josefina “Pinang” Abad', role: 'President', org: 'Panay Fisherfolk Association' },
  { quote: 'They walked the shoreline with our kapitan before they drew a single plan. That is why it worked.', name: 'Ramon Villanueva', role: 'Harbourmaster', org: 'Sinag Ports' },
];

export const POSTS: { tag: string; title: string; date: string; photo: PhotoName }[] = [
  { tag: '#BLUE CARBON', title: 'Why Seagrass Is the Quiet Giant of Philippine Climate Finance', date: 'Oct 28, 2026', photo: 'journal4' },
  { tag: '#BAYANIHAN', title: 'What 400 Volunteers in Bohol Taught Us About Planting Bakawan', date: 'Sep 12, 2026', photo: 'journal2' },
  { tag: '#RESILIENCE', title: 'Seawalls vs. Mangroves: A 30-Year Cost Comparison After Yolanda', date: 'Aug 03, 2026', photo: 'journal3' },
  { tag: '#SCIENCE', title: 'Reading the Putik: How We Verify Carbon From Core Samples', date: 'Jul 19, 2026', photo: 'journal1' },
];

export const FOOTER = [
  { head: 'Company', links: ['About', 'Approach', 'Careers', 'Press', 'Contact'] },
  { head: 'Programmes', links: ['Mangroves', 'Seagrass', 'Shellfish Beds', 'Shorelines'] },
  { head: 'Resources', links: ['Journal', 'Methodology', 'Registry', 'Open Data'] },
];
