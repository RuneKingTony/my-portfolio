import { GitHubCard } from '@/features/github/github-card';
import { getProfile } from '@/features/github/github';
import { Typewriter } from '@/features/typewriter/typewriter';
import './section.css';
import './about.css';

const focus = [
  'Full-stack TypeScript',
  'Payments',
  'Admin tools',
  'Component libraries',
];

export async function About() {
  const profile = await getProfile();
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">
          <Typewriter segments={[{ text: 'About' }]} speed={70} />
        </h2>
      </div>
      <div className="about-body">
        <div className="about-text">
          <p>
            I&rsquo;m Anthony, a software engineer. I work across the stack,
            from databases and APIs to the screens people use. From August 2024
            to August 2026 I worked on the web platform of a Nigerian lending
            company. Before that I spent a year as a frontend engineer at a food
            delivery e-commerce company.
          </p>
          <p>
            On my own time I designed and built EduVault, a school management
            system, built the online store for Anchor Fit, and co-run GVR Labs,
            a small software studio.
          </p>
          <p>
            I enjoy the details that make software dependable, like payments
            that always add up and each customer seeing only their own data.
            I&rsquo;m looking for a product team where I can keep learning and
            building things people rely on.
          </p>
          <ul className="about-focus" aria-label="What I focus on">
            {focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <aside className="about-cards" aria-label="Profile">
          <GitHubCard profile={profile} />
        </aside>
      </div>
    </section>
  );
}
