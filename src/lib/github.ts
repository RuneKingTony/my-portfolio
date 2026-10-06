// GitHub data fetched at build time (the site is a static export). The browser refreshes
// the repo list on each visit (GitHubProjects.tsx); this is what the page ships with.
// Any failure returns null, and the page falls back rather than breaking the build.

import { contact } from "@/content/contact";
import { GITHUB_API, REPOS_URL, pickRepos, type GitHubRepo, type RawRepo } from "./github-repos";
import { publicLinks } from "./links";

export type { GitHubRepo } from "./github-repos";

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number | null;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** The profile card. If GitHub can't be reached, a card built from the handle alone still links to the profile. */
export async function getProfile(): Promise<GitHubProfile> {
  const u = await getJson<{ login: string; name: string | null; avatar_url: string; html_url: string; public_repos: number }>(
    `${GITHUB_API}/users/${contact.githubHandle}`,
  );
  return u
    ? { login: u.login, name: u.name, avatarUrl: `${u.avatar_url}&s=144`, htmlUrl: u.html_url, publicRepos: u.public_repos }
    : {
        login: contact.githubHandle,
        name: null,
        avatarUrl: `https://github.com/${contact.githubHandle}.png?size=144`,
        htmlUrl: contact.github,
        publicRepos: null,
      };
}

/** Repos at build time, plus the live-site links that opened, for the browser refresh to reuse. */
export async function getRepos(): Promise<{ repos: GitHubRepo[]; verifiedHomepages: string[] }> {
  const raw = await getJson<RawRepo[]>(REPOS_URL);
  if (!raw) return { repos: [], verifiedHomepages: [] };
  const homepages = raw.map((r) => r.homepage).filter((h): h is string => Boolean(h));
  const verified = await publicLinks(homepages);
  return { repos: pickRepos(raw, verified), verifiedHomepages: [...verified] };
}
