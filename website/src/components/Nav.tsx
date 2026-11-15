import { useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { APP_STORE_URL } from '../config';

/**
 * Single-line nav, 64px, warm glass once the page scrolls.
 * One CTA intent: "App laden" → the App Store.
 */
export function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12));

  return (
    <motion.header
      initial={{ y: reduce ? 0 : -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'border-b border-line/70 bg-bg/85 shadow-warm-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2" aria-label="UNPLND, zum Seitenanfang">
          <img src="/brand/logo-mark.png" alt="" width={48} height={48} draggable={false} />
          <span className="text-xl font-bold tracking-tight text-heading">UNPLND</span>
        </a>

        <div className="hidden items-center gap-7 text-[15px] font-medium text-ink-2 md:flex">
          <a href="#ablauf" className="transition-colors hover:text-heading">
            So funktioniert's
          </a>
          <a href="#features" className="transition-colors hover:text-heading">
            Features
          </a>
          <a href="#community" className="transition-colors hover:text-heading">
            Community
          </a>
        </div>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex min-h-10 items-center rounded-full bg-btn px-5 text-[15px] font-semibold text-btn-text shadow-warm-sm hover:shadow-warm"
        >
          App laden
        </a>
      </nav>
    </motion.header>
  );
}
