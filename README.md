# Anthony Nkwa — portfolio

A one-page portfolio drawn as a night transit map: each body of work is a line from data
to interface, each station a real component, each interchange a technology the lines share.
Text types itself like a terminal, a split-flap departure board flips into place, and a
dashed red extension marches to the next stop. Everything settles to a still map under `prefers-reduced-motion`.

Next.js (App Router) + strict TypeScript, exported as static files. No CMS, no runtime
secrets.

## Run it

Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ locally
npm run validate   # every check CI runs: format, lint, types, knip, tests, build, e2e
```

GitHub repos and live-site links are fetched and checked when the site is built, so a
push (which rebuilds the site) refreshes them. `prebuild` clears Next's fetch cache so a
build never reuses an earlier build's responses.

Deploy `out/` to any static host (Vercel, Netlify, Cloudflare Pages, S3).

## Edit the content

Each line of work has its own file in [`src/content/lines/`](src/content/lines/): its
stations, stack, summary, Experience entry and screenshots. The shapes are in
[`src/content/types.ts`](src/content/types.ts), and
[`src/content/network.ts`](src/content/network.ts) puts the lines together with the
interchanges (shared tech) and the next stop. Contact details are in
`src/content/contact.ts`.

Map positions are in map units (`COL` in `src/content/map.ts` for x, each line's `y`).
A `route` gives a line's track as points (90° and 45° moves only), and a station off
the main row takes its own `y`.

Screenshots live in `public/work/`. A shot listed in a line file ships only if its file
exists there at build time (e.g. `public/work/mbas.webp`).

## Layout

- `src/app/` — the root layout, `globals.css` (tokens, themes and base styles only) and
  `page.tsx`, which only puts the sections in order
- `src/sections/` — one file per page section (header, hero, about, experience,
  projects, GitHub, contact, footer), each with its own `.css`
- `src/features/` — the pieces the sections are built from, each a folder with its
  components and their `.css`:
  - `network-map/` — the map (horizontal on desktop, vertical under 720px) and its key
  - `departure-board/` — the split-flap board (one row per line, plus "your team")
  - `line-section/` — one line, drawn as a carriage strip map; `reveal.tsx` rides it
    with the scroll
  - `service-history/` — the Experience list
  - `github/` — the profile card and public repos, fetched at build time
  - `contact/` — the contact form and the mailto it builds
  - `typewriter/` — text that types itself in
  - `theme/` — the day/night switch
- `src/content/` — everything the page says
- `src/lib/` — dates, live-link checks and the in-view hook

Files and folders are kebab-case, with named exports only (Next.js's own `layout.tsx`
and `page.tsx` are the exceptions). Unit specs sit beside the code they test
(`*.spec.ts`), and `e2e/` holds a Playwright smoke test of the built site. The full set of
rules, and which check enforces each one, is in
[`docs/conventions.md`](docs/conventions.md).
