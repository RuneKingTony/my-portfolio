import { existsSync } from 'node:fs';
import path from 'node:path';
import { chronological, lines } from '@/content/network';
import type { Shot } from '@/content/types';
import { LineSection } from '@/features/line-section/line-section';
import { Typewriter } from '@/features/typewriter/typewriter';
import { publicLinks } from '@/lib/links';
import './section.css';
import './projects.css';

// A shot ships only when its file is in /public at build time.
const shotsOnDisk = (shots: Shot[] = []) =>
  shots.filter((shot) =>
    existsSync(path.join(process.cwd(), 'public', shot.src))
  );

const stationLinks = lines.flatMap((line) =>
  line.stations.flatMap((stop) => stop.links?.map((link) => link.href) ?? [])
);

export async function Projects() {
  const live = await publicLinks(stationLinks);
  return (
    <section id="lines" className="lines" aria-labelledby="lines-title">
      <div className="section-head">
        <h2 id="lines-title">
          <Typewriter segments={[{ text: 'Projects' }]} speed={60} />
        </h2>
        <p>
          A closer look at each one: what it is, and the parts I&rsquo;m
          proudest of.
        </p>
      </div>
      {chronological().map((line) => (
        <LineSection
          key={line.id}
          line={line}
          shots={shotsOnDisk(line.shots)}
          live={live}
        />
      ))}
    </section>
  );
}
