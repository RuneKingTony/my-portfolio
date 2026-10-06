import type { Line, Shot } from "@/content/network";
import { Dotted } from "./Dotted";
import { LineBadge } from "./LineBadge";
import { Reveal } from "./Reveal";

export function LineSection({ line, shots, live }: { line: Line; shots: Shot[]; live: Set<string> }) {
  return (
    <article id={`line-${line.id}`} className="line-section">
      <header className="line-plate">
        <div className="line-bar">
          <LineBadge line={line} size="lg" />
        </div>
        <h3 className="line-name">
          {line.name}
        </h3>
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

      <Reveal className="strip-wrap">
        <span className="strip-train" aria-hidden="true" />
        <ol className="strip">
          {line.stations.map((s, i) => (
            <li
              key={s.label}
              className="stop"
              data-kind={s.interchange ? "interchange" : s.terminus ? "terminus" : "station"}
              style={{ ["--n" as string]: i }}
            >
              <span className="stop-mark" aria-hidden="true" />
              <h4 className="stop-name">{s.name ?? s.label}</h4>
              <p className="stop-detail">{s.detail}</p>
              {s.links?.some((l) => live.has(l.href)) ? (
                <p className="stop-links">
                  {s.links
                    .filter((l) => live.has(l.href))
                    .map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener">
                        {l.label}
                      </a>
                    ))}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Reveal>

      {shots.length > 0 ? (
        <div className={shots.length === 1 ? "shots shots-one" : "shots"}>
          {shots.map((shot) => (
            <figure key={shot.src} className="shot">
              {/* Static export serves these as-is; sizes come from the screenshots themselves. */}
              <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </article>
  );
}
