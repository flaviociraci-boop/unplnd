import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRightIcon,
  ImagesSquareIcon,
  LightningIcon,
  NavigationArrowIcon,
} from '@phosphor-icons/react';
import { PinImage } from './ui/PinImage';
import { PhoneMockup } from './PhoneMockup';
import { MiniPlanner } from './MiniPlanner';
import { APP_STORE_URL } from '../config';

/* what you get, in three glances — the fastest way to answer "what is this?" */
const PROOF = [
  { icon: LightningIcon, label: 'Route in Sekunden', tone: 'bg-coral' },
  { icon: NavigationArrowIcon, label: 'Navigation inklusive', tone: 'bg-sunset' },
  { icon: ImagesSquareIcon, label: 'Album automatisch', tone: 'bg-honey' },
] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -36]);

  const item = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-x-clip pt-24 md:pt-28"
      aria-labelledby="hero-title"
    >
      {/* brand-coloured ambience: the page should read as UNPLND at a glance */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]"
        style={{
          background:
            'radial-gradient(620px 420px at 80% 22%, rgba(242,184,75,0.28), transparent 68%), radial-gradient(520px 380px at 64% 42%, rgba(255,107,90,0.20), transparent 70%), radial-gradient(460px 340px at 8% 6%, rgba(201,123,99,0.18), transparent 70%)',
        }}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        {/* copy */}
        <div className="max-w-xl">
          <motion.h1
            {...item(0)}
            id="hero-title"
            className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-heading sm:text-5xl lg:text-6xl"
          >
            Nie wieder &bdquo;Was machen wir heute?&ldquo;
          </motion.h1>
          <motion.p
            {...item(1)}
            className="mt-5 max-w-[46ch] text-[18px] leading-relaxed text-ink-2"
          >
            <strong className="font-semibold text-ink">
              UNPLND ist die App für spontane Abende mit Freunden.
            </strong>{' '}
            Sagt, worauf ihr Bock habt, und ihr bekommt in Sekunden eine fertige Route: Bar,
            Essen, Aktivität.
          </motion.p>

          {/* three glances: what you actually get */}
          <motion.ul {...item(2)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {PROOF.map((p) => (
              <li key={p.label} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-[#33241E] ${p.tone}`}
                >
                  <p.icon size={15} weight="fill" aria-hidden />
                </span>
                <span className="text-[14.5px] font-semibold text-ink">{p.label}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...item(3)} className="mt-8">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex min-h-14 items-center gap-2.5 rounded-(--radius-btn) bg-btn px-7 text-[17px] font-semibold text-btn-text shadow-warm hover:shadow-warm-lg"
            >
              Kostenlos im App Store laden
              <ArrowRightIcon size={20} weight="bold" aria-hidden />
            </a>
            <p className="mt-3 text-[14px] font-medium text-ink-2">
              Für iPhone. Android folgt bald.
            </p>
          </motion.div>
        </div>

        {/* product */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto pb-6 lg:pb-2"
        >
          <motion.div style={{ y: phoneY }} className="relative">
            {/* Pin peeks over the top edge of the phone */}
            <PinImage
              name="pin-peek"
              alt=""
              className="absolute -top-[74px] right-8 z-10 w-28"
            />
            <PhoneMockup label="Vorschau der UNPLND App: Planer-Chat mit fertiger Abendroute">
              <MiniPlanner />
            </PhoneMockup>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
