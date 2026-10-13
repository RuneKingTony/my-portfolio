import { ServiceHistory } from '@/features/service-history/service-history';
import { Typewriter } from '@/features/typewriter/typewriter';
import './section.css';
import './experience.css';

export function Experience() {
  return (
    <section
      id="history"
      className="history-section"
      aria-labelledby="history-title"
    >
      <div className="section-head">
        <h2 id="history-title">
          <Typewriter segments={[{ text: 'Experience' }]} speed={60} />
        </h2>
        <p>
          Where I&rsquo;ve worked and what I&rsquo;ve built, oldest first. Open
          a row to see what I did.
        </p>
      </div>
      <ServiceHistory />
    </section>
  );
}
