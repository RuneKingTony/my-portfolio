// Turning GitHub's API response into the repos the site shows, at build time
// (github.ts).

import { contact } from '@/content/contact';

export const GITHUB_API = 'https://api.github.com';
export const REPOS_URL = `${GITHUB_API}/users/${contact.githubHandle}/repos?per_page=100&sort=pushed`;

export interface GitHubRepo {
  name: string;
  displayName: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  homepage: string | null;
  pushedAt: string;
  stars: number;
}

/** The fields the site reads from GitHub's repo objects. */
export interface RawRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

/** Repos shown are the user's own work, recently active: no forks, nothing untouched since before this cutoff. */
const ACTIVE_SINCE = '2023-10-01';
const MAX_REPOS = 6;

/** Friendlier names for repos whose slug isn't the project's name. */
const DISPLAY_NAMES: Record<string, string> = {
  'mbs-investment': 'MBAS Investment',
  mrsdeb: 'Amara Kharis',
};

/** GitHub sends some empty fields as "" and others as null; the site reads only null. */
const orNull = (value: string | null): string | null =>
  value === '' ? null : value;

/**
 * The repos worth showing, newest first. `verifiedHomepages` holds the live-site links
 * the build was able to open; any other homepage is left off so no broken link ships.
 */
export const pickRepos = (
  raw: RawRepo[],
  verifiedHomepages: ReadonlySet<string>
): GitHubRepo[] =>
  raw
    .filter((r) => !r.fork && !r.archived && r.pushed_at >= ACTIVE_SINCE)
    .slice(0, MAX_REPOS)
    .map((r) => ({
      name: r.name,
      displayName: DISPLAY_NAMES[r.name] ?? r.name.replaceAll(/[-_]+/g, ' '),
      description: orNull(r.description),
      language: orNull(r.language),
      htmlUrl: r.html_url,
      homepage:
        r.homepage !== null && verifiedHomepages.has(r.homepage)
          ? r.homepage
          : null,
      pushedAt: r.pushed_at,
      stars: r.stargazers_count,
    }));
