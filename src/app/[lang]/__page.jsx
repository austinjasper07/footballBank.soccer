import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Play, ShieldCheck, Globe2, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroPlayer from "@/assets/hero-player.jpg";
import player1 from "@/assets/player-1.jpg";
import player2 from "@/assets/player-2.jpg";
import player3 from "@/assets/player-3.jpg";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FootballBank International — Football Talent Representation" },
      {
        name: "description",
        content:
          "FootballBank International identifies, represents and positions football talent for opportunities with clubs and football organizations worldwide.",
      },
      { property: "og:title", content: "FootballBank International — Football Talent Representation" },
      {
        property: "og:description",
        content:
          "FIFA-licensed representation, player identification and club-focused recruitment across international markets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = ["Home", "About", "Players", "Clubs & Scouts", "Representation", "Contact"];

const ASSURANCES = [
  { icon: ShieldCheck, label: "FIFA-licensed representation" },
  { icon: Globe2, label: "International perspective" },
  { icon: Target, label: "Club-focused recruitment" },
];

const PLAYERS = [
  {
    name: "Freedom Marvellous",
    position: "Centre back",
    origin: "RB · Nigeria",
    foot: "Right foot",
    image: player1,
  },
  {
    name: "Dada Elisha",
    position: "Striker",
    origin: "ST · Nigeria",
    foot: "Right foot",
    image: player2,
  },
  {
    name: "Olaiya Dada",
    position: "Winger",
    origin: "LW · Nigeria",
    foot: "Left foot",
    image: player3,
  },
];

const BRIEF_STEPS = [
  { n: "01", title: "Define the requirement", copy: "Position, playing level, timing and budget." },
  {
    n: "02",
    title: "Review relevant profiles",
    copy: "Football information and footage matched to your brief.",
  },
  {
    n: "03",
    title: "Coordinate the next step",
    copy: "Verified enquiries and communication through FootballBank.",
  },
];

const DIRECTION = [
  {
    n: "01",
    title: "Player representation",
    copy: "A considered approach to career decisions, opportunities and representation.",
  },
  {
    n: "02",
    title: "Talent identification",
    copy: "Football profiles and footage assessed in the context of the next sporting step.",
  },
  {
    n: "03",
    title: "Club recruitment",
    copy: "Targeted player profiles shaped around your club's recruitment brief.",
  },
  {
    n: "04",
    title: "Career development",
    copy: "A long-term perspective on development, progression and the player's goals.",
  },
];



function Index() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <img
          src={heroPlayer}
          alt="Footballer walking on the pitch"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <p className="eyebrow">Representation · Recruitment · Opportunity</p>
          <h1 className="mt-6 max-w-2xl font-heading text-5xl leading-[1.05] text-navy-foreground uppercase sm:text-6xl lg:text-7xl">
            Connecting football talent with{" "}
            <span className="text-accent">global opportunity.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-navy-foreground/70">
            FootballBank International identifies, represents and positions football talent for
            opportunities with clubs and football organizations across international markets.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="action" size="lg">
              View players <ArrowUpRight />
            </Button>
            <Button variant="onNavy" size="lg">
              Request a player <ArrowUpRight />
            </Button>
          </div>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-xs text-navy-foreground/60 transition-colors hover:text-accent"
          >
            Seeking representation? <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="relative border-t border-navy-foreground/10 bg-navy/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-[0.65rem] tracking-[0.18em] text-navy-foreground/50 uppercase">
            <span>FootballBank International / Talent in focus</span>
            <span className="hidden items-center gap-2 sm:flex">
              Shola Mufta · Winger <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* Assurance strip */}
      <section className="bg-navy-soft">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-5 text-navy-foreground/80 sm:grid-cols-2 lg:grid-cols-4">
          {ASSURANCES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-xs">
              <Icon className="h-4 w-4 text-accent" />
              {label}
            </div>
          ))}
          <div className="text-xs text-navy-foreground/60 lg:text-right">
            New Jersey, United States
          </div>
        </div>
      </section>

      {/* Players */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="eyebrow">The player collection</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-4xl uppercase">Talent worth a closer look.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Individual profiles. Relevant football information. A direct conversation with
              FootballBank.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Explore all players <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLAYERS.map((p) => (
            <article
              key={p.name}
              className="group overflow-hidden rounded-lg border border-divider bg-card"
            >
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  width={800}
                  height={900}
                  loading="lazy"
                  className="h-72 w-full object-cover"
                />
                <span className="absolute top-4 left-4 rounded-sm bg-navy/90 px-2.5 py-1 text-[0.6rem] tracking-[0.18em] text-navy-foreground uppercase">
                  {p.position}
                </span>
                <span className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-transform group-hover:-translate-y-1">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              
              <div className="p-6">
                <p className="text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
                  {p.origin}
                </p>
                <h3 className="mt-2 font-heading text-2xl">{p.name}</h3>
                <div className="mt-4 grid grid-cols-3 gap-2 rule-divider pt-4 text-[0.7rem] text-muted-foreground">
                  <span>Age</span>
                  <span>Height</span>
                  <span>{p.foot}</span>
                </div>
                <p className="mt-2 text-[0.7rem] text-muted-foreground">
                  Club &amp; availability on confirmation
                </p>
                <div className="mt-6 flex items-center justify-between rule-divider pt-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    View profile <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                    <Play className="h-3.5 w-3.5" /> Watch highlights
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-[0.7rem] text-muted-foreground">
          Preview records use supplied footage. Detailed club information pending confirmation.
        </p>
      </section>

      {/* Recruitment brief */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow">For clubs &amp; scouts</p>
            <h2 className="mt-5 font-heading text-4xl leading-tight uppercase">
              Your recruitment brief.
              <br />
              Our starting point.
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              Tell us what you need. We'll identify the right profile, coordinate the conversation
              and keep your sporting requirements at the centre.
            </p>
            <Button variant="action" size="lg" className="mt-8">
              Recruit with FootballBank
            </Button>
          </div>
          <div>
            {BRIEF_STEPS.map((s) => (
              <div
                key={s.n}
                className="flex items-start justify-between gap-6 border-b border-divider py-6 first:border-t"
              >
                <div className="flex gap-5">
                  <span className="font-heading text-xs text-accent-strong">{s.n}</span>
                  <div>
                    <h3 className="text-base font-medium">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.copy}</p>
                  </div>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direction */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="eyebrow">Beyond the highlight reel</p>
        <h2 className="mt-5 font-heading text-4xl uppercase">A career deserves a clear direction.</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {DIRECTION.map((d) => (
            <div key={d.n} className="rule-divider pt-5">
              <span className="text-[0.7rem] text-muted-foreground">{d.n}</span>
              <h3 className="mt-6 text-base font-medium">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="bg-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <img
            src={founder}
            alt="Ayodeji Fatade, founder of FootballBank International"
            width={1008}
            height={1104}
            loading="lazy"
            className="h-[28rem] w-full rounded-lg object-cover"
          />
          <div>
            <p className="eyebrow">The people behind the pathway</p>
            <h2 className="mt-5 font-heading text-4xl leading-tight text-navy-foreground uppercase">
              Licensed representation.
              <br />
              <span className="text-accent">Personal commitment.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-navy-foreground/70">
              Ayodeji Fatade is a United States-based FIFA-licensed football agent and the founder of
              FootballBank International, focused on player representation, career development and
              international football opportunities.
            </p>
            <p className="mt-8 font-heading text-lg text-navy-foreground">Ayodeji Fatade</p>
            <p className="text-xs text-navy-foreground/60">
              Founder · FIFA-licensed Football Agent
            </p>
            <Button variant="onNavy" size="lg" className="mt-7">
              Meet your representative <ArrowUpRight />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-soft">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">The next conversation matters</p>
            <h2 className="mt-5 font-heading text-4xl leading-tight text-navy-foreground uppercase">
              The right talent.
              <br />
              The right opportunity.
            </h2>
          </div>
          <div>
            <p className="text-sm text-navy-foreground/70">
              Recruiting for a club or ready for the next step in your career? Start with
              FootballBank.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="action" size="lg">
                Request a player <ArrowUpRight />
              </Button>
              <Button variant="onNavy" size="lg">
                Seek representation <ArrowUpRight />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
