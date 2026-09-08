import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const processSteps = [
  {
    title: "Share your brief",
    description: "Tell us the position, playing profile, competition level and timing that matter to your club.",
  },
  {
    title: "We identify talent",
    description: "Our network narrows the search to players who match the sporting and practical requirements.",
  },
  {
    title: "Review relevant files",
    description: "Receive focused profiles, footage and the context required to make an informed decision.",
  },
  {
    title: "Move the conversation forward",
    description: "A dedicated representative coordinates the next steps with discretion and clarity.",
  },
];

function Eyebrow({ children, inverse = false }) {
  return (
    <p className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em] ${inverse ? "text-primary-accent" : "text-primary-action"}`}>
      <span className="h-px w-4 bg-primary-accent" />
      {children}
    </p>
  );
}

export const metadata = {
  title: "Clubs & Scouts | FootballBank",
  description: "Focused football recruitment support for clubs and scouts.",
};


export default async function ClubsAndScoutsPage({ params }) {
  const { lang } = await params;

  return (
    <main className="bg-primary-surface text-primary-text">
      <section className="bg-primary-navy text-primary-text-inverse">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 py-12 sm:gap-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12 lg:py-16">
          <div className="max-w-xl">
            <Eyebrow inverse>For clubs &amp; scouts</Eyebrow>
            <h1 className="mt-6 font-heading text-[2rem] font-semibold leading-[1.02] tracking-tight sm:mt-7 sm:text-5xl lg:text-6xl">
              Tell us what you need. <span className="text-primary-accent">We&apos;ll identify the right profile.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[0.9375rem] leading-7 text-primary-text-inverse/75 sm:mt-6 sm:text-[1.0625rem]">
              A direct pipeline to pre-screened football talent matched to your club&apos;s sporting requirements.
            </p>
            <Link
              href={`/${lang}/contact`}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-primary-action px-5 py-3.5 text-sm font-semibold text-primary-text-inverse transition-colors hover:bg-primary-action-hover sm:mt-8 sm:w-auto sm:gap-5"
            >
              Submit a recruitment brief
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <figure className="mx-auto w-full max-w-xs overflow-hidden border border-primary-text-inverse/20 bg-primary-action sm:max-w-sm lg:max-w-md">
            <div className="relative aspect-4/3">
              <Image
                src="/vecteezy_abstract-soccer-player-kicking-the-ball-on-blue-background_14466429.jpg"
                alt="Football player preparing to strike the ball"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="bg-primary-navy px-5 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-text-inverse/80">
              The requirement comes first.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
        <Eyebrow>A focused recruitment process</Eyebrow>
        <div className="mt-7 grid gap-7 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {processSteps.map((step, index) => (
            <article key={step.title} className="border-t border-divider pt-5">
              <p className="text-xs font-medium text-primary-muted">0{index + 1}</p>
              <h2 className="mt-4 text-base font-semibold leading-6 tracking-tight sm:mt-5 sm:text-xl">{step.title}</h2>
              <p className="mt-2 text-[0.9375rem] leading-7 text-primary-muted sm:mt-3 sm:text-base">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-11 grid gap-8 border-t border-divider pt-9 sm:mt-14 sm:gap-9 sm:pt-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="max-w-md font-heading text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl">
              Relevant files. <br />Coordinated conversations.
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-7 text-primary-muted sm:mt-5 sm:text-base">
              Receive targeted player profiles based on your recruitment brief. Representation status is verified before player information is presented to clubs.
            </p>
          </div>
          <div className="self-end">
            <p className="max-w-lg text-[0.9375rem] leading-7 text-primary-muted sm:text-base">
              A dedicated FootballBank representative coordinates communication throughout the recruitment process.
            </p>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-7 text-primary-muted sm:mt-5 sm:text-base">
              Full files and sensitive information are shared privately after the club or scout enquiry has been reviewed.
            </p>
            <Link
              href={`/${lang}/players`}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 border border-primary-text px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-text hover:text-primary-text-inverse sm:mt-7 sm:w-auto sm:gap-5"
            >
              Browse the player collection
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary-bg text-primary-text-inverse">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-11 sm:gap-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:items-end lg:px-12 lg:py-16">
          <div>
            <Eyebrow inverse>The next conversation matters</Eyebrow>
            <h2 className="mt-6 max-w-md font-heading text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:mt-7 sm:text-4xl">
              The right talent. <br />The right opportunity.
            </h2>
          </div>
          <div>
            <p className="max-w-md text-[0.9375rem] leading-7 text-primary-text-inverse/75 sm:text-base">
              Recruiting for a club or ready for the next step in your career? Start with FootballBank.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <Link href={`/${lang}/submit-profile`} className="inline-flex w-full items-center justify-center gap-3 bg-primary-action px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-action-hover sm:w-auto sm:gap-5">
                Request a player <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href={`/${lang}/contact`} className="inline-flex w-full items-center justify-center gap-3 border border-primary-text-inverse/70 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-text-inverse hover:text-secondary-bg sm:w-auto sm:gap-5">
                Seek representation <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
