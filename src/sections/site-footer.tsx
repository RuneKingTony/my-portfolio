import { builtOn } from '@/lib/dates';
import './site-footer.css';

export function SiteFooter() {
  return (
    <footer className="footer">
      <p>
        &copy; {builtOn.getUTCFullYear()} Anthony Nkwa. Built with Next.js and
        TypeScript.
      </p>
    </footer>
  );
}
