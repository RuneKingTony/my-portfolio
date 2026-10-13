import { contact } from '@/content/contact';
import { ContactForm } from '@/features/contact/contact-form';
import { Typewriter } from '@/features/typewriter/typewriter';
import './section.css';
import './contact.css';

const [emailUser, emailDomain] = contact.email.split('@');

/** The end of the line: the track runs out into the dashed red next stop. */
export function Contact() {
  return (
    <section id="contact" className="end" aria-labelledby="end-title">
      <svg
        className="end-track"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="end-track-built" d="M 0 20 H 520" />
        <path className="end-track-planned" d="M 520 20 H 1180" />
        <rect
          className="end-track-terminus"
          x={1176}
          y={4}
          width={8}
          height={32}
        />
      </svg>
      <h2 id="end-title">
        <Typewriter
          segments={[{ text: 'Let’s work together' }]}
          speed={60}
          keepCursor
        />
      </h2>
      <div className="end-body">
        <div>
          <p className="end-lede">
            I&rsquo;m open to full-time product engineering roles, and I take on
            select freelance builds.
          </p>
          <a className="end-email" href={`mailto:${contact.email}`}>
            {emailUser}
            <wbr />@{emailDomain}
          </a>
          <p className="end-links">
            <a
              href={contact.github}
              rel="me noopener noreferrer"
              target="_blank"
            >
              github.com/{contact.githubHandle}
            </a>
          </p>
        </div>
        <ContactForm to={contact.email} />
      </div>
    </section>
  );
}
