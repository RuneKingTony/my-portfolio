import type { Line, Shot, Station } from '@/content/types';
import { Dotted } from './dotted';
import { Reveal } from './reveal';
import './line-section.css';

/** One line of work: its plate on the left, its stops ridden as a strip on the right. */
export function LineSection({
  line,
  shots,
  live,
}: {
  line: Line;
  shots: Shot[];
  live: Set<string>;
}) {
  return (
    <article id={`line-${line.id}`} className="line-section">
      <LinePlate line={line} />
      <Reveal className="strip-wrap">
        <span className="strip-train" aria-hidden="true" />
        <ol className="strip">
          {line.stations.map((station, i) => (
            <Stop key={station.label} station={station} index={i} live={live} />
          ))}
        </ol>
      </Reveal>
      <Shots shots={shots} />
    </article>
  );
}

function LinePlate({ line }: { line: Line }) {
  return (
    <header className="line-plate">
      <div className="line-bar">
        <span className="badge badge-lg">{line.code}</span>
      </div>
      <h3 className="line-name">{line.name}</h3>
      <p className="line-role">{line.role}</p>
      <dl className="line-meta">
        <div>
          <dt>When</dt>
          <dd className="figures">{line.period}</dd>
        </div>
        <div className="line-meta-stack">
          <dt>Stack</dt>
          <dd>
            <Dotted items={line.stack} />
          </dd>
        </div>
      </dl>
      <p className="line-summary">{line.summary}</p>
    </header>
  );
}

const stopKind = (station: Station) => {
  if (station.interchange !== undefined) return 'interchange';
  return station.terminus === true ? 'terminus' : 'station';
};

function Stop({
  station,
  index,
  live,
}: {
  station: Station;
  index: number;
  live: Set<string>;
}) {
  // A link ships only if the build could open it.
  const links = (station.links ?? []).filter((l) => live.has(l.href));
  return (
    <li
      className="stop"
      data-kind={stopKind(station)}
      style={{ ['--n' as string]: index }}
    >
      <span className="stop-mark" aria-hidden="true" />
      <h4 className="stop-name">{station.name ?? station.label}</h4>
      <p className="stop-detail">{station.detail}</p>
      {links.length > 0 ? (
        <p className="stop-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
        </p>
      ) : null}
    </li>
  );
}

function Shots({ shots }: { shots: Shot[] }) {
  if (shots.length === 0) return null;
  return (
    <div className={shots.length === 1 ? 'shots shots-one' : 'shots'}>
      {shots.map((shot) => (
        <figure key={shot.src} className="shot">
          {/* Static export serves these as-is; sizes come from the screenshots themselves. */}
          <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
          <figcaption>{shot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
