import { CaretDownIcon } from '@phosphor-icons/react';
import { Reveal } from './ui/Reveal';

/*
 * Answers must stay word-for-word in sync with the FAQPage JSON-LD in
 * index.html — Google requires visible text to match the structured data.
 */
const FAQS = [
  {
    q: 'Was ist UNPLND?',
    a: 'UNPLND ist eine App, die euch in Sekunden einen kompletten Abend plant: eine Route mit Bars, Restaurants und Aktivitäten, Navigation von Spot zu Spot und ein Album, das eure Fotos automatisch sammelt.',
  },
  {
    q: 'Wo bekomme ich UNPLND?',
    a: 'Für iPhone jetzt kostenlos im App Store. Die Android-Version folgt bald, trag dich ein und du bekommst die eine Mail zum Android-Start.',
  },
  {
    q: 'Was kostet UNPLND?',
    a: 'UNPLND ist kostenlos.',
  },
  {
    q: 'Wie funktioniert die Planung?',
    a: 'Ihr sagt UNPLND kurz, worauf ihr Bock habt: Stimmung, Budget, Gruppe, Zeit. Daraus entsteht eine fertige Route für euren Abend.',
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="bg-surface-2/60 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Kurz beantwortet.
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3.5">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} index={i}>
              <details className="group rounded-(--radius-card) border border-line bg-surface px-6 py-5 shadow-warm-sm open:shadow-warm">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold tracking-tight text-heading [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <CaretDownIcon
                    size={18}
                    weight="bold"
                    className="shrink-0 text-terra transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
