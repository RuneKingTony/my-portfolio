// Map geometry, in map units (horizontal viewBox 1440 × 712). The map is not to scale.

/** A point on the map: [x, y]. */
export type MapPoint = [number, number];

/** Zones run left to right, from where data lives to the screens people use. */
export const zones = [
  { name: "Data", from: 120, to: 365, means: "Where information is stored." },
  { name: "Server", from: 365, to: 715, means: "The behind-the-scenes rules, like pricing or who can see what." },
  {
    name: "Shared code",
    from: 715,
    to: 925,
    means: "Code written once and reused across a project's apps.",
  },
  { name: "Screens", from: 925, to: 1430, means: "The apps and sites people actually use." },
] as const;

/** The map's columns: where stops sit, left to right across the zones. */
export const COL = {
  data: 200,
  schema: 310,
  node: 430,
  server1: 540,
  server2: 650,
  shared1: 770,
  shared2: 870,
  react: 980,
  next: 1080,
  screen1: 1180,
  screen2: 1280,
  screen3: 1380,
} as const;

