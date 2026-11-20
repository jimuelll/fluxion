# Fluxion

Fluxion is a handmade collection of distinct UI styles, built as a static Next.js site.

It covers landing pages, marketing sites, product UI, web apps, admin dashboards, and purely creative pieces. Each one is its own design, with its own type, color, layout, and motion.

## Capturing

Two Playwright scripts live in `scripts/`. Setup once: `npx playwright install chromium`.

**Review a site as images** (a reference site, or one of our styles):

```bash
node scripts/capture.mts <url> <name>
```

Writes `reference/<name>/{desktop,mobile}/` with contact sheets for the hero/intro motion, one scroll reveal, the full scroll down (`scroll.jpg` plus `scroll-NN.jpg` frames), and the scroll back up.

**Record the TV-wall previews:**

```bash
npm run previews [base-url] [slug ...]
```

Start the dev server first. The default base URL is `http://localhost:4310`. It records `public/previews/<slug>.webm` plus a `.jpg` poster for every style that has a `preview` in `lib/styles.ts`, or only the slugs you pass. Frames are screenshotted one by one at 4:3 (640x480), so the clip skips the CRT power-on and the remote. They are encoded to VP9 WebM with the ffmpeg that ships with Playwright, which can't make MP4.
