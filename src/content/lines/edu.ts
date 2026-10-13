import { COL } from '../map';
import type { Line } from '../types';

export const edu: Line = {
  id: 'edu',
  code: 'EDU',
  name: 'EduVault',
  role: 'My own product',
  color: 'var(--l-edu)',
  ink: 'var(--l-edu-ink)',
  y: 280,
  period: 'Jan 2026 → now',
  stack: [
    'Express 5',
    'Sequelize',
    'PostgreSQL',
    'zod',
    'React',
    'Vite',
    'pnpm',
    'Docker',
  ],
  service: {
    title: 'School management software I designed and built',
    status: 'running',
    since: '2026-01',
    bullets: [
      'Designed and built all of it: the API, the admin app, the parent portal and the shared code between them.',
      'Made sure each school only sees its own data.',
      'Built the wallet so money is never counted twice, even when a request is retried.',
    ],
  },
  summary:
    'A school management system I designed and built. Many schools run on one copy of it, and each one only sees its own data. It handles enrolment, results, fees and expenses, plus a prepaid wallet parents top up from a portal.',
  stations: [
    {
      x: COL.data,
      label: 'PostgreSQL',
      interchange: 'postgres',
      name: 'PostgreSQL',
      detail:
        'One database for every school, with every record tagged to the school it belongs to.',
    },
    {
      x: COL.schema,
      label: 'Migrations',
      name: 'Database changes',
      detail:
        'Database changes go through versioned migrations, never by hand.',
    },
    {
      x: COL.node,
      label: 'Node.js',
      interchange: 'node',
      name: 'The API',
      detail: 'The API behind both apps.',
    },
    {
      x: COL.server1,
      label: 'Data\nseparation',
      name: 'Keeping schools separate',
      detail:
        "Each school only sees its own data. Where that wasn't yet true, I fixed it.",
    },
    {
      x: COL.server2,
      label: 'Wallet',
      name: 'The wallet',
      detail:
        'Every payment, refund and purchase is saved all at once or not at all, so a retried request can never count money twice.',
    },
    {
      x: COL.shared1,
      label: 'Shared\nvalidation',
      detail:
        'One set of validation rules shared by the API and both apps, so they always agree on what valid data looks like.',
    },
    {
      x: COL.shared2,
      label: 'Design\nsystem',
      name: 'Shared design',
      detail: 'One set of components and styles used by both apps.',
    },
    {
      x: COL.react,
      label: 'React',
      interchange: 'react',
      name: 'React',
      detail: 'Both apps are React and TypeScript.',
    },
    {
      x: COL.screen1,
      label: 'Admin\napp',
      detail:
        'Where schools run classes, results, fees and staff. Each person only sees what their role needs.',
    },
    {
      x: COL.screen2,
      label: 'Parent\nportal',
      terminus: true,
      detail:
        'Parents check results and top up the wallet. Every payment is confirmed with the payment provider before the money shows up.',
    },
  ],
};
