import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";

const defaultProcessSteps = [
  {
    title: "Share your brief",
    description:
      "Tell us the position, playing profile, competition level and timing that matter to your club.",
  },
  {
    title: "We identify talent",
    description:
      "Our network narrows the search to players who match the sporting and practical requirements.",
  },
  {
    title: "Review relevant files",
    description:
      "Receive focused profiles, footage and the context required to make an informed decision.",
  },
  {
    title: "Move the conversation forward",
    description:
      "A dedicated representative coordinates the next steps with discretion and clarity.",
  },
];

const defaultBusinessServices = [
  {
    title: "Player recruitment",
    description:
      "Targeted identification and presentation of players according to a club's sporting and financial requirements.",
  },
  {
    title: "Club representation",
    description:
      "Support under agreed club mandates involving appropriate football representation and international opportunities.",
  },
  {
    title: "Talent identification",
    description:
      "Access to assessed player profiles, footage and relevant football information.",
  },
  {
    title: "International partnerships",
    description:
      "Relationships connecting clubs, academies, players and football opportunities across markets.",
  },
];

function Eyebrow({ children, inverse = false }) {
  return (
    <p
      className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em] ${inverse ? "text-primary-accent" : "text-primary-action"}`}
    >
      <span className="h-px w-4 bg-primary-accent" />
      {children}
    </p>
  );
}

export const metadata = {
  title: "Clubs & Partners | FootballBank International",
  description:
    "Recruitment, representation, talent access and international opportunity for clubs and football organizations.",
};

export default async function ClubsAndScoutsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict?.clubsScoutsPage;
  const processSteps = page?.processSteps || defaultProcessSteps;
  const businessServices = page?.businessServices || defaultBusinessServices;

  return (
    <main className="bg-primary-surface text-primary-text">
      <section className="bg-primary-navy text-primary-text-inverse">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 py-12 sm:gap-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12 lg:py-16">
          <div className="max-w-xl">
            <Eyebrow inverse>{page?.eyebrow || "Clubs & partners"}</Eyebrow>
            <h1 className="mt-6 font-heading text-[2rem] font-semibold leading-[1.02] tracking-tight sm:mt-7 sm:text-5xl lg:text-6xl">
              {page?.heroTitle || "Built to work with clubs."}
            </h1>
            <p className="mt-5 max-w-lg text-[0.9375rem] leading-7 text-primary-text-inverse/75 sm:mt-6 sm:text-[1.0625rem]">
              {page?.heroSubtitle || "Recruitment. Representation. Talent access. International opportunity."}
            </p>
            <div className="w-full mt-10 flex flex-wrap gap-3">
              <Button
                variant=""
                size="lg"
                asChild
                className="w-full px-5 sm:w-auto sm:px-8"
              >
                <Link href={`/${lang}/players`}>
                  {page?.requestPlayer || "Request a player"}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                variant="onNavy"
                size="lg"
                asChild
                className="w-full px-5 sm:w-auto sm:px-8"
              >
                <Link href={`/${lang}/contact`}>
                  {page?.discussPartnership || "Discuss a Partnership"}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
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
              {page?.heroCaption ||
                "FootballBank International works with football clubs and organizations seeking structured support in player recruitment, talent identification, football partnerships and international market opportunities."}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-secondary-bg-alt">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          <Eyebrow>{page?.howWeWork || "How we work"}</Eyebrow>
          <div className="mt-5 grid gap-6 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="border-t border-divider pt-5"
              >
                <p className="text-xs font-medium text-primary-muted">
                  0{index + 1}
                </p>
                <h2 className="mt-4 text-base font-semibold leading-6 tracking-tight sm:mt-5 sm:text-xl">
                  {step.title}
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-7 text-primary-muted sm:mt-3 sm:text-base">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <Eyebrow>{page?.businessServicesEyebrow || "Business services"}</Eyebrow>
        <h2 className="max-w-xl font-heading text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl mt-5">
          {page?.businessServicesTitle || "Focused support for clubs and partners."}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {businessServices.map((service, index) => (
            <article
              key={service.title}
              className="border-t border-divider pt-5"
            >
              <p className="text-xs font-medium text-primary-muted">
                0{index + 1}
              </p>
              <h3 className="mt-4 text-base font-semibold leading-6 tracking-tight sm:text-lg">
                {service.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-7 text-primary-muted sm:text-base">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-10 sm:py-6 lg:px-12 lg:py-14">
        <div className="mt-7 grid gap-6 border-t border-divider pt-7 sm:mt-8 sm:gap-7 sm:pt-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="max-w-md font-heading text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:text-4xl">
              {page?.filesTitle || "Relevant files. Coordinated conversations."}
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-7 text-primary-muted sm:mt-5 sm:text-base">
              {page?.filesDescription ||
                "Receive targeted player profiles based on your recruitment brief. Representation status is verified before player information is presented to clubs."}
            </p>
          </div>
          <div className="self-end">
            <p className="max-w-lg text-[0.9375rem] leading-7 text-primary-muted sm:text-base">
              {page?.coordinatorText ||
                "A dedicated FootballBank representative coordinates communication throughout the recruitment process."}
            </p>
            <p className="mt-4 max-w-lg text-[0.9375rem] leading-7 text-primary-muted sm:mt-5 sm:text-base">
              {page?.privacyText ||
                "Full files and sensitive information are shared privately after the club or scout enquiry has been reviewed."}
            </p>
            <Button asChild size="lg" variant="action" className="mt-6">
              <Link href={`/${lang}/players`}>
                {page?.browseCollection || "Browse the player collection"}
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary-bg text-primary-text-inverse">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-10 sm:py-10 lg:grid-cols-2 lg:items-end lg:px-12 lg:py-16">
          <div>
            <Eyebrow inverse>{page?.ctaEyebrow || "The next conversation matters"}</Eyebrow>
            <h2 className="mt-6 max-w-md font-heading text-[1.75rem] font-semibold leading-[1.04] tracking-tight sm:mt-7 sm:text-4xl">
              {page?.ctaTitle || "The right talent. The right opportunity."}
            </h2>
          </div>
          <div>
            <p className="max-w-md text-[0.9375rem] leading-7 text-primary-text-inverse/75 sm:text-base">
              {page?.ctaSubtitle ||
                "Recruiting for a club or ready for the next step in your career? Start with FootballBank."}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <Link
                href={`/${lang}/submit-profile`}
                className="inline-flex w-full items-center justify-center gap-3 bg-primary-action px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-action-hover sm:w-auto sm:gap-5"
              >
                {page?.ctaRequestPlayer || "Request a player"}{" "}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex w-full items-center justify-center gap-3 border border-primary-text-inverse/70 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-text-inverse hover:text-secondary-bg sm:w-auto sm:gap-5"
              >
                {page?.ctaSeekRepresentation || "Seek representation"}{" "}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
