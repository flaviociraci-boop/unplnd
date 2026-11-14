import { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Steps } from './components/Steps';
import { Showcase } from './components/Showcase';
import { Bento } from './components/Bento';
import { Discover } from './components/Discover';
import { Social } from './components/Social';
import { Faq } from './components/Faq';
import { EarlyAccess } from './components/EarlyAccess';
import { LegalPage } from './components/LegalPage';
import { Footer } from './components/Footer';

/** Tiny hash router: '#/impressum' | '#/datenschutz' are pages, everything else is the landing (with anchor scrolling). */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const legal =
    hash === '#/impressum'
      ? 'impressum'
      : hash === '#/datenschutz'
        ? 'datenschutz'
        : hash === '#/teilnahmebedingungen'
          ? 'teilnahmebedingungen'
          : hash === '#/konto-loeschen'
            ? 'konto-loeschen'
            : null;

  // Legal pages open at the top; anchor hashes scroll once the landing has rendered.
  useEffect(() => {
    if (legal) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    if (hash && !hash.startsWith('#/')) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [hash, legal]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-btn focus:px-4 focus:py-2 focus:text-btn-text"
      >
        Zum Inhalt springen
      </a>
      <Nav />
      <main id="main">
        {legal ? (
          <LegalPage kind={legal} />
        ) : (
          <>
            <Hero />
            <Steps />
            <EarlyAccess />
            <Showcase />
            <Bento />
            <Discover />
            <Social />
            <Faq />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
