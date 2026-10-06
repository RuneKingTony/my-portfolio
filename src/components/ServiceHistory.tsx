import { chronological, statusLabel } from "@/content/network";
import { LineBadge } from "./LineBadge";

/** Experience: every role and project in the order it started, oldest first. Each row expands. */
export function ServiceHistory() {
  const ordered = chronological();
  return (
    <ol className="history">
      {ordered.map((line, i) => (
        <li key={line.id}>
          <details className="service" open={i === ordered.length - 1}>
            <summary>
              <span className="service-when figures">{line.period}</span>
              <span className="service-line">
                <LineBadge line={line} />
                <span className="service-name">{line.name}</span>
              </span>
              <span className="service-title">{line.service.title}</span>
              <span className="service-status" data-status={line.service.status}>
                {statusLabel[line.service.status].prose}
              </span>
              <svg className="service-chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 6 L8 11 L13 6" />
              </svg>
            </summary>
            <div className="service-body">
              <ul>
                {line.service.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <a href={`#line-${line.id}`} className="service-ride">
                More about {line.name}
              </a>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
