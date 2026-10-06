---
name: Anthony Nkwa
description: A Software engineer portfolio drawn as a night network map with a split-flap departure board.
colors:
  ground: "#07080a"
  ground-2: "#0e1013"
  panel: "#000000"
  zone: "#101318"
  grid: "#14171c"
  rule: "#252931"
  dim: "#2c3038"
  dim-text: "#7c828c"
  tile: "#16181c"
  ink: "#f1f2f4"
  ink-2: "#b3b8c1"
  ink-3: "#8b919b"
  line-ink: "#0a0b0d"
  signal: "#ff4d3d"
  line-gvr: "#5b8cff"
  line-fin: "#2ec4b6"
  line-edu: "#3dd07a"
  line-anc: "#ffc21a"
  line-mt5: "#b98cff"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(4rem, 9vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.88
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 0.9
  terminus:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 6.4vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 1
  sign:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
  station:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
  code:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1
  board:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1
  annotation:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  tile: "2px"
  plate: "3px"
  sign: "4px"
  panel: "6px"
  pill-sm: "9px"
  pill-md: "12px"
  pill-lg: "20px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  max: "1440px"
  tile-gap: "2px"
  key-gap: "6px"
  stop: "30px"
  column-gap: "48px"
  line-section: "clamp(48px, 7vw, 88px)"
  section: "clamp(64px, 10vw, 128px)"
components:
  signage-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-2}"
    typography: "{typography.ui}"
    height: "52px"
  name-plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.plate}"
    padding: "5px 12px 2px"
  terminus-sign:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.sign}"
    padding: "12px 18px 10px"
  key-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill-lg}"
    padding: "6px 12px 4px"
    height: "40px"
  key-button-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  line-badge-md:
    textColor: "{colors.line-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.pill-md}"
    padding: "1px 7px 0"
    height: "24px"
  line-badge-lg:
    textColor: "{colors.line-ink}"
    rounded: "{rounded.pill-lg}"
    padding: "2px 14px 0"
    height: "40px"
  departure-board:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "14px 16px 10px"
  flap-tile:
    backgroundColor: "{colors.tile}"
    typography: "{typography.board}"
    rounded: "{rounded.tile}"
    width: "19px"
    height: "27px"
---

# Design System: Anthony Nkwa

## Overview

**Creative North Star: "The Night Network"**

The portfolio is a transit system after dark: a Harry Beck–style network map printed on black map stock, with a split-flap departure board in the station hall and city-signage type over everything. Each body of work is a flat-coloured line; each station is a real component; each interchange is a technology the lines really share. Depth comes from riding: the map shows the whole network at once, and each line section is a carriage strip the reader rides with their scroll.

Density is signage density: few words, set big and heavy, with grey descriptive text underneath. The dark ground carries almost no tone of its own (four near-blacks separate page, panel, zone and tile), so the five line colours and the single signal red do all the identification. Motion is the timetable, not ornament: things draw, settle, shuttle and march in a fixed order, and nothing bounces.

**Key Characteristics:**
- Black map stock with a visible 40px construction grid and alternating zone bands.
- Five flat line colours, one per body of work; signal red only for the next stop.
- Big Shoulders uppercase for every name of a place; Overpass for reading; Martian Mono for codes and the board.
- Tracks at 90° and 45° only; stations are ticks, interchanges are white-ringed capsules.
- A fixed motion grammar with a complete reduced-motion path.

## Colors

A near-black ground with five saturated line colours and one reserved red; everything else is a grey.

### Primary
- **Signal Red** (signal): the next stop and only the next stop. The dashed "your team" extension on the map, its tick and label, the NXT row and code on the departure board, the underline on the terminus sign, the planned track and "your team" in the closing headline, and the underline under the closing email.

### Secondary
- **Studio Blue** (line-gvr): the GVR Labs line.
- **Ledger Teal** (line-fin): the Fintech line.
- **Platform Green** (line-edu): the EduVault line.
- **Signal Amber** (line-anc): the Anchor Fit line.
- **Night Violet** (line-mt5): the MT5 bot, on its own separate network below the dashed separator.
- **Badge Ink** (line-ink): the near-black text set on any line-coloured badge, so every code reads dark on colour.

### Neutral
- **Map Stock** (ground): page background, casing around the strip train and large badges, fill inside interchange capsules.
- **Panel Black** (panel): the departure board and the signage bar (at 88% over a blur).
- **Zone Band** (zone): every other zone on the map; **Construction Grid** (grid) draws the 40px grid rules.
- **Screenshot Well** (ground-2): placeholder behind screenshots while they load.
- **Hairline** (rule): every 1px divider, panel border and key-button outline.
- **Out of Service** (dim) and **Out of Service Text** (dim-text): lines and labels not isolated, stops the train has not reached, the unridden strip rail, the map separator.
- **Flap** (tile): split-flap tile faces.
- **Lamp White** (ink): headings, names, the strip train, the typing cursor, interchange rings, pressed key buttons, the name plate and terminus sign.
- **Platform Grey** (ink-2) for body and descriptions; **Timetable Grey** (ink-3) for labels, zone names, board status and metadata terms.

### Named Rules
**The Next Stop Rule.** Red marks the next stop: the reader's team and the email that reaches it. Every red on the page points at contact; a red that does not is wrong. The fintech "you are here" red is retired.

**The One Line, One Colour Rule.** Line colours identify lines and nothing else: the stroke, its ticks, its badge, its plate bar, its strip, its role line and its swatch in the key. They never tint a background or a heading.

**The Flat Ink Rule.** Every colour is a flat solid. No gradients, no glow, no coloured shadows. Isolation swaps unlit lines to the grey out-of-service colours; it does not blur or fade them.

## Typography

**Display Font:** Big Shoulders (with Arial Narrow), loaded with its optical-size axis so large and small settings each get their own drawing
**Body Font:** Overpass (with system-ui)
**Label/Mono Font:** Martian Mono (with ui-monospace)

**Character:** Big Shoulders is a city-signage grotesk, condensed and heavy, set in uppercase for every name of a place; Overpass is a highway-sign sans that keeps the reading text plain and open; Martian Mono sets the board and line codes as data.

### Hierarchy
- **Display** (900, clamp(4rem, 9vw, 6rem), 0.86, uppercase): the name in the hero; the closing "Next stop: your team" uses the same voice at clamp(3.5rem, 9vw, 6rem).
- **Headline** (900, clamp(3rem, 7vw, 5.5rem), 0.88, uppercase): section heads ("Ride the lines", "Interchanges").
- **Title** (900, clamp(2.5rem, 4.6vw, 3.75rem), 0.9, uppercase): the line name on each line plate.
- **Terminus** (800, clamp(2rem, 6.4vw, 5.25rem), 1): the closing email, underlined in signal red.
- **Sign** (800, 1.75rem, 1, uppercase): interchange names on the interchanges board; the same voice at 17-19px names lines and interchanges on the map and sets the name plate at 1.25rem.
- **Station** (Overpass 800, 1.1875rem, 1.25, -0.01em): stop names on the strip.
- **Body** (Overpass 400, 1.0625rem, 1.6): ledes and descriptions in Platform Grey, held to 58-64ch.
- **UI** (Overpass 600, 0.9375rem, 1): navigation, key buttons, captions.
- **Label** (Overpass 700, 0.8125rem): metadata terms, table heads, the terminus sign label.
- **Code** (Martian Mono 800, 0.625-1.0625rem by badge size): three-letter line codes.
- **Board** (Martian Mono 600, 14px; 12px on phones): split-flap tiles.
- **Annotation** (Martian Mono 700, 0.6875rem, 0.12em, uppercase): the board head; map zone names use the same face at 11px, 0.04em.

### Named Rules
**The Signage Name Rule.** Names of places (the person, lines, interchanges, sections) are Big Shoulders, uppercase, 800-900. Descriptions are Overpass 400-600 in grey. A name is never set light or in sentence case.

**The Data Mono Rule.** Martian Mono is for codes, the board and map annotation. Never prose, never headings. Dates in prose use Overpass with tabular figures.

## Layout

A single page on a centred 1440px column with a fluid gutter (clamp(16px, 4vw, 40px)). The hero is a two-column grid, intro left and departure board right, with the map spanning full width below; at 1080px the board drops under the intro, and at 720px phones lead with the intro, then the vertical map, then the board. The map is authored once in horizontal map units; the phone map is the same network turned a quarter at one uniform scale (0.625), so every 45° move stays 45°.

Line sections use a 5:7 grid (plate left, strip right, 48px column gap) with the plate sticky at 84px; under 900px they stack and the plate unsticks. Sections are separated by clamp(64px, 10vw, 128px), line sections pad clamp(48px, 7vw, 88px), stops on the strip sit 30px apart. The signage bar is 52px and sticky; anchors scroll with 72px padding.

### Named Rules
**The 90/45 Rule.** Tracks move horizontally, vertically or at 45°. No curves and no other angles; corners are round-joined, never radiused.

## Elevation & Depth

Flat. Depth is tonal: page ground, a slightly lighter zone band, a pure-black panel, and hairline borders. The only shadow is a zero-blur casing: the large line badge carries a 4px ring of map stock where it sits on its bar, the same casing the strip train and interchange capsules get from their ground-coloured strokes. The signage bar is the one translucent surface (panel at 88% over a 10px blur), so the map reads through it as it scrolls past.

### Shadow Vocabulary
- **Badge casing** (`box-shadow: 0 0 0 4px var(--ground)`): cuts the large line badge out of its line bar.

### Named Rules
**The Casing Rule.** Anything that sits on a track is cased in map stock, not lifted. A shadow with blur or offset is out of world.

## Shapes

Track geometry is rectangular: 10px strokes with round joins, 6px station ticks, 6×30 terminus bars. Everything a passenger reads as a sign is a pill or a soft plate: line badges and board codes are full pills (9, 11, 12 or 20px radius by height), key buttons are 40px-tall pills, interchanges are capsules with a 4px white ring, the strip train is a 14×26 pill, the typing cursor a 0.55em block. Plates and panels are barely rounded: tiles 2px, name plate 3px, terminus sign 4px, board and screenshots 6px.

## Components

### Signage Bar
- **Style:** sticky, 52px, panel black at 88% with blur and a hairline bottom. Name plate at left; nav at right in UI type, Platform Grey.
- **States:** hover lifts the link to Lamp White with a 3px white underline bar. Under 560px only Lines and Contact remain.

### Name Plate
White plate, black Big Shoulders 800 uppercase, 3px radius: the station sign for the person, linking back to the map.

### Terminus Sign (primary action)
- **Shape:** gently rounded white plate (4px).
- **Content:** "Email me" in Label type over the address in Overpass 800, the address underlined 3px in signal red.
- **Hover / Active:** rises 2px over 200ms, returns on press. Focus is the global 3px white outline.

### Key Buttons (map key)
- **Style:** 40px pills, hairline outline, transparent, UI type. Line buttons carry a 22×8 swatch in the line colour; interchange buttons carry an inline SVG capsule glyph.
- **States:** hover strengthens the outline to Timetable Grey; a mouse hover previews the isolation; pressing locks it and inverts the pill to white with black text; pressing again clears it.

### Line Badge
Pill in the line colour with the three-letter code in Martian Mono 800, Badge Ink. Three sizes: sm (18px, inline in "Change for"), md (24px, interchanges board), lg (40px, cased, on the line plate).

### Departure Board (signature)
A black 6px panel with a hairline border: a mono annotation head ("Departures", the month), then rows of a line-code pill, a 14-tile destination and an 8-tile status. Tiles are 19×27, Flap grey, with a 1px black split across the middle. The NXT row is set in signal red. On phones the tile width is computed from the viewport so a row always fits, and each row stacks status under destination.

### Network Map (signature)
Two SVGs (horizontal, vertical) of the same network: alternating zone bands, the construction grid, 10px line strokes, ticks and two-row labels, badges and names that link to each line's section, white-ringed interchange capsules and a dashed signal-red extension to "Next stop: your team". Isolation (from the key) swaps unlit strokes, ticks and badges to Out of Service, unlit labels to Out of Service Text, and takes unlit capsules and the extension to 30% opacity, all over 300ms; the isolated line redraws its stroke. A live caption under the key names the focus and links to the line.

### Line Plate and Strip (signature)
The plate is a 10px line-coloured bar ending in a 7×30 terminus, with the large badge riding on it, then the line name, role in the line colour, a ruled metadata list and summary. The strip is a 10px rail with stops: ticks for stations, a 30px white-ringed circle for interchanges, a bar for the terminus, each with a heavy stop name, "Change for" badges and grey detail.

### Interchanges Board
A full-width ruled table: interchange name in Sign type, its line badges, and a note. On phones each row becomes a stacked block.

### End of the Line
A built white track runs into a dashed red planned track ending in a red terminus bar, over the closing headline and the email in Terminus type.

### Motion Grammar
All motion runs on one easing (cubic-bezier(0.16, 1, 0.3, 1)) and one sequence:
1. Text types itself like a terminal, with a blinking block cursor: the name at 75ms a character from 250ms, then the lede at 14ms a character; the cursor stays blinking at the end of the lede like a prompt. The actions fade in at 1.2s. Section headings type when they scroll into view (55–60ms a character); the closing "Next stop: your team" keeps its cursor. Untyped characters are kept in place but transparent, so nothing reflows; screen readers get the full text at once.
2. The board flaps: every tile spins forward through the flap drum at 45ms a frame and settles on its letter, rows top to bottom. After 3s the NXT status blinks on a 1.6s stepped cycle.
3. The strokes draw along their paths (1100ms, staggered 140ms per line from 500ms); ticks, labels and badges fade in after their line, interchanges at 1500ms, the extension at 1900ms.
4. The network map has no moving vehicles (user decision, 2026-10-06): once drawn, it is still apart from the marching extension.
5. The red extension and the planned end track march their dashes toward the next stop (900ms, linear, forever).
6. In each line section, a train rides the strip with the reader's scroll: the rail fills in the line colour to a point 55% down the viewport, and stops brighten from Out of Service as the train passes them.

Hover and state changes take 160ms (links, key buttons, nav), 200ms (terminus sign) or 300ms (map isolation, strip stops).

**The Timetable Rule.** Motion follows the order above and nothing bounces: no springs, no overshoot, no parallax, no motion that is not typing, a flap, a stroke, a dash or the strip train.

**The Finished Map Rule.** Under reduced motion every animation is gated off: text renders fully typed with no cursor, the map renders fully drawn with still dashes, the board renders settled with no blink, and every strip renders fully ridden with no strip train. Without JavaScript the same finished state shows.

## Do's and Don'ts

### Do:
- **Do** give every new body of work its own flat line colour, code and badge, and draw it on the 90/45 grid.
- **Do** keep signal red for the next stop: contact, the "your team" extension, and the NXT row.
- **Do** set names of places in Big Shoulders uppercase at 800-900 and descriptions in Overpass grey.
- **Do** case anything on a track in map stock (`0 0 0 4px var(--ground)` or a 3px ground stroke).
- **Do** gate every new animation behind `prefers-reduced-motion: no-preference` and give it a finished static state.
- **Do** isolate by swapping to the out-of-service greys, not by blurring.

### Don't:
- **Don't** use gradients, glow, or shadows with blur or offset.
- **Don't** use a line colour for anything but its own line.
- **Don't** add curves or angles other than 90° and 45° to the network.
- **Don't** set prose or headings in Martian Mono.
- **Don't** add bouncing, springy or overshooting motion.
- **Don't** fall back to a dark hero, card grid or skills-badge wall; the map and the board carry the work.
