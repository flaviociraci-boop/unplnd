import type { ReactNode } from 'react';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { CONTACT_EMAIL } from '../config';

/*
 * Legal texts for unplnd.com and the UNPLND app. Operator since 2026-11-02:
 * Bodensee-Spiele GmbH (Kreuzlingen, CH). Swiss DSG + EU GDPR where applicable.
 */

export type LegalKind = 'impressum' | 'datenschutz' | 'konto-loeschen';

export function LegalPage({ kind }: { kind: LegalKind }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <a
        href="#top"
        className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-terra-ink transition-colors hover:text-heading"
      >
        <ArrowLeftIcon size={16} weight="bold" aria-hidden />
        Zurück zur Startseite
      </a>

      {kind === 'impressum' ? (
        <Impressum />
      ) : kind === 'datenschutz' ? (
        <Datenschutz />
      ) : (
        <KontoLoeschen />
      )}
    </div>
  );
}

function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="mt-6 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{children}</h1>
  );
}
function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 text-2xl font-bold tracking-tight text-heading">{children}</h2>
  );
}
function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-lg font-semibold tracking-tight text-heading">{children}</h3>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{children}</p>;
}
function Address({ lines }: { lines: string[] }) {
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-ink">
      {lines.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </p>
  );
}

const OPERATOR = [
  'Bodensee-Spiele GmbH',
  'Hauptstrasse 4',
  '8280 Kreuzlingen',
  'Schweiz',
];

function Ext({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-terra-ink underline decoration-terra/40 underline-offset-2 hover:text-heading"
    >
      {href}
    </a>
  );
}

/*
 * Account deletion (required by Google Play: a web page where users can request deletion of
 * their account and data without the app). German first, English below for the store.
 */
function KontoLoeschen() {
  return (
    <>
      <H1>UNPLND-Konto löschen</H1>
      <P>
        Du kannst dein UNPLND-Konto und alle damit verbundenen Daten jederzeit löschen. Die App
        UNPLND wird von der Bodensee-Spiele GmbH betrieben.
      </P>

      <H2>In der App (sofort)</H2>
      <P>
        Öffne UNPLND und gehe zu <strong>Profil → Einstellungen → Konto löschen</strong>. Nach der
        Bestätigung werden dein Konto und deine Daten sofort und endgültig gelöscht.
      </P>

      <H2>Ohne App (per E-Mail)</H2>
      <P>
        Schreib uns von der E-Mail-Adresse, mit der du bei UNPLND angemeldet bist, an{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Konto%20l%C3%B6schen`}
          className="font-medium text-terra-ink underline decoration-terra/40 underline-offset-2 hover:text-heading"
        >
          {CONTACT_EMAIL}
        </a>{' '}
        mit dem Betreff „Konto löschen“. Wir löschen dein Konto innerhalb von 30 Tagen und
        bestätigen dir die Löschung per E-Mail.
      </P>

      <H2>Was gelöscht wird</H2>
      <P>
        Dein Konto und Profil (Name, E-Mail, Profilbild), deine geplanten Abende, Alben, Fotos und
        Notizen, deine veröffentlichten Community-Abende, Chats und Nachrichten, Verbindungen zu
        anderen Nutzern sowie geteilte Standortdaten.
      </P>

      <H2>Was aufbewahrt wird</H2>
      <P>
        Nichts davon bleibt in der App erhalten. Feedback und Meldungen über Inhalte, die du
        abgeschickt hast, bleiben ohne Bezug zu dir (anonymisiert) erhalten, damit wir gemeldete
        Inhalte weiter prüfen können. Technische Sicherungskopien unseres Datenbankanbieters
        werden automatisch nach spätestens 30 Tagen überschrieben.
      </P>

      <H2>Delete your UNPLND account (English)</H2>
      <P>
        <strong>In the app:</strong> open UNPLND and go to Profile → Settings → Delete account. Your
        account and data are deleted immediately and permanently.
      </P>
      <P>
        <strong>Without the app:</strong> email{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Delete%20account`}
          className="font-medium text-terra-ink underline decoration-terra/40 underline-offset-2 hover:text-heading"
        >
          {CONTACT_EMAIL}
        </a>{' '}
        from the address you signed up with, subject “Delete account”. We delete your account within
        30 days and confirm by email.
      </P>
      <P>
        <strong>Deleted:</strong> account and profile, planned evenings, albums, photos and notes,
        published community evenings, chats and messages, connections and shared location data.
        Feedback and content reports you sent are kept without any link to you (anonymised).
        Backups at our database provider are overwritten within 30 days.
      </P>

      <H2>Betreiber</H2>
      <Address lines={OPERATOR} />
    </>
  );
}

function Impressum() {
  return (
    <>
      <H1>Impressum</H1>

      <H2>Betreiberin</H2>
      <P>Betreiberin der Website unplnd.com und der App UNPLND:</P>
      <Address lines={OPERATOR} />

      <H3>Vertretungsberechtigte Person</H3>
      <P>Flavio Ciraci, Geschäftsführer</P>

      <H3>Kontakt</H3>
      <Address lines={[`E-Mail: ${CONTACT_EMAIL}`]} />

      <H3>Unternehmens-Identifikation</H3>
      <Address
        lines={[
          'Rechtsform: Gesellschaft mit beschränkter Haftung (GmbH)',
          'UID: CHE-195.187.021',
          'Mehrwertsteuernummer: CHE-195.187.021 MWST',
          'Eingetragen im Handelsregister des Kantons Thurgau',
        ]}
      />

      <H2>Haftungsausschluss</H2>

      <H3>Haftung für Inhalte</H3>
      <P>
        Die Inhalte dieser Website und der App wurden mit grösster Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine
        Gewähr. Vorschläge in der App (zum Beispiel Orte, Öffnungszeiten oder Preise) beruhen
        zum Teil auf Angaben Dritter und werden automatisch erstellt; bitte prüfen Sie wichtige
        Angaben vor Ort.
      </P>

      <H3>Haftung für Links</H3>
      <P>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
        oder Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen
        Inhalte erkennbar.
      </P>

      <H3>Urheberrecht</H3>
      <P>
        Die von uns erstellten Inhalte und Werke auf dieser Website und in der App unterliegen
        dem Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
        Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen unserer schriftlichen
        Zustimmung.
      </P>
    </>
  );
}

function Datenschutz() {
  return (
    <>
      <H1>Datenschutzerklärung</H1>
      <P>
        Diese Datenschutzerklärung gilt für die Website unplnd.com und für die App UNPLND
        (iOS). Sie erklärt, welche personenbezogenen Daten wir bearbeiten, wofür und an wen
        wir sie weitergeben. Wir richten uns nach dem Schweizer Datenschutzgesetz (DSG) und,
        soweit anwendbar, nach der EU-Datenschutz-Grundverordnung (DSGVO).
      </P>

      <H2>1. Verantwortliche Stelle</H2>
      <Address lines={OPERATOR} />
      <Address lines={['Geschäftsführer: Flavio Ciraci', `E-Mail: ${CONTACT_EMAIL}`]} />
      <P>
        Für alle Fragen zum Datenschutz und zur Ausübung Ihrer Rechte erreichen Sie uns unter
        der oben genannten E-Mail-Adresse.
      </P>

      <H2>2. Die App UNPLND</H2>

      <H3>Benutzerkonto</H3>
      <P>
        Für die Nutzung der App legen Sie ein Konto an, per E-Mail und Passwort oder über
        „Mit Apple anmelden" bzw. „Mit Google anmelden". Wir speichern dabei Ihre
        E-Mail-Adresse, Ihren Anzeigenamen und die Angaben, die Sie in Ihrem Profil machen
        (zum Beispiel Profilbild, Interessen). Bei der Anmeldung über Apple oder Google
        erhalten wir von diesen Anbietern nur Ihre E-Mail-Adresse (bei Apple auf Wunsch eine
        anonyme Weiterleitungsadresse) und gegebenenfalls Ihren Namen. Rechtsgrundlage ist die
        Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).
      </P>
      <P>
        Sie können Ihr Konto jederzeit in der App unter Einstellungen löschen. Dabei werden
        Ihr Profil und Ihre Inhalte gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten
        bestehen.
      </P>

      <H3>Standort</H3>
      <P>
        Um Orte in Ihrer Nähe zu finden und Sie durch Ihren Abend zu führen, nutzt die App
        Ihren Standort, aber nur während Sie die App verwenden und nur, wenn Sie dies in den
        iOS-Einstellungen erlauben. Wenn Sie die Live-Standortfreigabe für Freunde aktivieren,
        sehen Ihre bestätigten Kontakte Ihren ungefähren Standort, bis Sie die Freigabe wieder
        ausschalten. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die
        Sie jederzeit in den Einstellungen widerrufen können.
      </P>

      <H3>Abendplanung mit künstlicher Intelligenz (Google Gemini)</H3>
      <P>
        Vorschläge im Planer sowie die Antworten und die Stimme des Sprach-Concierge werden mit
        Hilfe künstlicher Intelligenz erzeugt. Dafür übermitteln wir Ihre Planungswünsche
        (zum Beispiel Stimmung, Budget, Uhrzeit, freier Text), Ihren ungefähren Standort bzw.
        Ihre Stadt und, wenn Sie den Sprach-Concierge nutzen, Ihre Sprachaufnahmen an die
        Gemini API von Google. Die Übermittlung erfolgt erst, nachdem Sie in der App
        ausdrücklich eingewilligt haben (Art. 6 Abs. 1 lit. a DSGVO). Wir nutzen den
        kostenpflichtigen Dienst, bei dem Google die Eingaben nach eigenen Angaben nicht zum
        Training seiner Modelle verwendet. Weitere Informationen:{' '}
        <Ext href="https://ai.google.dev/gemini-api/terms" />
      </P>

      <H3>Ortsdaten (Google Places)</H3>
      <P>
        Orte, Öffnungszeiten, Bewertungen und Fotos beziehen wir über die Google Places API.
        Dafür werden Ihr ungefährer Standort bzw. Ihre Suchanfrage von unseren Servern an
        Google übermittelt, nicht direkt von Ihrem Gerät. Rechtsgrundlage ist die Erfüllung
        des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO). Datenschutzerklärung von Google:{' '}
        <Ext href="https://policies.google.com/privacy" />
      </P>

      <H3>Erinnerungen, Fotos und Community</H3>
      <P>
        Fotos und Notizen, die Sie in Alben speichern, werden in Ihrem Konto gespeichert und
        sind nur für Sie sichtbar, sofern Sie sie nicht teilen. Wenn Sie einen Abend in der
        Community veröffentlichen, Nachrichten senden oder Kontakte hinzufügen, sind diese
        Inhalte für die jeweiligen Empfänger bzw. andere Nutzer sichtbar. Inhalte können
        gemeldet und Nutzer blockiert werden; gemeldete Inhalte prüfen wir.
      </P>

      <H3>Keine Werbung, kein Tracking</H3>
      <P>
        Die App zeigt keine Werbung, verkauft keine Daten und nutzt keine Tracking- oder
        Werbedienste von Drittanbietern.
      </P>

      <H2>3. Die Website unplnd.com</H2>

      <H3>Hosting (Vercel)</H3>
      <P>
        Die Website wird bei der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA
        gehostet. Beim Aufruf werden technische Daten wie IP-Adresse, Browsertyp und Uhrzeit
        verarbeitet, um die Website sicher und schnell bereitzustellen (Art. 6 Abs. 1 lit. f
        DSGVO). Datenschutzerklärung: <Ext href="https://vercel.com/legal/privacy-policy" />
      </P>

      <H3>Vercel Web Analytics</H3>
      <P>
        Die Website nutzt Vercel Web Analytics. Erfasst werden aggregierte Informationen wie
        aufgerufene Seiten, Referrer, Land, Browser- und Gerätetyp, ohne Cookies und ohne
        geräteübergreifende Wiedererkennung (Art. 6 Abs. 1 lit. f DSGVO). Weitere
        Informationen: <Ext href="https://vercel.com/docs/analytics/privacy-policy" />
      </P>

      <H3>Early-Access-Liste</H3>
      <P>
        Wenn Sie sich in die Early-Access-Liste eintragen, speichern wir Ihren Namen und Ihre
        E-Mail-Adresse, um Sie über den Start der App zu informieren (Art. 6 Abs. 1 lit. a
        DSGVO). Sie können Ihre Einwilligung jederzeit per E-Mail widerrufen.
      </P>

      <H3>Schriftarten und externe Links</H3>
      <P>
        Die Schriftart Inter ist lokal eingebunden; es wird keine Verbindung zu Drittanbietern
        hergestellt. Links zu unseren Profilen auf TikTok und Instagram übertragen erst beim
        Anklicken Daten an diese Anbieter.
      </P>

      <H2>4. Dienstleister und Speicherort</H2>
      <P>
        Wir arbeiten mit folgenden Dienstleistern zusammen, die Daten in unserem Auftrag
        bearbeiten:
      </P>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-2">
        <li>
          Supabase Inc. (Datenbank, Anmeldung, Dateispeicher und Server-Funktionen); die Daten
          werden in einem Rechenzentrum in Frankfurt am Main (EU) gespeichert.{' '}
          <Ext href="https://supabase.com/privacy" />
        </li>
        <li>Google LLC (Gemini API, Places API, Anmeldung mit Google)</li>
        <li>Apple Inc. (App Store, Anmeldung mit Apple)</li>
        <li>Vercel Inc. (Hosting der Website)</li>
      </ul>
      <P>
        Einige dieser Anbieter haben ihren Sitz in den USA. Eine Übermittlung dorthin erfolgt
        auf Grundlage des EU-US- bzw. Swiss-US Data Privacy Framework, soweit der Anbieter
        zertifiziert ist, oder auf Grundlage von Standardvertragsklauseln.
      </P>

      <H2>5. Speicherdauer</H2>
      <P>
        Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck
        nötig ist. Kontodaten und Inhalte speichern wir, bis Sie Ihr Konto löschen.
        Gesetzliche Aufbewahrungspflichten bleiben unberührt.
      </P>

      <H2>6. Ihre Rechte</H2>
      <P>
        Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, auf Berichtigung,
        Löschung und Einschränkung der Bearbeitung, auf Datenübertragbarkeit sowie das Recht,
        der Bearbeitung zu widersprechen (Art. 21 DSGVO). Erteilte Einwilligungen können Sie
        jederzeit für die Zukunft widerrufen. Schreiben Sie uns dazu einfach an{' '}
        {CONTACT_EMAIL}.
      </P>
      <P>
        Sie haben ausserdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
        beschweren, in der Schweiz beim Eidgenössischen Datenschutz- und
        Öffentlichkeitsbeauftragten (EDÖB), in der EU bei der Aufsichtsbehörde Ihres
        Wohnsitzes.
      </P>

      <H2>7. Datensicherheit</H2>
      <P>
        Alle Verbindungen zwischen App, Website und unseren Servern sind verschlüsselt
        (TLS). Der Zugriff auf Ihre Daten ist technisch so eingeschränkt, dass jeder Nutzer
        nur seine eigenen bzw. für ihn freigegebenen Daten sehen kann.
      </P>

      <P>
        <span className="mt-8 block text-[13.5px] text-ink-2">Stand: November 2026</span>
      </P>
    </>
  );
}
