import { existsSync } from "node:fs";
import path from "node:path";
import { LineSection } from "@/components/LineSection";
import { ContactForm } from "@/components/ContactForm";
import { DepartureBoard } from "@/components/DepartureBoard";
import { GitHubProjects } from "@/components/GitHubProjects";
import { NetworkMap } from "@/components/NetworkMap";
import { ServiceHistory } from "@/components/ServiceHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Typewriter } from "@/components/Typewriter";
import { contact } from "@/content/contact";
import { chronological, lines, type Shot } from "@/content/network";
import { monthYear } from "@/lib/dates";
import { getProfile, getRepos } from "@/lib/github";
import { publicLinks } from "@/lib/links";

// Screenshots are optional: a shot ships only when its file is in /public at build time.
const shotsOnDisk = (shots: Shot[] = []) =>
  shots.filter((shot) => existsSync(path.join(process.cwd(), "public", shot.src)));

// The site is static, so "now" is the moment it was built.
const builtOn = new Date();

// The lede starts typing once the name has finished.
const NAME = "Anthony Nkwa";
const NAME_SPEED = 75;
const NAME_DELAY = 250;
const LEDE_DELAY = NAME_DELAY + NAME.length * NAME_SPEED + 250;

const [emailUser, emailDomain] = contact.email.split("@");

const focus = ["Full-stack TypeScript", "Payments", "Admin tools", "Component libraries"];

export default async function Home() {
  const [profile, github, reachableLinks] = await Promise.all([
    getProfile(),
    getRepos(),
    publicLinks(lines.flatMap((line) => line.stations.flatMap((stop) => stop.links?.map((link) => link.href) ?? []))),
  ]);
  return (
    <>
      <a className="skip" href="#history">
        Skip to my experience
      </a>

      <header className="topbar">
        <a className="plate" href="#top" aria-label="Anthony Nkwa, back to the top">
          Anthony Nkwa
        </a>
        <div className="topbar-right">
          <nav aria-label="Sections">
            <a href="#about">About</a>
            <a href="#history">Experience</a>
            <a href="#lines">Projects</a>
            <a href="#github">GitHub</a>
            <a href="#contact" className="nav-contact">
              Contact
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-head">
            <div className="hero-intro">
              <h1 id="hero-title">
                <Typewriter segments={[{ text: NAME }]} speed={NAME_SPEED} delay={NAME_DELAY} />
              </h1>
              <p className="hero-lede">
                <Typewriter
                  segments={[
                    { text: "Full-stack engineer.", strong: true },
                    {
                      text: " I build products in TypeScript, from the database and API to payments, admin tools and the apps customers use. I like the parts of software where getting the details right really matters. Here’s what I’ve built.",
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
                <a className="hero-github" href={contact.github} rel="me noopener" target="_blank">
                  github.com/{contact.githubHandle}
                </a>
              </div>
            </div>
          </div>
          <DepartureBoard asOf={monthYear(builtOn)} />
          <NetworkMap />
        </section>

        <section id="about" className="about" aria-labelledby="about-title">
          <div className="section-head">
            <h2 id="about-title">
              <Typewriter segments={[{ text: "About" }]} speed={70} />
            </h2>
          </div>
          <div className="about-body">
            <div className="about-text">
              <p>
                I&rsquo;m Anthony, a software engineer. I work across the stack, from databases and APIs to the screens
                people use. From August 2024 to August 2026 I worked on the web platform of a Nigerian lending company.
                Before that I spent a year as a frontend engineer at a food delivery e-commerce company.
              </p>
              <p>
                On my own time I designed and built EduVault, a school management system, built the online store for
                Anchor Fit, and co-run GVR Labs, a small software studio.
              </p>
              <p>
                I enjoy the details that make software dependable, like payments that always add up and each customer
                seeing only their own data. I&rsquo;m looking for a product team where I can keep learning and building
                things people rely on.
              </p>
              <ul className="about-focus" aria-label="What I focus on">
                {focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <aside className="about-cards" aria-label="Profile">
              {profile ? (
                <a className="gh-card" href={profile.htmlUrl} target="_blank" rel="me noopener">
                  {/* Static export: the avatar is served straight from GitHub. */}
                  <img src={profile.avatarUrl} alt="" width={72} height={72} />
                  <span className="gh-card-text">
                    <span className="gh-card-name">{profile.name ?? "Anthony"}</span>
                    <span className="gh-card-handle">@{profile.login}</span>
                    {profile.publicRepos !== null ? (
                      <span className="gh-card-meta figures">{profile.publicRepos} public repositories</span>
                    ) : null}
                  </span>
                  <span className="gh-card-cta">View GitHub profile</span>
                </a>
              ) : null}
            </aside>
          </div>
        </section>

        <section id="history" className="history-section" aria-labelledby="history-title">
          <div className="section-head">
            <h2 id="history-title">
              <Typewriter segments={[{ text: "Experience" }]} speed={60} />
            </h2>
            <p>Where I&rsquo;ve worked and what I&rsquo;ve built, oldest first. Open a row to see what I did.</p>
          </div>
          <ServiceHistory />
        </section>

        <section id="lines" className="lines" aria-labelledby="lines-title">
          <div className="section-head">
            <h2 id="lines-title">
              <Typewriter segments={[{ text: "Projects" }]} speed={60} />
            </h2>
            <p>A closer look at each one: what it is, and the parts I&rsquo;m proudest of.</p>
          </div>
          {chronological().map((line) => (
            <LineSection key={line.id} line={line} shots={shotsOnDisk(line.shots)} live={reachableLinks} />
          ))}
        </section>

        <section id="github" className="github" aria-labelledby="github-title">
            <div className="section-head">
              <h2 id="github-title">
                <Typewriter segments={[{ text: "On GitHub" }]} speed={60} />
              </h2>
              <p>My most recent public code.</p>
            </div>
            <GitHubProjects initial={github.repos} verifiedHomepages={github.verifiedHomepages} />
          </section>

        <section id="contact" className="end" aria-labelledby="end-title">
          <svg className="end-track" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <path className="end-track-built" d="M 0 20 H 520" />
            <path className="end-track-planned" d="M 520 20 H 1180" />
            <rect className="end-track-terminus" x={1176} y={4} width={8} height={32} />
          </svg>
          <h2 id="end-title">
            <Typewriter segments={[{ text: "Let’s work together" }]} speed={60} keepCursor />
          </h2>
          <div className="end-body">
            <div>
              <p className="end-lede">
                I&rsquo;m open to full-time product engineering roles, and I take on select freelance builds.
              </p>
              <a className="end-email" href={`mailto:${contact.email}`}>
                {emailUser}
                <wbr />@{emailDomain}
              </a>
              <p className="end-links">
                <a href={contact.github} rel="me noopener" target="_blank">
                  github.com/{contact.githubHandle}
                </a>
              </p>
            </div>
            <ContactForm to={contact.email} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {builtOn.getUTCFullYear()} Anthony Nkwa. Built with Next.js and TypeScript.</p>
      </footer>
    </>
  );
}
