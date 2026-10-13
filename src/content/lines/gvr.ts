import { COL } from '../map';
import type { Line } from '../types';

export const gvr: Line = {
  id: 'gvr',
  code: 'GVR',
  name: 'GVR Labs',
  role: 'Studio I co-run',
  color: 'var(--l-gvr)',
  ink: 'var(--l-gvr-ink)',
  y: 120,
  route: [
    [850, 66],
    [880, 66],
    [934, 120],
    [1180, 120],
  ],
  period: 'Oct 2025 → now',
  stack: ['React 19', 'Next.js 16', 'Vite', 'Tailwind v4'],
  summary:
    'GVR Labs is a small software studio I co-run. We build websites and software for clients. These are some of them.',
  stations: [
    {
      x: COL.react,
      label: 'React',
      interchange: 'react',
      detail: 'Our client sites are built in React.',
    },
    {
      x: COL.next,
      label: 'Next.js',
      interchange: 'next',
      links: [
        {
          label: 'GVR Labs live site',
          href: 'https://gvrsolutions.vercel.app/',
        },
      ],
      detail:
        "The studio's own website, built with the team. As you scroll, it plays real screenshots of our work.",
    },
    {
      x: COL.screen1,
      label: 'Client\nsites',
      terminus: true,
      detail:
        "Websites for MBAS Investment, Valdin Energy and Amara Kharis. Many of MBAS's readers are older, so I kept the text large, the buttons big and the motion slow.",
      links: [
        {
          label: 'MBAS Investment live site',
          href: 'https://mbs-investment-git-main-anthonynkwa92gmailcoms-projects.vercel.app/',
        },
        { label: 'Amara Kharis live site', href: 'https://mrsdeb.vercel.app/' },
      ],
    },
  ],
  service: {
    title: 'Co-running a software studio',
    status: 'running',
    since: '2025-10',
    bullets: [
      'Client websites for MBAS Investment, Valdin Energy and Amara Kharis.',
      'Built the MBAS site for older readers: large text, big buttons, slow motion.',
      "Helped build the studio's own website.",
    ],
  },
  shots: [
    {
      src: '/work/mbas.webp',
      alt: 'MBAS Investment homepage',
      caption: 'MBAS Investment',
    },
    {
      src: '/work/valdin-energy.webp',
      alt: 'Valdin Energy homepage',
      caption: 'Valdin Energy',
    },
    {
      src: '/work/amara-kharis.webp',
      alt: 'Amara Kharis homepage',
      caption: 'Amara Kharis',
    },
  ],
};
