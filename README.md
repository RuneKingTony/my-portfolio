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

Everything on the page comes from [`src/content/network.ts`](src/content/network.ts):
lines, stations, interchanges and contact details. Map positions are in map units
(`COL` for x, each line's `y`). A `route` gives a line's track as points (90° and 45°
moves only), and a station off the main row takes its own `y`.

Screenshots live in `public/work/`. A shot listed in `network.ts` ships only if its file
exists there at build time (e.g. `public/work/mbas.webp`).

## Layout

- `src/app/page.tsx` — the page
- `src/components/NetworkMap.tsx` — the map (horizontal on desktop, vertical under 720px) and its key
- `src/components/DepartureBoard.tsx` — the split-flap board (one row per project in network.ts, plus "your team")
- `src/components/LineSection.tsx` — one line, drawn as a carriage strip map; `Reveal.tsx` rides it with the scroll
- `src/components/GitHubProjects.tsx` — public repos, fetched at build time
- `src/app/globals.css` — tokens and styles
