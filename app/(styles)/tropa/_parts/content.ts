// Tropa: fictional AI-crew product for Filipino small businesses. All names, numbers and quotes are made up.

export const NAV = ['Product', 'Templates', 'Pricing', 'Stories', 'Blog'];

// Avatars are Open Peeps via DiceBear (CC0), friendly faces only, one SVG per name in /public/tropa/crew.
export const CREW = ['nena', 'jun', 'bea', 'migs', 'tess', 'kiko', 'lito', 'rosa', 'dodong', 'inday', 'popoy', 'ising', 'toto', 'mayet', 'bong', 'cora'];
export const face = (n: string) => `/tropa/crew/${n}.svg`;

// Hero tiles: where each one lands once the ring scatters (vw / vh from centre, scale). Kept clear of the paragraph.
export const SCATTER: [number, number, number][] = [
  [-38, -30, 1.3], [-17, -29, 0.9], [-2, -32, 0.6], [15, -28, 0.95], [34, -29, 1.25], [-38, 0, 1.05],
  [40, 2, 1.2], [-27, 28, 0.95], [-15, 35, 0.7], [-6, 31, 0.8], [5, 34, 0.6], [15, 31, 0.9],
  [24, 28, 1], [33, 31, 1.2], [-41, 33, 1.15], [41, 34, 0.9],
];

// Phones: measured off Skydive's mobile scatter. Tiles ring the paragraph and bleed off both edges.
export const SCATTER_MOBILE: [number, number, number][] = [
  [-35, -34, 1.2], [30, -32, 1.1], [-16, -25, 0.75], [12, -27, 0.85], [-2, -20, 0.5], [33, -22, 0.55],
  [49, -6, 1.05], [-49, 2, 1.05], [-27, 23, 0.85], [-13, 32, 0.75], [12, 31, 0.7], [37, 25, 1.1],
  [-38, 37, 1.05], [26, 39, 1], [0, 26, 0.55], [-30, -30, 0.5],
];

export const INTRO =
  'Tropa crew members aren’t chatbots that say “please hold.” They have names, roles and access to your shop’s apps. They start on day one, and get better every week they work with you.';

export const NENA_CHAT = [
  { me: false, text: 'Hi po! Available pa po ba yung 1/4 lechon for Sunday?' },
  { me: true, text: 'Yes po! ₱2,850, ready by 11AM Sunday. Pick-up or delivery?' },
  { me: false, text: 'Delivery po sa Banilad 🙏' },
  { me: true, text: 'Noted! I sent the GCash QR. Reply once paid po.' },
];

export const NOTIFS = [
  ['nena', 'Nena', '2m ago', 'Morning summary is ready', '42 orders for Sunday, 38 paid'],
  ['bea', 'Bea', '3h ago', 'GCash matched', '61 of 63 payments, 2 flagged'],
  ['jun', 'Jun', '6h ago', 'Restock ordered', '3 cases Coke, 2 sacks rice'],
] as const;

export const TERMINAL = [
  ['cmd', 'python reconcile.py --gcash --since kahapon'],
  ['out', 'matched 61 of 63 payments'],
  ['warn', '2 unmatched · ₱1,240 total'],
  ['ok', 'wrote bayad-report.csv'],
  ['ok', 'sent summary to owners on Viber'],
] as const;

export const MEMORY = [
  ['Reports in Taglish, short lang', true],
  ['Ask boss before refunds over ₱1,000', true],
  ['Suki get 5% off, never post it publicly', false],
  ['No deliveries promised past 8PM', false],
  ['Weekly sales report every Monday 7AM', false],
] as const;

export const TOOLS = ['Messenger', 'GCash', 'Shopee', 'Sheets', 'Canva', 'Gmail'] as const;

export const COMMANDS = [
  ['cora', 'paki-remind ako sa Friday', '9:41'],
  ['cora', 'i-chart ang benta this month', '9:44'],
  ['cora', 'post the promo sa page natin', '9:48'],
] as const;

export const TEMPLATES = [
  ['sarisari', 'nena', 'Sari-sari Keeper', 'Tracks stock and tells you what suki will run out of before they do.', ['Sheets', 'Messenger']],
  ['kwekkwek', 'migs', 'Merienda Stall Manager', 'Takes pre-orders for the 3PM rush and totals the batter you need.', ['Messenger', 'GCash']],
  ['store', 'kiko', 'Online Seller VA', 'Answers “HM po?” and “available?” on Shopee and TikTok Shop, all day.', ['Shopee', 'Messenger']],
  ['isaw', 'jun', 'Ihaw-ihaw Pre-orders', 'Collects orders by 5PM so the grill starts on time and nothing goes to waste.', ['Messenger', 'Sheets']],
  ['kubo', 'tess', 'Homestay Booker', 'Fills weekends, sends directions, and moves no-shows to the waitlist.', ['Gmail', 'GCash']],
  ['counter', 'bea', 'Grocery Bookkeeper', 'Logs income, sorts receipts and preps BIR forms for your review.', ['Sheets', 'Gmail']],
] as const;

export const QUOTES = [
  ['rosa', 'Cora Villanueva', 'Tindahan ni Aling Cora', '“Si Jun ang nagsasabi kung ano ang mauubos. Hindi na ako nauubusan ng yelo.”'],
  ['tess', 'Ria Mendoza', 'Glow Lab Salon', '“No-shows dropped by half in the first month.”'],
  ['popoy', 'Paolo Sy', 'Sy Hardware, Iloilo', '“Bea closed our books two days early. First time in eleven years.”'],
  ['inday', 'Inday Lacson', 'Lacson Homestay, Siquijor', '“Guests think I answer at 3AM. I’m asleep. Tess isn’t.”'],
  ['toto', 'Toto Ramos', 'Ihaw ni Toto', '“Pre-orders by 5PM means zero sayang na isaw.”'],
  ['mayet', 'Mayet Cruz', 'Mayet’s Kakanin', '“I made three crew members on my phone during lunch.”'],
] as const;

export const FOOT = [
  ['Product', ['Messenger', 'Viber', 'SMS', 'Web', 'Mobile app']],
  ['Explore', ['Pricing', 'Templates', 'Integrations', 'Help center']],
  ['Company', ['About', 'Careers', 'Contact', 'Brand']],
] as const;
