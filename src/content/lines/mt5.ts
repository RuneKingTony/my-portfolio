import { COL } from '../map';
import type { Line } from '../types';

export const mt5: Line = {
  id: 'mt5',
  code: 'MT5',
  name: 'Algo Script',
  role: 'Side project',
  color: 'var(--l-mt5)',
  ink: 'var(--l-mt5-ink)',
  y: 640,
  period: 'Aug 2026',
  stack: ['MQL5', 'MetaTrader 5'],
  service: {
    title: 'A gold trading bot, rebuilt around risk',
    status: 'side',
    since: '2026-08',
    bullets: [
      'Found why the bot kept losing the account: every trade was far too big.',
      'Rebuilt trade sizing around the account balance and recent losses.',
      'In testing, it went from losing the account in under a month to finishing intact.',
    ],
  },
  summary:
    "A trading bot for gold on MetaTrader 5. The hard part wasn't the strategy. It was working out why test runs kept wiping out the account, and fixing it.",
  stations: [
    {
      x: COL.data,
      label: 'Read the\nlogs',
      detail:
        'I went through the test logs, which showed the real problem: every trade was risking about a third of the account.',
    },
    {
      x: COL.node,
      label: 'Risk-based\nsizing',
      detail:
        'Trade size now depends on the account balance and how far away the stop-loss is, instead of a fixed amount.',
    },
    {
      x: COL.server2,
      label: 'Drawdown\nscaling',
      detail:
        'When the account drops, trades get smaller, and they grow back as it recovers.',
    },
    {
      x: COL.shared2,
      label: 'Skips risky\ntrades',
      detail:
        'If even the smallest possible trade is too risky, the bot sits it out.',
    },
    {
      x: COL.next,
      label: 'Survives\ntesting',
      terminus: true,
      detail:
        'Tested over January to August 2026, the account went from wiped out in under a month to finishing intact. That shows it survives, not that it makes money.',
    },
  ],
};
