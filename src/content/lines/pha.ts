import { COL } from '../map';
import type { Line } from '../types';

export const pha: Line = {
  id: 'pha',
  code: 'PHA',
  name: 'Pharma-AID',
  role: 'Website, 2023',
  color: 'var(--l-pha)',
  ink: 'var(--l-pha-ink)',
  y: 430,
  period: '2023',
  stack: ['React', 'Create React App', 'Tailwind', 'Radix', 'react-spring'],
  summary:
    "A website I built in 2023 for Pharma-AID Africa: one page that tells the organisation's story, with a photo gallery.",
  service: {
    title: 'Website for Pharma-AID Africa',
    status: 'shipped',
    since: '2023-06',
    bullets: [
      'Built the whole site in React and Tailwind.',
      'Added a photo gallery and scroll animations.',
      'Still live today.',
    ],
  },
  stations: [
    {
      x: COL.react,
      label: 'React',
      interchange: 'react',
      detail: 'Built in React with Tailwind.',
    },
    {
      x: 1060,
      label: 'Photo\ngallery',
      detail: "A sliding gallery of the organisation's work.",
    },
    {
      x: 1140,
      label: 'Animated\nsections',
      detail: 'Sections that animate in as you scroll.',
    },
    {
      x: 1220,
      label: 'Live\nsite',
      name: 'Pharma-AID Africa',
      terminus: true,
      detail: 'Still online today.',
      links: [
        {
          label: 'Pharma-AID live site',
          href: 'https://pharmacy-swart-three.vercel.app/',
        },
      ],
    },
  ],
};
