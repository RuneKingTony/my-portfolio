# Anthony Nkwa — portfolio

A one-page portfolio drawn as a night transit map: each body of work is a line from data
to interface, each station a real component, each interchange a technology the lines share.
Text types itself like a terminal, a split-flap departure board flips into place, and a
dashed red extension marches to the next stop. Everything settles to a still map under `prefers-reduced-motion`.

Next.js (App Router) + strict TypeScript, exported as static files. No CMS, no runtime
secrets.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # static site in out/
npm start          # serve out/ locally
```

Deploy `out/` to any static host (Vercel, Netlify, Cloudflare Pages, S3).

## Edit the content

Everything on the page comes from [`src/content/network.ts`](src/content/network.ts):
lines, stations, interchanges and contact details. Map positions are in map units
(`COL` for x, each line's `y`). A `route` gives a line's track as points (90° and 45°
moves only), and a station off the main row takes its own `y`.

Screenshots are optional. A shot listed in `network.ts` ships only if its file exists
under `public/` at build time (e.g. `public/work/mbas.webp`).

## Layout

- `src/app/page.tsx` — the page
- `src/components/NetworkMap.tsx` — the map (horizontal on desktop, vertical under 720px) and its key
- `src/components/DepartureBoard.tsx` — the split-flap board (rows come from `departures` in network.ts)
- `src/components/LineSection.tsx` — one line, drawn as a carriage strip map; `Reveal.tsx` rides it with the scroll
- `src/app/globals.css` — tokens and styles
- `PRODUCT.md`, `DESIGN.md` — product truth and the design system
