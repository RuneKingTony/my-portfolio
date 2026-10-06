# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router) + strict TypeScript, static export. Content lives in typed files in the repo; the Sanity CMS is dropped (user decision, 2026-10-06). Host-agnostic static output (Vercel or any static host).

## Users
Primary: engineering managers, tech leads and recruiters deciding whether Anthony Nkwa is worth an interview for a full-time product / Software engineering role. They skim fast, often on a laptop between other candidates, and look for proof of depth: real systems, real decisions, real code.
Secondary: prospective freelance clients. They get one quiet line that says Anthony takes select freelance work; GVR Labs is the agency-facing surface, so this site does not sell services.

## Product Purpose
Anthony's personal portfolio, rebuilt from a 2023 Create React App + Sanity site that no longer reflects his work. Success: a hiring reader leaves knowing what he builds, how he thinks about correctness, security and money-handling code, and how to reach him (email, GitHub).

## Positioning
A Software engineer who ships whole products end to end (schema, API, auth, payments, admin UI, client UI) and has spent two years inside a production fintech codebase. The differentiator is judgement on code where mistakes cost money: server-side pricing, tenant isolation, wallet ledgers, risk sizing.

## Operating Context
- Previous role, Software Engineer, Aug 2024 – Aug 2026 (per his resume; he no longer works there), at a Nigerian fintech (lending / financing). **Do not name the company** (user decision). Describe in general terms only: internal admin dashboard (React + TypeScript + Vite), customer-facing web apps (Next.js, a client monorepo), the marketing site, shared React component and business-logic libraries, and contributions to Node services. No screenshots, internal details, metrics or client names.
- Personal and client work, featured:
  - **EduVault**: multi-tenant school management SaaS. pnpm monorepo: Express 5 + Sequelize + PostgreSQL API, React + Vite admin SPA, parent/student portal, shared zod contracts package and a UI package. Prepaid student wallet, fees, results, roles. Ran a security audit and fixed cross-tenant data access, mass-assignment privilege escalation, CORS, rate limiting.
  - **Anchor Fit**: online store for a Nigerian gym-wear label. React + Vite + Tailwind/Radix, Express, Drizzle + Neon Postgres, Paystack checkout, server prices every order, promo codes, admin dashboard.
  - **GVR Labs**: software studio Anthony co-runs. The studio site was built as a team; client sites: MBAS Investment, Valdin Energy, Amara Kharis.
  - **A food delivery e-commerce company**: Frontend Engineer, Aug 2023 – Aug 2024 (from his resume). React component library, public website, food-ordering web app, admin app for monitoring orders, live order tracking with the backend team. **Do not name the company** (user decision, 2026-10-06), same as the fintech.
  - **Pharma-AID Africa**: a 2023 single-page React site, still live.
  - **MT5 trading bot**: MQL5 Expert Advisor for XAUUSD. Diagnosed account blow-ups from tester logs, replaced fixed lots with risk-based sizing and graduated drawdown scaling; backtests went from wiped out in weeks to surviving Jan–Aug 2026. Present as an engineering/risk story, never as a profitable trading claim.
- Contact: anthonynkwa92@gmail.com, GitHub @RuneKingTony. No contact-form backend.

## Capabilities and Constraints
- Single page with anchor sections; static, no server runtime, no client secrets.
- The old site's committed `.env` exposed a Sanity write token to the browser; the new site must ship no tokens.
- Location: not shown on the site (user: "my location doesn't really matter"). Education: B.Sc. Computer Science, Clifford University, 2018–2022 (not shown yet).
- Undecided: LinkedIn URL, CV/resume PDF.

## Brand Commitments
- Name: Anthony Nkwa (old site styled it "Nkwa Anthony .C").
- Voice: plain, specific, first person; engineering facts over adjectives.
- Dark theme, expressive type and real animation are binding (user, 2026-10-06: the light first build was "clean but boring"; visitors should be fascinated). The transit-map concept stays.

## Evidence on Hand
- No commit counts on the site (user decision): they say nothing to a reader.
- Screenshots: `../gvrsolutions/public/showcase/` (amara-kharis, anchorfit-revamp, mbas, pharma-aid, valdin-energy .webp).
- Repos on disk: `../school-management-system`, `../anchorfit`, `../gvrsolutions`, `../mbas-investment`, MT5 EA README at `../TonyFXBot_Exness_1/README.md`.
- Absent, must not be fabricated: testimonials, employer name or logo, user/revenue numbers, years-of-experience claims beyond what git shows, profitability claims for the trading bot. The old site's testimonials/brands sections are dropped.

## Product Principles
- Keep security claims modest: he is still learning it. State what the code does in plain words; don't present him as a security specialist.
1. Show the work and the reasoning: each project names the hard problem and the decision, not a tech list.
2. Truth over shine: no invented metrics, clients or praise.
3. Readable in a 30-second skim and rewarding in a five-minute read.
4. One clear ask: email Anthony.

## Accessibility & Inclusion
WCAG 2.2 AA; keyboard reachable; honors `prefers-reduced-motion`.
