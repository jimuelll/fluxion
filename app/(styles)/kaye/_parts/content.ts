// Filler copy for a fictional creator. The design is the point; the words are buzzwords on purpose.

/** Photo slots. Each one is public/kaye/<name>.webp; sources and photographers are in CREDITS.md. */
export const PHOTOS = {
  kaye: { alt: 'Woman photographing a plate of food at a table' },
  p1: { alt: 'Cheesy pizza slice being lifted' },
  p2: { alt: 'Chopsticks lifting noodles from a bowl of soup' },
  p3: { alt: 'Braided sweet buns with custard centres' },
  p4: { alt: 'Oysters on ice with a lemon wedge' },
  p5: { alt: 'Milk being poured into a cup of coffee' },
  p6: { alt: 'Chef garnishing a plated dish with herbs' },
  p7: { alt: 'Grain salad in a wooden bowl' },
  p8: { alt: 'Hand holding a cocktail with an orange garnish' },
} satisfies Record<string, { alt: string }>;

export type PhotoName = keyof typeof PHOTOS;

export const NAV = ['Work', 'Services', 'Pricing'];

export const MARQUEE = ['Recipe Reels', 'Taste Tests', 'Food Trips', 'Hook Variations', 'Taglish Voiceovers', 'Raw Footage', 'Usage Rights'];

export const ABOUT_CHIPS = ['Restos', 'Bakeshops', 'Kapihan', 'Street food', 'Drinks', 'Lutong bahay'];

export const FILTERS = ['All', 'Taste test', 'Recipe', 'Behind the line', 'Hook variations'] as const;
export type Filter = (typeof FILTERS)[number];

export const CARDS: { brand: string; product: string; tag: Exclude<Filter, 'All'>; views: string; caption: string; photo: PhotoName }[] = [
  { brand: 'Pizzeria Poblacion', product: 'Longganisa brick-oven pizza', tag: 'Taste test', views: '1.4M', caption: 'Drove 40 mins in EDSA traffic for this crust…', photo: 'p1' },
  { brand: 'Batchoy Bros.', product: 'La Paz batchoy', tag: 'Hook variations', views: '2.1M', caption: 'Stop scrolling kung sabaw person ka', photo: 'p2' },
  { brand: "Lola Nena's", product: 'Custard ensaymada', tag: 'Recipe', views: '640K', caption: 'The ensaymada everyone is lining up for', photo: 'p3' },
  { brand: 'Talaba Tayo', product: 'Kinilaw na talaba', tag: 'Taste test', views: '380K', caption: 'First time trying talaba. Honest review.', photo: 'p4' },
  { brand: 'Kapeng Malaya', product: 'Barako sea-salt latte', tag: 'Behind the line', views: '910K', caption: 'How they pour 400 of these a day', photo: 'p5' },
  { brand: 'Hapag', product: "Chef's counter", tag: 'Behind the line', views: '1.2M', caption: 'POV: you are on the pass at 9pm', photo: 'p6' },
  { brand: 'Gulay Club', product: 'Laing grain bowl', tag: 'Recipe', views: '520K', caption: 'My 5-minute baon, upgraded', photo: 'p7' },
  { brand: 'Kalamansi Bar', product: 'Calamansi highball', tag: 'Hook variations', views: '770K', caption: 'This drink fixed my whole week', photo: 'p8' },
];

export const BRANDS = ['Pizzeria Poblacion', 'Batchoy Bros.', 'Sari-Sari Social', 'Talaba Tayo', 'Kapeng Malaya', 'Inasal Ihaw', "Lola Nena's", 'Gulay Club', 'Kalamansi Bar', 'Hapag'];

export const SERVICES: { title: string; body: string; photo: PhotoName }[] = [
  { title: 'Recipe Reels', body: 'Native-feeling 15–60s recipe videos for TikTok, Reels and Shorts, scripted, shot and edited by me.', photo: 'p7' },
  { title: 'Taste Tests', body: 'Honest first-bite reactions that make people book a table the same night.', photo: 'p1' },
  { title: 'Plated Photos', body: 'Lifestyle and close-up dish photos for menus, delivery apps, ads and your feed.', photo: 'p3' },
  { title: 'Hook Variations', body: '3–5 different openings per video, so you can A/B test what stops the scroll.', photo: 'p2' },
  { title: 'Voiceover', body: 'Warm English, Tagalog or Taglish voiceover for menus, explainers and faceless edits.', photo: 'p5' },
  { title: 'Raw Footage', body: 'Every usable clip delivered unedited, so your team can cut new ads any time.', photo: 'p6' },
  { title: 'Usage Rights', body: 'Organic, paid and whitelisting licences for 30 days to 12 months, or in perpetuity.', photo: 'p8' },
];

export const STATS = [
  { to: 14, suffix: 'M+', decimals: 0, label: 'Organic views', sub: 'across TikTok & Reels' },
  { to: 4.1, suffix: '%', decimals: 1, label: 'Average CTR', sub: 'on paid Meta ads' },
  { to: 3.6, suffix: 'x', decimals: 1, label: 'Best ROAS', sub: 'Pizzeria Poblacion launch' },
  { to: 11.2, suffix: '%', decimals: 1, label: 'Engagement rate', sub: 'average, last 90 days' },
];

export const TICKER = [
  'Pizzeria Poblacion · +180% weekend covers',
  'Batchoy Bros. · 2.1M views on one hook',
  "Lola Nena's · ensaymada sold out by 11am",
  'Kapeng Malaya · cost per order down 41%',
  'Hapag · fully booked for 3 weeks',
];

export const QUOTES = [
  { quote: 'Kaye’s first video out-booked every ad we ran that quarter. She just gets how our customers talk.', name: 'Carla Mendoza', role: 'Owner, Pizzeria Poblacion' },
  { quote: 'We gave her one bowl and a Tuesday. We got a month of content and a pila out the door.', name: 'Mark Villanueva', role: 'Founder, Batchoy Bros.' },
  { quote: 'The hook variations alone paid for the whole package. Sulit talaga. Our cost per order halved.', name: 'Trish Gonzales', role: 'Growth Lead, Kapeng Malaya' },
  { quote: 'Fast, funny and painfully good with a phone. Our kitchen team actually enjoyed the shoot.', name: 'Rico Bautista', role: 'Head Chef, Hapag' },
  { quote: 'Customers quote her captions back to us at the counter. Never happened in 40 years of baking.', name: 'Nena Aquino', role: "Owner, Lola Nena's" },
];

export const PACKAGES = [
  {
    name: 'Starter',
    blurb: 'Test the waters with one crave-worthy video.',
    price: '₱15,000',
    features: ['1 UGC video (up to 45s)', '2 hook variations', '30-day organic usage', '1 round of revisions', 'Delivered in 5 days'],
    cta: 'Book Starter',
  },
  {
    name: 'Standard',
    blurb: 'The sweet spot for kitchens running paid social.',
    price: '₱35,000',
    features: ['3 UGC videos', '3 hooks per video', 'Raw footage included', '90-day paid usage', '2 rounds of revisions'],
    cta: 'Book Standard',
    featured: true,
  },
  {
    name: 'Premium',
    blurb: 'A full content drop for launches and new menus.',
    price: '₱65,000',
    features: ['5 UGC videos + 10 photos', '5 hooks per video', 'Voiceover + raw footage', '6-month paid usage & whitelisting', 'Priority 4-day delivery'],
    cta: 'Book Premium',
  },
];

export const STEPS = [
  { n: '01', title: 'Brief', day: 'Day 1', body: 'You share the dish, the goals and the must-says. I ask the makulit questions.' },
  { n: '02', title: 'Script', day: 'Day 2', body: 'Hooks, talking points and a shot list, approved by you before I cook a thing.' },
  { n: '03', title: 'Shoot', day: 'Day 3–4', body: 'Filmed in your kitchen or mine, with natural light and real, messy moments.' },
  { n: '04', title: 'Edit', day: 'Day 4–5', body: 'Fast cuts, captions, music and hook variations, ready for every platform.' },
  { n: '05', title: 'Delivery', day: 'Day 5', body: 'Final files in a shared folder, plus one round of revisions included.' },
];

export const BUDGETS = ['Under ₱25k', '₱25k – ₱75k', '₱75k – ₱250k', '₱250k+'];

export const FOOTER = {
  menu: ['Work', 'Services', 'Pricing', 'Contact'],
  follow: ['Instagram', 'TikTok', 'Facebook'],
};
