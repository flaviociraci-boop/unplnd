import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AppleLogoIcon,
  CheckCircleIcon,
  GooglePlayLogoIcon,
} from '@phosphor-icons/react';
import { Reveal } from './ui/Reveal';
import { PinImage } from './ui/PinImage';
import { joinWaitlist } from '../lib/waitlist';
import { APP_STORE_URL } from '../config';

type Status = 'idle' | 'loading' | 'ok' | 'duplicate' | 'error';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function EarlyAccess() {
  const reduce = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [fieldError, setFieldError] = useState<{ name?: string; email?: string }>({});

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors: typeof fieldError = {};
    if (!name.trim()) errors.name = 'Sag uns kurz, wie du heißt.';
    if (!EMAIL_RE.test(email.trim())) errors.email = 'Das sieht noch nicht nach einer E-Mail aus.';
    setFieldError(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('loading');
    try {
      const result = await joinWaitlist(name, email);
      setStatus(result === 'duplicate' ? 'duplicate' : 'ok');
    } catch {
      setStatus('error');
    }
  }

  const done = status === 'ok' || status === 'duplicate';

  return (
    <section
      id="early-access"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6 md:pb-32"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-(--radius-sheet) bg-[linear-gradient(135deg,#FF6B5A_0%,#E88C5A_52%,#F2B84B_100%)] px-6 py-14 shadow-warm-xl md:px-14 md:py-18">
          {/* soft light sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(420px 260px at 18% 0%, rgba(255,255,255,0.35), transparent 70%)',
            }}
          />

          <div className="relative max-w-xl" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div
                  key="done"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="py-6"
                >
                  <CheckCircleIcon size={52} weight="fill" className="text-[#33241E]" aria-hidden />
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#33241E] sm:text-4xl">
                    {status === 'duplicate' ? 'Du stehst schon auf der Liste.' : 'Du bist auf der Liste!'}
                  </h2>
                  <p className="mt-3 max-w-[38ch] text-[17px] font-medium leading-relaxed text-[#4A362E]">
                    {status === 'duplicate'
                      ? 'Stark. Wir schreiben dir, sobald UNPLND für Android da ist.'
                      : `Danke, ${name.trim().split(' ')[0]}. Wir schreiben dir, sobald UNPLND für Android da ist.`}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={false}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="text-4xl font-bold tracking-tight text-[#33241E] sm:text-5xl">
                    UNPLND ist da.
                  </h2>
                  <p className="mt-4 max-w-[40ch] text-[17px] font-medium leading-relaxed text-[#4A362E]">
                    Für iPhone jetzt kostenlos im App Store.
                  </p>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable mt-6 inline-flex min-h-14 items-center gap-2.5 rounded-(--radius-btn) bg-[#33241E] px-7 text-[17px] font-semibold text-[#FFFDFC] shadow-warm-lg"
                  >
                    <AppleLogoIcon size={22} weight="fill" aria-hidden />
                    Im App Store laden
                  </a>
                  <p className="mt-8 max-w-[40ch] text-[16px] font-semibold leading-relaxed text-[#33241E]">
                    Du hast Android? Trag dich ein und wir schreiben dir zum Android-Start.
                  </p>

                  <form onSubmit={onSubmit} noValidate className="mt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="ea-name"
                          className="mb-1.5 block text-[14px] font-semibold text-[#33241E]"
                        >
                          Name
                        </label>
                        <input
                          id="ea-name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Beispiel"
                          aria-invalid={!!fieldError.name}
                          aria-describedby={fieldError.name ? 'ea-name-error' : undefined}
                          className="min-h-12 w-full rounded-2xl border-2 border-transparent bg-white/95 px-4 text-[16px] text-[#33241E] placeholder:text-[#8a7466] focus:border-[#33241E] focus:outline-none"
                        />
                        {fieldError.name && (
                          <p id="ea-name-error" className="mt-1.5 text-[13.5px] font-semibold text-[#5C1408]">
                            {fieldError.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="ea-email"
                          className="mb-1.5 block text-[14px] font-semibold text-[#33241E]"
                        >
                          E-Mail
                        </label>
                        <input
                          id="ea-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@mail.de"
                          aria-invalid={!!fieldError.email}
                          aria-describedby={fieldError.email ? 'ea-email-error' : undefined}
                          className="min-h-12 w-full rounded-2xl border-2 border-transparent bg-white/95 px-4 text-[16px] text-[#33241E] placeholder:text-[#8a7466] focus:border-[#33241E] focus:outline-none"
                        />
                        {fieldError.email && (
                          <p id="ea-email-error" className="mt-1.5 text-[13.5px] font-semibold text-[#5C1408]">
                            {fieldError.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {status === 'error' && (
                      <p role="alert" className="mt-4 text-[14.5px] font-semibold text-[#5C1408]">
                        Das hat gerade nicht geklappt. Probier es gleich nochmal.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="pressable mt-5 inline-flex min-h-14 items-center justify-center rounded-(--radius-btn) bg-[#33241E] px-8 text-[17px] font-semibold text-[#FFFDFC] shadow-warm-lg disabled:opacity-70"
                    >
                      {status === 'loading' ? 'Einen Moment…' : 'Android-Start mitbekommen'}
                    </button>
                    <p className="mt-3 text-[13px] font-medium text-[#4A362E]">
                      Kein Spam. Nur die eine Mail zum Android-Start.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center gap-2 text-[#4A362E]">
              <AppleLogoIcon size={18} weight="fill" aria-hidden />
              <GooglePlayLogoIcon size={16} weight="fill" aria-hidden />
              <span className="text-[13.5px] font-semibold">Jetzt für iPhone · Android folgt bald</span>
            </div>
          </div>

          {/* Pin & friend on the couch, phone in hand */}
          <PinImage
            name="pin-couch"
            alt="Pin und ein Freund sitzen mit dem Handy auf dem Sofa"
            className="pointer-events-none absolute -bottom-4 -right-4 hidden w-64 md:block lg:w-80"
          />
        </div>
      </Reveal>
    </section>
  );
}
