// The network: every line is a body of work, every station a real component
// of it, every interchange a technology those lines actually share.

import { COL, type MapPoint } from "./map";

export type LineId = "gvr" | "fin" | "edu" | "anc" | "pha" | "ecm" | "mt5";
export type InterchangeId = "postgres" | "node" | "react" | "next";

export interface Station {
  /** Map x position; stations on an interchange take its x. */
  x: number;
  /** Map y position when the station sits off the line's main row (after a bend). */
  y?: number;
  /** Name on the map. Use "\n" to break a label across two lines. */
  label: string;
  /** Full name in the line section, when it differs from the map label. */
  name?: string;
  detail: string;
  interchange?: InterchangeId;
  terminus?: boolean;
  /** Live sites for this stop. Each ships only if the build can open it (see lib/links.ts). */
  links?: { label: string; href: string }[];
}

export interface Shot {
  src: string;
  alt: string;
  caption: string;
}

export interface Service {
  /** What the work was, in a few words. Titles are descriptive, not employer job titles. */
  title: string;
  status: "running" | "ended" | "shipped" | "side";
  /** Start date for ordering, YYYY-MM. */
  since: string;
  bullets: string[];
}

export interface Line {
  id: LineId;
  code: string;
  name: string;
  role: string;
  color: string;
  /** Text colour that passes contrast on the line colour. */
  ink: string;
  /** Map y position of the line's main row. */
  y: number;
  /** Track as map points, 90° and 45° moves only. Defaults to a straight run along y. */
  route?: MapPoint[];
  period: string;
  stack: string[];
  summary: string;
  stations: Station[];
  shots?: Shot[];
  service: Service;
}

export interface Interchange {
  id: InterchangeId;
  name: string;
  x: number;
  lines: LineId[];
  note: string;
}

export const interchanges: Interchange[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    x: COL.data,
    lines: ["edu", "anc"],
    note: "EduVault and Anchor Fit both store their data in PostgreSQL.",
  },
  {
    id: "node",
    name: "Node.js",
    x: COL.node,
    lines: ["fin", "edu", "anc"],
    note: "The fintech's backend and the servers behind EduVault and Anchor Fit all run on Node.js.",
  },
  {
    id: "react",
    name: "React",
    x: COL.react,
    lines: ["gvr", "fin", "edu", "anc", "pha", "ecm"],
    note: "Every web project here is built with React.",
  },
  {
    id: "next",
    name: "Next.js",
    x: COL.next,
    lines: ["gvr", "fin"],
    note: "The fintech's customer apps and the GVR Labs site use Next.js.",
  },
];

export const lines: Line[] = [
  {
    id: "gvr",
    code: "GVR",
    name: "GVR Labs",
    role: "Studio I co-run",
    color: "var(--l-gvr)",
    ink: "var(--l-gvr-ink)",
    y: 120,
    route: [
      [850, 66],
      [880, 66],
      [934, 120],
      [1180, 120],
    ],
    period: "Oct 2025 → now",
    stack: ["React 19", "Next.js 16", "Vite", "Tailwind v4"],
    summary:
      "GVR Labs is a small software studio I co-run. We build websites and software for clients. These are some of them.",
    stations: [
      {
        x: COL.react,
        label: "React",
        interchange: "react",
        detail: "Our client sites are built in React.",
      },
      {
        x: COL.next,
        label: "Next.js",
        interchange: "next",
        links: [{ label: "GVR Labs live site", href: "https://gvrsolutions.vercel.app/" }],
        detail:
          "The studio's own website, built with the team. As you scroll, it plays real screenshots of our work.",
      },
      {
        x: COL.screen1,
        label: "Client\nsites",
        terminus: true,
        detail:
          "Websites for MBAS Investment, Valdin Energy and Amara Kharis. Many of MBAS's readers are older, so I kept the text large, the buttons big and the motion slow.",
        links: [
          { label: "MBAS Investment live site", href: "https://mbs-investment-git-main-anthonynkwa92gmailcoms-projects.vercel.app/" },
          { label: "Amara Kharis live site", href: "https://mrsdeb.vercel.app/" },
        ],
      },
    ],
    service: {
      title: "Co-running a software studio",
      status: "running",
      since: "2025-10",
      bullets: [
        "Client websites for MBAS Investment, Valdin Energy and Amara Kharis.",
        "Built the MBAS site for older readers: large text, big buttons, slow motion.",
        "Helped build the studio's own website.",
      ],
    },
    shots: [
      { src: "/work/mbas.webp", alt: "MBAS Investment homepage", caption: "MBAS Investment" },
      { src: "/work/valdin-energy.webp", alt: "Valdin Energy homepage", caption: "Valdin Energy" },
      { src: "/work/amara-kharis.webp", alt: "Amara Kharis homepage", caption: "Amara Kharis" },
    ],
  },
  {
    id: "fin",
    code: "FIN",
    name: "Fintech",
    role: "Software engineer",
    color: "var(--l-fin)",
    ink: "var(--l-fin-ink)",
    y: 200,
    route: [
      [410, 200],
      [1300, 200],
      [1340, 160],
      [1380, 160],
    ],
    period: "Aug 2024 → Aug 2026",
    stack: ["TypeScript", "React", "Next.js", "Vite", "Node.js"],
    service: {
      title: "Software engineer at a lending fintech",
      status: "ended",
      since: "2024-08",
      bullets: [
        "Worked across the admin dashboard, the customer apps and the marketing site.",
        "Spent most of my time on the dashboard staff use to manage customers, ID checks, loans and repayments.",
        "Looked after the shared business rules and components every app uses.",
        "Fixes and new features in the backend services.",
      ],
    },
    summary:
      "For two years I worked on the web platform of a Nigerian lending company: the dashboard staff use to run it, the apps customers apply through, the marketing site, and the shared code underneath.",
    stations: [
      {
        x: COL.node,
        label: "Node.js",
        name: "Backend services",
        interchange: "node",
        detail: "Backend work in the Node.js services, including the next-of-kin feature for loan applicants.",
      },
      {
        x: COL.shared1,
        label: "Business\nrules",
        name: "Shared business rules",
        detail:
          "One shared package of business rules, so every app follows the same rules.",
      },
      {
        x: COL.shared2,
        label: "Component\nlibrary",
        detail:
          "Shared React components, with accessibility checks built in.",
      },
      {
        x: COL.react,
        label: "React",
        interchange: "react",
        name: "React",
        detail: "Every app here is React and TypeScript.",
      },
      {
        x: COL.next,
        label: "Next.js",
        interchange: "next",
        name: "Next.js",
        detail: "The customer-facing apps run on Next.js.",
      },
      {
        x: COL.screen1,
        label: "Admin\ndashboard",
        detail:
          "Where staff manage customers, ID checks, loans and repayments. Most of my time went here.",
      },
      {
        x: COL.screen2,
        label: "Customer\napps",
        detail: "Where customers apply for financing and keep track of it.",
      },
      {
        x: COL.screen3,
        y: 160,
        label: "Marketing\nsite",
        terminus: true,
        detail: "The public website.",
      },
    ],
  },
  {
    id: "edu",
    code: "EDU",
    name: "EduVault",
    role: "My own product",
    color: "var(--l-edu)",
    ink: "var(--l-edu-ink)",
    y: 280,
    period: "Jan 2026 → now",
    stack: ["Express 5", "Sequelize", "PostgreSQL", "zod", "React", "Vite", "pnpm", "Docker"],
    service: {
      title: "School management software I designed and built",
      status: "running",
      since: "2026-01",
      bullets: [
        "Designed and built all of it: the API, the admin app, the parent portal and the shared code between them.",
        "Made sure each school only sees its own data.",
        "Built the wallet so money is never counted twice, even when a request is retried.",
      ],
    },
    summary:
      "A school management system I designed and built. Many schools run on one copy of it, and each one only sees its own data. It handles enrolment, results, fees and expenses, plus a prepaid wallet parents top up from a portal.",
    stations: [
      {
        x: COL.data,
        label: "PostgreSQL",
        interchange: "postgres",
        name: "PostgreSQL",
        detail: "One database for every school, with every record tagged to the school it belongs to.",
      },
      {
        x: COL.schema,
        label: "Migrations",
        name: "Database changes",
        detail:
          "Database changes go through versioned migrations, never by hand.",
      },
      {
        x: COL.node,
        label: "Node.js",
        interchange: "node",
        name: "The API",
        detail: "The API behind both apps.",
      },
      {
        x: COL.server1,
        label: "Data\nseparation",
        name: "Keeping schools separate",
        detail:
          "Each school only sees its own data. Where that wasn't yet true, I fixed it.",
      },
      {
        x: COL.server2,
        label: "Wallet",
        name: "The wallet",
        detail:
          "Every payment, refund and purchase is saved all at once or not at all, so a retried request can never count money twice.",
      },
      {
        x: COL.shared1,
        label: "Shared\nvalidation",
        detail:
          "One set of validation rules shared by the API and both apps, so they always agree on what valid data looks like.",
      },
      {
        x: COL.shared2,
        label: "Design\nsystem",
        name: "Shared design",
        detail: "One set of components and styles used by both apps.",
      },
      {
        x: COL.react,
        label: "React",
        interchange: "react",
        name: "React",
        detail: "Both apps are React and TypeScript.",
      },
      {
        x: COL.screen1,
        label: "Admin\napp",
        detail:
          "Where schools run classes, results, fees and staff. Each person only sees what their role needs.",
      },
      {
        x: COL.screen2,
        label: "Parent\nportal",
        terminus: true,
        detail:
          "Parents check results and top up the wallet. Every payment is confirmed with the payment provider before the money shows up.",
      },
    ],
  },
  {
    id: "anc",
    code: "ANC",
    name: "Anchor Fit",
    role: "Online store I built",
    color: "var(--l-anc)",
    ink: "var(--l-anc-ink)",
    y: 360,
    route: [
      [180, 360],
      [1220, 360],
      [1260, 400],
      [1300, 400],
    ],
    period: "Jul 2025 → now",
    stack: ["Express", "Drizzle", "Neon Postgres", "Paystack", "React", "Vite", "Tailwind"],
    service: {
      title: "Online store for a gym-wear brand",
      status: "running",
      since: "2025-07",
      bullets: [
        "Built the store, the Paystack checkout and the admin.",
        "Moved all pricing to the server, so customers always pay what they see.",
        "Orders are only marked paid once Paystack confirms the right amount.",
      ],
    },
    summary:
      "The online store for Anchor Fit, a Nigerian gym-wear brand. Customers pick a tee, a colour and a size, and pay with Paystack. I built the store, the checkout and the admin.",
    stations: [
      {
        x: COL.data,
        label: "PostgreSQL",
        interchange: "postgres",
        name: "The database",
        detail: "Orders, customers and discount codes.",
      },
      {
        x: COL.schema,
        label: "Typed\nschema",
        name: "Typed database schema",
        detail: "A typed database schema, so the code and the database always match.",
      },
      {
        x: COL.node,
        label: "Node.js",
        interchange: "node",
        name: "The server",
        detail: "The server behind the store.",
      },
      {
        x: COL.server1,
        label: "Server\npricing",
        name: "Prices set by the server",
        detail:
          "Prices are worked out on the server, never in the browser, so the price a customer sees is the price they pay.",
      },
      {
        x: COL.server2,
        label: "Payment\nchecks",
        detail:
          "An order is only marked paid once Paystack confirms the payment and the amount matches.",
      },
      {
        x: COL.shared1,
        label: "Product\ncatalogue",
        detail:
          "Products, prices and discounts are defined once and used by both the store and the server.",
      },
      {
        x: COL.react,
        label: "React",
        interchange: "react",
        name: "React",
        detail: "The store itself, in React and Tailwind.",
      },
      {
        x: COL.screen1,
        label: "Admin",
        detail: "Orders, discount codes and product edits.",
      },
      {
        x: 1300,
        y: 400,
        label: "Storefront",
        terminus: true,
        detail: "Built for phones first, since most customers come from Instagram.",
        links: [{ label: "Anchor Fit live store", href: "https://anchorfit-1.onrender.com/" }],
      },
    ],
    shots: [
      { src: "/work/anchorfit-revamp.webp", alt: "Anchor Fit storefront homepage", caption: "Anchor Fit storefront" },
    ],
  },
  {
    id: "pha",
    code: "PHA",
    name: "Pharma-AID",
    role: "Website, 2023",
    color: "var(--l-pha)",
    ink: "var(--l-pha-ink)",
    y: 430,
    period: "2023",
    stack: ["React", "Create React App", "Tailwind", "Radix", "react-spring"],
    summary:
      "A website I built in 2023 for Pharma-AID Africa: one page that tells the organisation's story, with a photo gallery.",
    service: {
      title: "Website for Pharma-AID Africa",
      status: "shipped",
      since: "2023-06",
      bullets: [
        "Built the whole site in React and Tailwind.",
        "Added a photo gallery and scroll animations.",
        "Still live today.",
      ],
    },
    stations: [
      {
        x: COL.react,
        label: "React",
        interchange: "react",
        detail: "Built in React with Tailwind.",
      },
      {
        x: 1060,
        label: "Photo\ngallery",
        detail: "A sliding gallery of the organisation's work.",
      },
      {
        x: 1140,
        label: "Animated\nsections",
        detail: "Sections that animate in as you scroll.",
      },
      {
        x: 1220,
        label: "Live\nsite",
        name: "Pharma-AID Africa",
        terminus: true,
        detail: "Still online today.",
        links: [{ label: "Pharma-AID live site", href: "https://pharmacy-swart-three.vercel.app/" }],
      },
    ],
    shots: [{ src: "/work/pharma-aid.webp", alt: "Pharma-AID Africa homepage", caption: "Pharma-AID Africa" }],
  },
  {
    id: "ecm",
    code: "ECM",
    name: "E-commerce",
    role: "Frontend engineer",
    color: "var(--l-ecm)",
    ink: "var(--l-ecm-ink)",
    y: 500,
    period: "Aug 2023 → Aug 2024",
    stack: ["React", "Context API", "REST APIs", "Figma"],
    summary:
      "A year as a frontend engineer at a food delivery e-commerce company. I worked on the apps behind it: the website, the app customers order from, the admin app the team watches orders on, and the shared components behind all three.",
    service: {
      title: "Frontend engineer at a food delivery e-commerce company",
      status: "ended",
      since: "2023-08",
      bullets: [
        "Built a component library the whole frontend team adopted.",
        "Worked on the website, the ordering app and the admin app.",
        "Built live order tracking with the backend team.",
        "Turned the designers' Figma files into accessible, mobile-friendly screens.",
      ],
    },
    stations: [
      {
        x: COL.shared1,
        label: "Component\nlibrary",
        detail:
          "Shared React components used by all three apps. The whole team adopted it.",
      },
      {
        x: COL.react,
        label: "React",
        interchange: "react",
        detail:
          "All three apps are React, built from the designers' Figma files.",
      },
      {
        x: COL.screen1,
        label: "Website",
        detail: "The public website.",
      },
      {
        x: COL.screen2,
        label: "Ordering\nweb app",
        detail:
          "Where customers order food and follow their delivery live. I built the live tracking with the backend team.",
      },
      {
        x: COL.screen3,
        label: "Admin\napp",
        terminus: true,
        detail: "Where the team keeps an eye on orders and deliveries as they happen.",
      },
    ],
  },
  {
    id: "mt5",
    code: "MT5",
    name: "Algo Script",
    role: "Side project",
    color: "var(--l-mt5)",
    ink: "var(--l-mt5-ink)",
    y: 640,
    period: "Aug 2026",
    stack: ["MQL5", "MetaTrader 5"],
    service: {
      title: "A gold trading bot, rebuilt around risk",
      status: "side",
      since: "2026-08",
      bullets: [
        "Found why the bot kept losing the account: every trade was far too big.",
        "Rebuilt trade sizing around the account balance and recent losses.",
        "In testing, it went from losing the account in under a month to finishing intact.",
      ],
    },
    summary:
      "A trading bot for gold on MetaTrader 5. The hard part wasn't the strategy. It was working out why test runs kept wiping out the account, and fixing it.",
    stations: [
      {
        x: COL.data,
        label: "Read the\nlogs",
        detail:
          "I went through the test logs, which showed the real problem: every trade was risking about a third of the account.",
      },
      {
        x: COL.node,
        label: "Risk-based\nsizing",
        detail:
          "Trade size now depends on the account balance and how far away the stop-loss is, instead of a fixed amount.",
      },
      {
        x: COL.server2,
        label: "Drawdown\nscaling",
        detail:
          "When the account drops, trades get smaller, and they grow back as it recovers.",
      },
      {
        x: COL.shared2,
        label: "Skips risky\ntrades",
        detail: "If even the smallest possible trade is too risky, the bot sits it out.",
      },
      {
        x: COL.next,
        label: "Survives\ntesting",
        terminus: true,
        detail:
          "Tested over January to August 2026, the account went from wiped out in under a month to finishing intact. That shows it survives, not that it makes money.",
      },
    ],
  },
];

/** The planned extension: drawn dashed, in signal red, because it isn't built yet. */
export const nextStop: { code: string; label: string; from: LineId; route: MapPoint[] } = {
  code: "NXT",
  label: "Next stop:\nyour team",
  /** Continues past the GVR Labs terminus; map units, 90°/45° only. */
  from: "gvr",
  route: [
    [1180, 120],
    [1240, 120],
    [1300, 60],
    [1400, 60],
  ],
};

/** Lines in the order they opened, oldest first: how the page lists them. */
export const chronological = (): Line[] => [...lines].sort((a, b) => a.service.since.localeCompare(b.service.since));


/** A period in words, for sentences: "Aug 2024 to Aug 2026". */
export const periodInWords = (line: Line): string => line.period.replace("→", "to");

/** How each status reads in prose and on the departure board. */
export const statusLabel: Record<Service["status"], { prose: string; board: string }> = {
  running: { prose: "Ongoing", board: "RUNNING" },
  ended: { prose: "Ended", board: "ENDED" },
  shipped: { prose: "Shipped", board: "SHIPPED" },
  side: { prose: "Side project", board: "TESTING" },
};

export const lineById = (id: LineId): Line => {
  const line = lines.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown line ${id}`);
  return line;
};

export const interchangeById = (id: InterchangeId): Interchange => {
  const ix = interchanges.find((i) => i.id === id);
  if (!ix) throw new Error(`Unknown interchange ${id}`);
  return ix;
};

