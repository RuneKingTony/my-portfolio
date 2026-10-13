import { COL } from '../map';
import type { Line } from '../types';

export const ecm: Line = {
  id: 'ecm',
  code: 'ECM',
  name: 'E-commerce',
  role: 'Frontend engineer',
  color: 'var(--l-ecm)',
  ink: 'var(--l-ecm-ink)',
  y: 500,
  period: 'Aug 2023 → Aug 2024',
  stack: ['React', 'Context API', 'REST APIs', 'Figma'],
  summary:
    'A year as a frontend engineer at a food delivery e-commerce company. I worked on the apps behind it: the website, the app customers order from, the admin app the team watches orders on, and the shared components behind all three.',
  service: {
    title: 'Frontend engineer at a food delivery e-commerce company',
    status: 'ended',
    since: '2023-08',
    bullets: [
      'Built a component library the whole frontend team adopted.',
      'Worked on the website, the ordering app and the admin app.',
      'Built live order tracking with the backend team.',
      "Turned the designers' Figma files into accessible, mobile-friendly screens.",
    ],
  },
  stations: [
    {
      x: COL.shared1,
      label: 'Component\nlibrary',
      detail:
        'Shared React components used by all three apps. The whole team adopted it.',
    },
    {
      x: COL.react,
      label: 'React',
      interchange: 'react',
      detail:
        "All three apps are React, built from the designers' Figma files.",
    },
    {
      x: COL.screen1,
      label: 'Website',
      detail: 'The public website.',
    },
    {
      x: COL.screen2,
      label: 'Ordering\nweb app',
      detail:
        'Where customers order food and follow their delivery live. I built the live tracking with the backend team.',
    },
    {
      x: COL.screen3,
      label: 'Admin\napp',
      terminus: true,
      detail:
        'Where the team keeps an eye on orders and deliveries as they happen.',
    },
  ],
};
