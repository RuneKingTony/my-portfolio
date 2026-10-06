"use client";

import { useEffect, useState } from "react";
import { contact } from "@/content/contact";
import { REPOS_URL, pickRepos, type GitHubRepo, type RawRepo } from "@/lib/github-repos";
import { monthYear } from "@/lib/dates";

/**
 * Shows the repos fetched at build time straight away, then refreshes them from GitHub
 * in the visitor's browser so the list stays current between builds. If the refresh
 * fails (offline, rate limit), the build's list simply stays.
 */
export function GitHubProjects({ initial, verifiedHomepages }: { initial: GitHubRepo[]; verifiedHomepages: string[] }) {
  const [repos, setRepos] = useState(initial);

  useEffect(() => {
    const controller = new AbortController();
    fetch(REPOS_URL, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<RawRepo[]>) : null))
      .then((raw) => {
        if (raw) setRepos(pickRepos(raw, new Set(verifiedHomepages)));
      })
      .catch(() => {
        // Keep the build's list.
      });
    return () => controller.abort();
  }, [verifiedHomepages]);

  if (repos.length === 0) {
    return (
      <p className="repos-note">
        My public code is on{" "}
        <a href={contact.github} target="_blank" rel="noopener">
          GitHub
        </a>
        .
      </p>
    );
  }

  return (
    <>
      <ul className="repos">
        {repos.map((repo) => (
          <li key={repo.name} className="repo">
            <h3 className="repo-name">
              <a href={repo.htmlUrl} target="_blank" rel="noopener">
                {repo.displayName}
              </a>
            </h3>
            {repo.description ? <p className="repo-desc">{repo.description}</p> : null}
            <p className="repo-meta">
              {repo.language ? <span>{repo.language}</span> : null}
              <span className="figures">Updated {monthYear(new Date(repo.pushedAt))}</span>
              {repo.stars > 0 ? (
                <span className="figures">
                  {repo.stars} {repo.stars === 1 ? "star" : "stars"}
                </span>
              ) : null}
            </p>
            <p className="repo-links">
              <a href={repo.htmlUrl} target="_blank" rel="noopener">
                Code
              </a>
              {repo.homepage ? (
                <a href={repo.homepage} target="_blank" rel="noopener">
                  Live site
                </a>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
      <p className="repos-note">My most recent public repos. EduVault and Anchor Fit are private.</p>
    </>
  );
}
