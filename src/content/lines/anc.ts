import { COL } from '../map';
import type { Line } from '../types';

export const anc: Line = {
  id: 'anc',
  code: 'ANC',
  name: 'Anchor Fit',
  role: 'Online store I built',
  color: 'var(--l-anc)',
  ink: 'var(--l-anc-ink)',
  y: 360,
  route: [
    [180, 360],
    [1220, 360],
    [1260, 400],
    [1300, 400],
  ],
  period: 'Jul 2025 → now',
  stack: [
    'Express',
    'Drizzle',
    'Neon Postgres',
    'Paystack',
    'React',
    'Vite',
    'Tailwind',
  ],
  service: {
    title: 'Online store for a gym-wear brand',
    status: 'running',
    since: '2025-07',
    bullets: [
      'Built the store, the Paystack checkout and the admin.',
      'Moved all pricing to the server, so customers always pay what they see.',
      'Orders are only marked paid once Paystack confirms the right amount.',
    ],
  },
  summary:
    'The online store for Anchor Fit, a Nigerian gym-wear brand. Customers pick a tee, a colour and a size, and pay with Paystack. I built the store, the checkout and the admin.',
  stations: [
    {
      x: COL.data,
      label: 'PostgreSQL',
      interchange: 'postgres',
      name: 'The database',
      detail: 'Orders, customers and discount codes.',
    },
    {
      x: COL.schema,
      label: 'Typed\nschema',
      name: 'Typed database schema',
      detail:
        'A typed database schema, so the code and the database always match.',
    },
    {
      x: COL.node,
      label: 'Node.js',
      interchange: 'node',
      name: 'The server',
      detail: 'The server behind the store.',
    },
    {
      x: COL.server1,
      label: 'Server\npricing',
      name: 'Prices set by the server',
      detail:
        'Prices are worked out on the server, never in the browser, so the price a customer sees is the price they pay.',
    },
    {
      x: COL.server2,
      label: 'Payment\nchecks',
      detail:
        'An order is only marked paid once Paystack confirms the payment and the amount matches.',
    },
    {
      x: COL.shared1,
      label: 'Product\ncatalogue',
      detail:
        'Products, prices and discounts are defined once and used by both the store and the server.',
    },
    {
      x: COL.react,
      label: 'React',
      interchange: 'react',
      name: 'React',
      detail: 'The store itself, in React and Tailwind.',
    },
    {
      x: COL.screen1,
      label: 'Admin',
      detail: 'Orders, discount codes and product edits.',
    },
    {
      x: 1300,
      y: 400,
      label: 'Storefront',
      terminus: true,
      detail:
        'Built for phones first, since most customers come from Instagram.',
      links: [
        {
          label: 'Anchor Fit live store',
          href: 'https://anchorfit-1.onrender.com/',
        },
      ],
    },
  ],
  shots: [
    {
      src: '/work/anchorfit-revamp.webp',
      alt: 'Anchor Fit storefront homepage',
      caption: 'Anchor Fit storefront',
    },
  ],
};
