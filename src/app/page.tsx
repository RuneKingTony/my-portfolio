import { About } from '@/sections/about';
import { Contact } from '@/sections/contact';
import { Experience } from '@/sections/experience';
import { Hero } from '@/sections/hero';
import { OnGitHub } from '@/sections/on-github';
import { Projects } from '@/sections/projects';
import { SiteFooter } from '@/sections/site-footer';
import { SiteHeader } from '@/sections/site-header';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <OnGitHub />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
