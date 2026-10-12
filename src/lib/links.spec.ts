import { describe, expect, it, vi } from 'vitest';
import { linkChecker } from './links';

/** A stand-in for fetch: each URL answers with the status and final URL given. */
const fakeFetch = (
  pages: Record<string, { ok: boolean; url?: string } | Error>
) =>
  vi.fn((url: string) => {
    const page = pages[url];
    if (page === undefined || page instanceof Error)
      return Promise.reject(page ?? new Error(`unexpected ${url}`));
    return Promise.resolve({ ok: page.ok, url: page.url ?? url });
  });

describe('linkChecker', () => {
  it('keeps the links that open and drops the ones that fail', async () => {
    const check = linkChecker(
      fakeFetch({
        'https://up.example/': { ok: true },
        'https://broken.example/': { ok: false },
        'https://down.example/': new Error('ECONNREFUSED'),
      })
    );
    const live = await check([
      'https://up.example/',
      'https://broken.example/',
      'https://down.example/',
    ]);
    expect([...live]).toStrictEqual(['https://up.example/']);
  });

  it('drops a deployment that redirects to the Vercel login', async () => {
    const check = linkChecker(
      fakeFetch({
        'https://preview.vercel.app/': {
          ok: true,
          url: 'https://vercel.com/login?next=%2Fsso-api',
        },
      })
    );
    const live = await check(['https://preview.vercel.app/']);
    expect(live.size).toBe(0);
  });

  it('opens each URL once, however often it is asked about', async () => {
    const fetchPage = fakeFetch({ 'https://up.example/': { ok: true } });
    const check = linkChecker(fetchPage);
    await check(['https://up.example/', 'https://up.example/']);
    await check(['https://up.example/']);
    expect(fetchPage).toHaveBeenCalledOnce();
  });
});
