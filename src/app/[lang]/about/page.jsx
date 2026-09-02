import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

const services = [
  { title: "Player representation", description: "A considered approach to career decisions, opportunities and representation." },
  { title: "Talent identification", description: "Football profiles and footage assessed in the context of the next sporting step." },
  { title: "Club recruitment", description: "Targeted player profiles shaped around your club's recruitment brief." },
  { title: "Career development", description: "A long-term perspective on development, progression and the player's goals." },
];

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] ${dark ? "text-[#d7b25c]" : "text-blue-600"}`}>
      <span className="h-px w-4 bg-[#d7b25c]" />
      {children}
    </p>
  );
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const mission = dict.about?.missionText || "Identify, represent and position football talent for suitable club and career opportunities.";
  const vision = dict.about?.visionText || "A football pathway where sporting potential is supported by clear information, responsible representation and the right relationships.";

  return (
    <div className="overflow-hidden bg-white text-[#0b1220]">
      <section className="bg-[#f2f5fa]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <Eyebrow>{dict.about?.badge || "About FootballBank"}</Eyebrow>
          <h1 className="max-w-3xl font-(family-name:--font-oswald) text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Football ambition. International <span className="block">perspective.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-[1.0625rem]">
            FootballBank International connects player development, representation and club recruitment through a focused, relationship-led approach.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
        <div>
          <h2 className="max-w-md font-(family-name:--font-oswald) text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">
            Talent is the beginning.<br />Direction makes the difference.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">We identify and present football talent with a clear purpose: helping clubs assess relevant players and helping players make informed career decisions.</p>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Based in New Jersey, United States, FootballBank works across international football markets. Our approach brings football information, footage and personal communication together.</p>
          <Link href={`/${lang}/agent`} className="mt-7 inline-flex items-center gap-5 bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Our representation approach <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="relative aspect-4/3 overflow-hidden bg-slate-200 hidden md:inline-block">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#d8e0e9_0%,#eef2f6_42%,#96aa78_43%,#748e5f_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[43%] border-t border-white/50 bg-emerald-900/15" />
          <div className="absolute inset-0 grid place-items-center bg-slate-950/10 ">
            <span className=" border border-white/70 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">Image placeholder</span>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f5fa]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <Eyebrow>Our purpose</Eyebrow>
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="font-(family-name:--font-oswald) text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">Our mission</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-600">{mission}</p>
            </div>
            <div>
              <h2 className="font-(family-name:--font-oswald) text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">Our vision</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-600">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="font-(family-name:--font-oswald) text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">A connected approach.</h2>
        <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {services.map((service, index) => (
            <article key={service.title} className="border-t border-slate-200 pt-5">
              <p className="text-[10px] font-medium text-slate-400">0{index + 1}</p>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{service.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-4 border-t border-slate-200 pt-6 text-base font-semibold leading-6 sm:grid-cols-3">
          <p>Integrity in communication.</p><p>Care in representation.</p><p>Purpose in development.</p>
        </div>
      </section>

      <section className="bg-secondary-bg text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-end lg:px-12 lg:py-20">
          <div>
            <Eyebrow dark>The next conversation matters</Eyebrow>
            <h2 className="font-(family-name:--font-oswald) text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">The right talent.<br />The right opportunity.</h2>
          </div>
          <div>
            <p className="max-w-md text-base leading-7 text-slate-200">Recruiting for a club or ready for the next step in your career? Start with FootballBank.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${lang}/submit-profile`} className="inline-flex items-center gap-5 bg-blue-600 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-blue-500">Request a Player <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              <Link href={`/${lang}/contact`} className="inline-flex items-center gap-5 border border-white/60 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10">Seek Representation<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
