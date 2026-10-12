import { COL } from '../map';
import type { Line } from '../types';

export const fin: Line = {
  id: 'fin',
  code: 'FIN',
  name: 'Fintech',
  role: 'Software engineer',
  color: 'var(--l-fin)',
  ink: 'var(--l-fin-ink)',
  y: 200,
  route: [
    [410, 200],
    [1300, 200],
    [1340, 160],
    [1380, 160],
  ],
  period: 'Aug 2024 → Aug 2026',
  stack: ['TypeScript', 'React', 'Next.js', 'Vite', 'Node.js'],
  service: {
    title: 'Software engineer at a lending fintech',
    status: 'ended',
    since: '2024-08',
    bullets: [
      'Worked across the admin dashboard, the customer apps and the marketing site.',
      'Spent most of my time on the dashboard staff use to manage customers, ID checks, loans and repayments.',
      'Looked after the shared business rules and components every app uses.',
      'Fixes and new features in the backend services.',
    ],
  },
  summary:
    'For two years I worked on the web platform of a Nigerian lending company: the dashboard staff use to run it, the apps customers apply through, the marketing site, and the shared code underneath.',
  stations: [
    {
      x: COL.node,
      label: 'Node.js',
      name: 'Backend services',
      interchange: 'node',
      detail:
        'Backend work in the Node.js services, including the next-of-kin feature for loan applicants.',
    },
    {
      x: COL.shared1,
      label: 'Business\nrules',
      name: 'Shared business rules',
      detail:
        'One shared package of business rules, so every app follows the same rules.',
    },
    {
      x: COL.shared2,
      label: 'Component\nlibrary',
      detail: 'Shared React components, with accessibility checks built in.',
    },
    {
      x: COL.react,
      label: 'React',
      interchange: 'react',
      name: 'React',
      detail: 'Every app here is React and TypeScript.',
    },
    {
      x: COL.next,
      label: 'Next.js',
      interchange: 'next',
      name: 'Next.js',
      detail: 'The customer-facing apps run on Next.js.',
    },
    {
      x: COL.screen1,
      label: 'Admin\ndashboard',
      detail:
        'Where staff manage customers, ID checks, loans and repayments. Most of my time went here.',
    },
    {
      x: COL.screen2,
      label: 'Customer\napps',
      detail: 'Where customers apply for financing and keep track of it.',
    },
    {
      x: COL.screen3,
      y: 160,
      label: 'Marketing\nsite',
      terminus: true,
      detail: 'The public website.',
    },
  ],
};
