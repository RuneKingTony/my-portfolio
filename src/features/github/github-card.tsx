import type { GitHubProfile } from './github';
import './github-card.css';

/** The profile card. Without GitHub, it is built from the handle alone and still links to the profile. */
export function GitHubCard({ profile }: { profile: GitHubProfile }) {
  return (
    <a
      className="gh-card"
      href={profile.htmlUrl}
      target="_blank"
      rel="me noopener noreferrer"
    >
      {/* Static export: the avatar is served straight from GitHub. */}
      <img src={profile.avatarUrl} alt="" width={72} height={72} />
      <span className="gh-card-text">
        <span className="gh-card-name">{profile.name ?? 'Anthony'}</span>
        <span className="gh-card-handle">@{profile.login}</span>
        {profile.publicRepos === null ? null : (
          <span className="gh-card-meta figures">
            {profile.publicRepos} public repositories
          </span>
        )}
      </span>
      <span className="gh-card-cta">View GitHub profile</span>
    </a>
  );
}
