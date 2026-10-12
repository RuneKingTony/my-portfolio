import { getRepos } from '@/features/github/github';
import { GitHubProjects } from '@/features/github/github-projects';
import { Typewriter } from '@/features/typewriter/typewriter';
import './section.css';
import './on-github.css';

export async function OnGitHub() {
  const repos = await getRepos();
  return (
    <section id="github" className="github" aria-labelledby="github-title">
      <div className="section-head">
        <h2 id="github-title">
          <Typewriter segments={[{ text: 'On GitHub' }]} speed={60} />
        </h2>
        <p>My most recent public code.</p>
      </div>
      <GitHubProjects repos={repos} />
    </section>
  );
}
