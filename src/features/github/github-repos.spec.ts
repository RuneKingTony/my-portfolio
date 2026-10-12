import { describe, expect, it } from 'vitest';
import { pickRepos, type RawRepo } from './github-repos';

const repo = (overrides: Partial<RawRepo> = {}): RawRepo => ({
  name: 'repo',
  description: 'A repo.',
  language: 'TypeScript',
  html_url: 'https://github.com/someone/repo',
  homepage: null,
  pushed_at: '2026-01-01T00:00:00Z',
  stargazers_count: 0,
  fork: false,
  archived: false,
  ...overrides,
});

const none = new Set<string>();

describe('pickRepos', () => {
  it('leaves out forks, archived repos and repos untouched since before October 2023', () => {
    const picked = pickRepos(
      [
        repo({ name: 'kept' }),
        repo({ name: 'fork', fork: true }),
        repo({ name: 'archived', archived: true }),
        repo({ name: 'stale', pushed_at: '2023-09-30T23:59:59Z' }),
      ],
      none
    );
    expect(picked.map((r) => r.name)).toStrictEqual(['kept']);
  });

  it('keeps GitHub’s order and shows at most six', () => {
    const raw = Array.from({ length: 8 }, (_, i) => repo({ name: `r${i}` }));
    expect(pickRepos(raw, none).map((r) => r.name)).toStrictEqual([
      'r0',
      'r1',
      'r2',
      'r3',
      'r4',
      'r5',
    ]);
  });

  it('gives repos a readable name', () => {
    const [named, slug] = pickRepos(
      [repo({ name: 'mrsdeb' }), repo({ name: 'ghost_ai-app' })],
      none
    );
    expect(named?.displayName).toBe('Amara Kharis');
    expect(slug?.displayName).toBe('ghost ai app');
  });

  it('keeps a live-site link only when the build could open it', () => {
    const [open, closed] = pickRepos(
      [
        repo({ name: 'a', homepage: 'https://a.example' }),
        repo({ name: 'b', homepage: 'https://b.example' }),
      ],
      new Set(['https://a.example'])
    );
    expect(open?.homepage).toBe('https://a.example');
    expect(closed?.homepage).toBeNull();
  });

  it('reads an empty description or language as none', () => {
    const [picked] = pickRepos([repo({ description: '', language: '' })], none);
    expect(picked?.description).toBeNull();
    expect(picked?.language).toBeNull();
  });
});
