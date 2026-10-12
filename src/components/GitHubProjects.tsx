import { contact } from '@/content/contact';
import type { GitHubRepo } from '@/lib/github-repos';
import { monthYear } from '@/lib/dates';

/** The repos fetched when the site was built. A push rebuilds the site, which refreshes them. */
export function GitHubProjects({ repos }: { repos: GitHubRepo[] }) {
  if (repos.length === 0) {
    return (
      <p className="repos-note">
        My public code is on{' '}
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
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
              <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                {repo.displayName}
              </a>
            </h3>
            {repo.description === null ? null : (
              <p className="repo-desc">{repo.description}</p>
            )}
            <p className="repo-meta">
              {repo.language === null ? null : <span>{repo.language}</span>}
              <span className="figures">
                Updated {monthYear(new Date(repo.pushedAt))}
              </span>
              {repo.stars > 0 ? (
                <span className="figures">
                  {repo.stars} {repo.stars === 1 ? 'star' : 'stars'}
                </span>
              ) : null}
            </p>
            <p className="repo-links">
              <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                Code
              </a>
              {repo.homepage === null ? null : (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live site
                </a>
              )}
            </p>
          </li>
        ))}
      </ul>
      <p className="repos-note">
        My most recent public repos. EduVault and Anchor Fit are private.
      </p>
    </>
  );
}
