// Live-site links are checked when the site is built: a link only ships if a
// visitor can actually open it. Broken links and deployments behind a login
// (Vercel Deployment Protection redirects to vercel.com/login) are left out.

const cache = new Map<string, Promise<boolean>>();

async function check(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10000) });
    if (!res.ok) return false;
    const host = new URL(res.url).hostname;
    return host !== "vercel.com" && !host.endsWith(".vercel.com");
  } catch {
    return false;
  }
}

export function isPublic(url: string): Promise<boolean> {
  let pending = cache.get(url);
  if (!pending) {
    pending = check(url);
    cache.set(url, pending);
  }
  return pending;
}

/** The subset of `urls` a visitor can open right now. */
export async function publicLinks(urls: string[]): Promise<Set<string>> {
  const unique = [...new Set(urls)];
  const results = await Promise.all(unique.map(isPublic));
  return new Set(unique.filter((_, i) => results[i]));
}
