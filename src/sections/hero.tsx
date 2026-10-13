import { contact } from '@/content/contact';
import { DepartureBoard } from '@/features/departure-board/departure-board';
import { NetworkMap } from '@/features/network-map/network-map';
import { Typewriter } from '@/features/typewriter/typewriter';
import { builtOn, monthYear } from '@/lib/dates';
import './hero.css';

// The lede starts typing once the name has finished.
const NAME = 'Anthony Nkwa';
const NAME_SPEED = 75;
const NAME_DELAY = 250;
const LEDE_DELAY = NAME_DELAY + NAME.length * NAME_SPEED + 250;

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-head">
        <div className="hero-intro">
          <h1 id="hero-title">
            <Typewriter
              segments={[{ text: NAME }]}
              speed={NAME_SPEED}
              delay={NAME_DELAY}
            />
          </h1>
          <p className="hero-lede">
            <Typewriter
              segments={[
                { text: 'Full-stack engineer.', strong: true },
                {
                  text: ' I build products in TypeScript, from the database and API to payments, admin tools and the apps customers use. I like the parts of software where getting the details right really matters. Here’s what I’ve built.',
                },
              ]}
              speed={14}
              delay={LEDE_DELAY}
              keepCursor
            />
          </p>
          <div className="hero-actions">
            <a className="terminus-sign" href={`mailto:${contact.email}`}>
              <span className="terminus-sign-label">Email me</span>
              <span className="terminus-sign-value">{contact.email}</span>
            </a>
            <a
              className="hero-github"
              href={contact.github}
              rel="me noopener noreferrer"
              target="_blank"
            >
              github.com/{contact.githubHandle}
            </a>
          </div>
        </div>
      </div>
      <DepartureBoard asOf={monthYear(builtOn)} />
      <NetworkMap />
    </section>
  );
}
