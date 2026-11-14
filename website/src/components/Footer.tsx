import { Suspense, lazy, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { CONTACT_EMAIL, TAGLINE } from '../config';

const FooterPlayer = lazy(() => import('./FooterPlayer'));

export function Footer() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: '360px 0px' });

  return (
    <footer className="border-t border-line">
      {/* the living logo closes the page */}
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <div
          ref={ref}
          role="img"
          aria-label="Das UNPLND Logo schwebt, blinzelt und lächelt."
          className="mx-auto aspect-[1080/430] w-full max-w-xl"
        >
          {near ? (
            <Suspense fallback={<div className="h-full w-full" aria-hidden />}>
              <FooterPlayer reducedMotion={reduce} />
            </Suspense>
          ) : (
            <div className="h-full w-full" aria-hidden />
          )}
        </div>
        <p className="mt-6 text-center text-lg font-semibold tracking-tight text-heading">
          {TAGLINE}
        </p>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2.5 px-4 pb-10 pt-12 text-[13.5px] text-ink-2 sm:px-6 md:pt-14">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-heading transition-colors hover:text-terra"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href="#/impressum"
            className="font-medium text-heading transition-colors hover:text-terra"
          >
            Impressum
          </a>
          <a
            href="#/datenschutz"
            className="font-medium text-heading transition-colors hover:text-terra"
          >
            Datenschutz
          </a>
          <a
            href="#/konto-loeschen"
            className="font-medium text-heading transition-colors hover:text-terra"
          >
            Konto löschen
          </a>
        </div>
        <p>© 2026 UNPLND</p>
      </div>
    </footer>
  );
}
