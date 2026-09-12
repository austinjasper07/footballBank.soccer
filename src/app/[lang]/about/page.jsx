import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

const defaultServices = [
  { title: "Player representation", description: "Licensed representation and career support for professional and developing players." },
  { title: "Talent identification", description: "Player identification, assessment and profiling according to sporting requirements." },
  { title: "Club services & recruitment", description: "Targeted recruitment, player sourcing and football management support for clubs." },
  { title: "Football partnerships", description: "Structured relationships with clubs, academies and football organizations across international markets." },
];

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] sm:mb-5 sm:text-[11px] sm:tracking-[0.16em] ${dark ? "text-[#d7b25c]" : "text-blue-600"}`}>
      <span className="h-px w-4 bg-[#d7b25c]" />
      {children}
    </p>
  );
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict?.aboutPageContent;
  const services = content?.services || defaultServices;
  const mission = content?.mission ||
    "To connect football talent and organizations with credible opportunities through professional sports management, talent development, recruitment and international partnerships.";
  const vision = content?.vision ||
    "To build FootballBank into a trusted international football management platform connecting players, clubs and opportunities across global markets.";

  return (
    <div className="overflow-hidden bg-white text-[#0b1220]">
      <section className="bg-[#f2f5fa]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <Eyebrow>{dict.about?.badge || "About FootballBank"}</Eyebrow>
          <h1 className="max-w-3xl font-(family-name:--font-oswald) text-[2rem] font-semibold leading-[1.02] tracking-tight sm:text-4xl lg:text-5xl" dangerouslySetInnerHTML={{ __html: content?.heroTitle || "Football ambition. International <span class=\"block\">perspective.</span>" }} />
          <p className="mt-5 max-w-xl text-[0.9375rem] leading-7 text-slate-600 sm:mt-6 sm:text-[1.0625rem]">
            {content?.heroSubtitle || "FootballBank International is a sports management company connecting player development, licensed representation, club recruitment and football partnerships across international markets."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:gap-10 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
        <div>
          <h2 className="max-w-md font-(family-name:--font-oswald) text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl" dangerouslySetInnerHTML={{ __html: content?.directionTitle || "Talent is the beginning.<br />Direction makes the difference." }} />
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-7 text-slate-600 sm:mt-5 sm:text-base">{content?.directionParagraph1 || "FootballBank International was created to connect football talent, clubs and opportunity through a structured, relationship-led approach. We work with players seeking career direction and football organizations seeking talent, representation and international market access."}</p>
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-7 text-slate-600 sm:mt-5 sm:text-base">{content?.directionParagraph2 || "Based in New Jersey, United States, FootballBank operates across international football markets through relationships with players, clubs, academies and football professionals."}</p>
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-7 text-slate-600 sm:mt-5 sm:text-base">{content?.directionParagraph3 || "Where an activity requires a licensed football agent, those services are performed by FIFA Licensed Football Agent Ayodeji Michael .F."}</p>
          <Link href={`/${lang}/agent`} className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:mt-7 sm:w-auto">
            {content?.representationApproach || "Our representation approach"} <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="relative hidden aspect-4/3 overflow-hidden bg-slate-200 md:inline-block">
          <img src="/heroPhotos/WhatsApp Image 2025-10-07 at 23.49.32_5d88ced2.jpg" alt="FootballBank football business setting" className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="bg-[#f2f5fa]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <Eyebrow>{content?.purposeEyebrow || "Our purpose"}</Eyebrow>
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="font-(family-name:--font-oswald) text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl">{content?.ourMission || "Our mission"}</h2>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-7 text-slate-600 sm:mt-4 sm:text-base">{mission}</p>
            </div>
            <div>
              <h2 className="font-(family-name:--font-oswald) text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl">{content?.ourVision || "Our vision"}</h2>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-7 text-slate-600 sm:mt-4 sm:text-base">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
        <Eyebrow>{content?.whatWeDoEyebrow || "What we do"}</Eyebrow>
        <h2 className="font-(family-name:--font-oswald) text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl">{content?.whatWeDoTitle || "A connected approach."}</h2>
        <div className="mt-7 grid gap-7 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {services.map((service, index) => (
            <article key={service.title} className="border-t border-slate-200 pt-5">
              <p className="text-[10px] font-medium text-slate-400">0{index + 1}</p>
              <h3 className="mt-4 text-base font-semibold leading-6 tracking-tight sm:mt-5 sm:text-lg">{service.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-7 text-slate-600 sm:mt-3 sm:text-base">{service.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-3 border-t border-slate-200 pt-5 text-[0.9375rem] font-semibold leading-6 sm:mt-10 sm:grid-cols-3 sm:gap-4 sm:pt-6 sm:text-base">
          <p>{content?.pillars?.communication || "Integrity in communication."}</p><p>{content?.pillars?.representation || "Care in representation."}</p><p>{content?.pillars?.development || "Purpose in development."}</p>
        </div>
      </section>

      <section className="bg-secondary-bg text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:gap-10 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-end lg:px-12 lg:py-20">
          <div>
            <Eyebrow dark>{content?.ctaEyebrow || "The next conversation matters"}</Eyebrow>
            <h2 className="font-(family-name:--font-oswald) text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl" dangerouslySetInnerHTML={{ __html: content?.ctaTitle || "The right talent.<br />The right opportunity." }} />
          </div>
          <div>
            <p className="max-w-md text-[0.9375rem] leading-7 text-slate-200 sm:text-base">{content?.ctaSubtitle || "Recruiting for a club or ready for the next step in your career? Start with FootballBank."}</p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
              <Link href={`/${lang}/submit-profile`} className="inline-flex w-full items-center justify-center gap-3 bg-blue-600 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-blue-500 sm:w-auto sm:gap-5">{content?.ctaRequestPlayer || "Request a Player"} <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              <Link href={`/${lang}/contact`} className="inline-flex w-full items-center justify-center gap-3 border border-white/60 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto sm:gap-5">{content?.ctaSeekRepresentation || "Seek Representation"}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
