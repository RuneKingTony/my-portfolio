---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Surface brief: portfolio home (single page)

Scope: the whole one-page portfolio at `src/app/page.tsx`. Visitor mode: Experience (the work leads), read by hiring teams first, freelance prospects second.

Audience/job: an engineering manager skimming between candidates wants to know, fast, what Anthony builds end to end and whether his judgement holds on money and security code. Action: email Anthony / open GitHub.

Proof: seven real bodies of work (FoodCourt, the unnamed fintech Aug 2024 – Aug 2026, EduVault, Anchor Fit, GVR Labs, Pharma-AID, and the Algo Script trading bot), with real stops taken from each codebase and real dates. No commit counts (user decision). Screenshots for the GVR client sites, Anchor Fit and Pharma-AID once they are copied into public/work/.

Constraints: no employer name, no invented metrics, no profitability claim for the bot, no tokens shipped.

## Direction contract

THESIS: The portfolio is a transit diagram of Anthony's systems: each product is a coloured line running from data to interface, each station a real component, each interchange a technology the lines truly share. It refuses the dark hero + card grid + skills-badge wall.

OWN-WORLD (revised 2026-10-06 at the user's request: dark, more type, more motion): a night network map on black map stock, flat solid line colours with no gradients or glow (GVR blue, Fintech teal, EduVault green, Anchor Fit amber, MT5 violet); signal red is reserved for the next stop: the dashed "your team" extension, the NXT board row, and the email, which is that terminus. A split-flap departure board in the hero. Display type is Big Shoulders (city-signage grotesk) in uppercase, body Overpass, board and codes Martian Mono. Lines are thick strokes on a visible construction grid, 90°/45° only. Stations are ticks; interchanges are white-ringed capsules. Panels are line-coloured bars with a pill line badge.

STORY: The reader sees the whole network at once (breadth), rides one line into its stations (depth: the hard problem and decision at each stop), notices the interchanges (TypeScript, Postgres, React carry everything), and arrives at the terminus: email.

FIRST VIEWPORT (revised 2026-10-06 with the dark round): a sticky black signage bar with a white "ANTHONY NKWA" station plate. Desktop: name in Big Shoulders caps at display scale with the lede and the primary action (a white "Email me" terminus sign plus GitHub) at left; the split-flap departure board at right (EDU/ANC/GVR running, MT5 survived, FIN arrived, NXT your team boarding); the night map below at full width, drawing in, then trains running; the key sits just below the fold at 900px. Phones: name, lede and actions, then the vertical map, then the board. The fintech "you are here" marker is retired because that role ended in Aug 2026 (user, this round).

FORM: Harry Beck–style system map with Swiss signage, position 7 on the ordered list, seed key 96d60468. Signature interaction: selecting an interchange or line key item isolates those lines (others go to grey) and redraws the isolated stroke, without scrolling away from the map; each line's badge and name on the map, and the caption, link to that line's section (amended after the finish review, 2026-10-06); riding a line reveals its stations in order as the stroke draws. Motion grammar (revised 2026-10-06, user: text should type like a terminal; no trains on the map): the name and lede type themselves with a blinking block cursor, section headings type as they scroll in, the board flaps settle, the strokes draw along their paths, and the dashed extension marches toward the next stop; in each line section a train rides the strip with the scroll and lights stops as it passes. Nothing bounces. Reduced motion shows everything typed, the finished map, the settled board and fully ridden strips.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
