// Live-site links are checked when the site is built: a link only ships if a
// visitor can actually open it. Broken links and deployments behind a login
// (Vercel Deployment Protection redirects to vercel.com/login) are left out.

/** The part of `fetch` the check uses, so tests can stand in for the network. */
type Fetch = (
  url: string,
  init: RequestInit
) => Promise<Pick<Response, 'ok' | 'url'>>;

/** Whether a response is a page a visitor can see, not an error or a login wall. */
async function opens(fetchPage: Fetch, url: string): Promise<boolean> {
  try {
    const res = await fetchPage(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const host = new URL(res.url).hostname;
    return host !== 'vercel.com' && !host.endsWith('.vercel.com');
  } catch {
    return false;
  }
}

/** A checker that opens each URL once, however many times it is asked about it. */
export function linkChecker(
  fetchPage: Fetch = fetch
): (urls: string[]) => Promise<Set<string>> {
  const cache = new Map<string, Promise<boolean>>();
  const isPublic = (url: string) => {
    let pending = cache.get(url);
    if (!pending) {
      pending = opens(fetchPage, url);
      cache.set(url, pending);
    }
    return pending;
  };
  return async (urls) => {
    const unique = [...new Set(urls)];
    const results = await Promise.all(unique.map((url) => isPublic(url)));
    return new Set(unique.filter((_, i) => results[i] === true));
  };
}

/** The subset of `urls` a visitor can open right now. */
export const publicLinks = linkChecker();
