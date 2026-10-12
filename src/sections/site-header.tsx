import { ThemeToggle } from '@/features/theme/theme-toggle';
import './site-header.css';

export function SiteHeader() {
  return (
    <>
      <a className="skip" href="#history">
        Skip to my experience
      </a>

      <header className="topbar">
        <a
          className="plate"
          href="#top"
          aria-label="Anthony Nkwa, back to the top"
        >
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
    </>
  );
}
