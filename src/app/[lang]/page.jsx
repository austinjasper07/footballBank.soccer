import Image from "next/image";
import Link from "next/link";
import "aos/dist/aos.css";
import { getFeaturedPlayers, getFeaturedPosts } from "@/actions/publicActions";
import { getAgentInfo } from "@/actions/adminActions";
import { getAuthUser } from "@/lib/oauth";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { formatTimeAgo } from "@/utils/dateHelper";import { ArrowUpRight, Globe2, Play, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: dict.seo.defaultTitle,
    description: dict.seo.defaultDescription,
    keywords: [
      "football talent",
      "soccer players",
      "football scouts",
      "player profiles",
      "football recruitment",
      "soccer talent bank",
      "football opportunities",
      "player showcase",
    ],
    url: "/",
  });
}

const ASSURANCES = [
  { icon: ShieldCheck, label: "FIFA-licensed representation" },
  { icon: Globe2, label: "International perspective" },
  { icon: Target, label: "Club-focused recruitment" },
];

const BRIEF_STEPS = [
  {
    n: "01",
    title: "Define the requirement",
    copy: "Position, playing level, timing and budget.",
  },
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

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  try {
    const user = await getAuthUser();
    // User sync is now handled automatically by the authentication system
  } catch (error) {
    console.error("Error getting user:", error);
  }
  const agentInfo = await getAgentInfo();
  const featuredPosts = await getFeaturedPosts();
  const featuredPlayers = await getFeaturedPlayers();

  const playerOfTheWeek = featuredPlayers.find((p) => p.playerOfTheWeek);
  const today = new Date();
  const age = playerOfTheWeek?.dob
    ? today.getFullYear() - new Date(playerOfTheWeek.dob).getFullYear()
    : "N/A";

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* HERO SECTION */}
      {/* <div className="relative min-h-[calc(100vh+100px)] md:h-[calc(100vh+100px)] w-full overflow-hidden pt-8 pb-16 lg:pb-2 lg:pt-0 px-6 lg:px-12 flex flex-col lg:flex-row justify-between gap-12 items-center"> */}
      {/* Background Carousel */}
      {/* <HeroBackground /> */}

      {/* LEFT CONTENT */}
      {/* <section className="relative z-10 w-full lg:w-[50%] h-full flex items-center justify-center lg:justify-start text-center lg:text-left">
          <div className="max-w-2xl space-y-6 h-1/2">
            <p
              className="uppercase tracking-widest text-primary-accent font-semibold text-sm md:text-base"
              data-aos="fade-up"
            >
              {dict.homepage.hero.eyebrow || "FootballBank International"}
            </p>
            <h1
              className="font-bold text-[clamp(2.5rem,3.5vw,4rem)] leading-tight tracking-tight text-white drop-shadow-lg"
              data-aos="fade-up"
            >
              {dict.homepage.hero.title
                .split(dict.homepage.hero.titleHighlight)
                .map((part, index) => (
                  <span key={index}>
                    {part}
                    {index <
                      dict.homepage.hero.title.split(
                        dict.homepage.hero.titleHighlight,
                      ).length -
                        1 && (
                      <span className="text-primary-accent">
                        {dict.homepage.hero.titleHighlight}
                      </span>
                    )}
                  </span>
                ))}
            </h1>
            <p
              className="text-white/90 text-[clamp(1rem,2.5vw,1.25rem)] drop-shadow-md"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {dict.homepage.hero.subtitle}
            </p>
            <div
              className=" flex sm:flex-row gap-2 md:gap-4 justify-center lg:justify-start pt-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Link href={`/${lang}/submit-profile`}>
                <span className="text-nowrap bg-primary-action text-white text-sm md:text-base px-2 sm:px-4 py-2 md:px-6 md:py-3 rounded-md font-medium text-center transition-all hover:bg-primary-action-hover shadow-lg">
                  {dict.homepage.hero.submitProfile}
                </span>
              </Link>
              <Link href={`/${lang}/players`}>
                <span className="text-nowrap border-2 border-primary-action text-primary-action text-sm md:text-base px-2 sm:px-4 py-2 md:px-6 md:py-3 rounded-md font-medium text-center transition hover:bg-primary-action hover:text-white hover:border-primary-action shadow-sm">
                  {dict.homepage.hero.browsePlayers}
                </span>
              </Link>
            </div>
          </div>
        </section> */}

      {/* PLAYER OF THE WEEK */}

      {/* {playerOfTheWeek && (
          <section
            className="w-full lg:w-1/2 flex items-center justify-center"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <Link href={`/${lang}/players/${playerOfTheWeek.id}`}>
              <div className="group relative w-full max-w-sm lg:max-w-md bg-primary-navy/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-primary-accent/20 hover:border-primary-accent/40 transition-all duration-300 transform hover:scale-105">
                <div className="absolute top-4 right-4 z-20 bg-linear-to-r from-primary-accent to-amber-500 text-primary-text px-3 py-1 text-xs sm:text-sm font-semibold rounded-full shadow-lg">
                  {dict.homepage.hero.starOnTheRise}
                </div>

                <div className="relative">
                  <Image
                    src={playerOfTheWeek?.imageUrl?.[0] || "/placeholder.jpg"}
                    alt={`${playerOfTheWeek?.firstName} ${playerOfTheWeek?.lastName}`}
                    width={500}
                    height={400}
                    className="object-cover w-full h-56 sm:h-56 lg:h-80"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {playerOfTheWeek?.firstName} {playerOfTheWeek?.lastName}
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-2backdrop-blur-sm">
                      <div className="text-primary-accent text-xs sm:text-sm font-medium mb-1">
                        {dict.playerProfile.position}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {playerOfTheWeek?.position}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-primary-accent text-xs sm:text-sm font-medium mb-1">
                        {dict.playerProfile.age}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {age}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-primary-accent text-xs sm:text-sm font-medium mb-1">
                        {dict.playerProfile.foot}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {playerOfTheWeek?.foot}
                      </div>
                    </div>
                  </div>

                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                    {playerOfTheWeek?.description ||
                      dict.pricing.playerOfTheWeek.description}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center text-white text-xs sm:text-sm font-medium group-hover:text-primary-accent transition-colors">
                      {dict.pricing.playerOfTheWeek.viewProfile}
                      <svg
                        className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )} */}
      {/* </div> */}

      <section className="relative overflow-hidden bg-navy">
        <img
          src="/hero-player.jpg"
          alt="Footballer walking on the pitch"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary-navy via-primary-navy/85 to-primary-navy/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <p className="eyebrow">Representation · Recruitment · Opportunity</p>
          <h1 className="mt-6 max-w-2xl font-heading text-5xl leading-[1.05] text-primary-text-inverse uppercase sm:text-6xl lg:text-7xl">
            Connecting football talent with{" "}
            <span className="text-primary-accent">global opportunity.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-primary-text-inverse/70">
            FootballBank International identifies, represents and positions
            football talent for opportunities with clubs and football
            organizations across international markets.
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
            className="mt-8 inline-flex items-center gap-2 text-xs text-primary-text-inverse/60 transition-colors hover:text-primary-accent"
          >
            Seeking representation? <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="relative border-t border-primary-text-inverse/10 bg-primary-navy/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-[0.65rem] tracking-[0.18em] text-primary-text-inverse/50 uppercase">
            <span>FootballBank International / Talent in focus</span>
            <span className="hidden items-center gap-2 sm:flex">
              Shola Mufta · Winger <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* Assurance strip */}
      <section className="bg-secondary-bg">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-5 text-primary-text-inverse/80 sm:grid-cols-2 lg:grid-cols-4">
          {ASSURANCES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-xs">
              <Icon className="h-4 w-4 text-primary-accent" />
              {label}
            </div>
          ))}
          <div className="text-xs text-primary-text-inverse/60 lg:text-right">
            New Jersey, United States
          </div>
        </div>
      </section>

      <div className="w-full">
        {/* WHY FOOTBALLBANK */}
        {/* <section className="py-16 bg-primary-surface ">
          <div
            className="max-w-7xl mx-auto text-center px-4"
            data-aos="fade-up"
          >
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold  text-primary-text mb-4">
              {dict.homepage.whyFootballBank.title}
            </h2>
            <div className="w-24 h-1 bg-primary-accent mx-auto mb-10" />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "fa-certificate",
                  title: dict.homepage.whyFootballBank.fifaCertified.title,
                  desc: dict.homepage.whyFootballBank.fifaCertified.description,
                },
                {
                  icon: "fa-globe",
                  title: dict.homepage.whyFootballBank.globalNetwork.title,
                  desc: dict.homepage.whyFootballBank.globalNetwork.description,
                },
                {
                  icon: "fa-bolt",
                  title: dict.homepage.whyFootballBank.rapidVisibility.title,
                  desc: dict.homepage.whyFootballBank.rapidVisibility
                    .description,
                },
              ].map(({ icon, title, desc }, i) => (
                <div
                  key={title}
                  className="bg-white p-8 rounded-xl shadow-sm border border-divider text-center hover:shadow-md transition-all group"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  <div className="w-16 h-16 bg-primary-navy rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-action transition-colors">
                    <i
                      className={`fa-solid ${icon} text-primary-accent text-2xl`}
                    />
                  </div>
                  <h3 className="text-xl  font-semibold text-primary-text mb-4">
                    {title}
                  </h3>
                  <p className="text-primary-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* FEATURED PLAYERS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="eyebrow">The player collection</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-4xl uppercase">
                Talent worth a closer look.
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
                Individual profiles. Relevant football information. A direct
                conversation with FootballBank.
              </p>
            </div>
            <Link
              href={`/${lang}/players`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-action hover:underline"
            >
              Explore all players <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredPlayers.map((player, index) => (
              <article
                key={player.id}
                className="group overflow-hidden rounded-lg border border-divider bg-primary-card"
              >
                <div className="relative">
                  <Image
                    src={player.imageUrl[0]}
                    alt={player.firstName}
                    width={800}
                    height={900}
                    loading="lazy"
                    className="h-72 w-full object-cover"
                  />
                  <span className="absolute top-4 left-4 rounded-sm bg-primary-navy/90 px-2.5 py-1 text-[0.6rem] tracking-[0.18em] text-primary-text-inverse uppercase">
                    {player.position}
                  </span>
                  <span className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary-card text-primary-text transition-transform group-hover:-translate-y-1">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-[0.6rem] tracking-[0.18em] text-primary-muted uppercase">
                    {player.country}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl">
                    {player.firstName} {player.lastName}
                  </h3>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-divider pt-4 text-[0.7rem] text-primary-muted">
                    <span>
                      Age:{" "}
                      {player.dob
                        ? new Date().getFullYear() -
                          new Date(player.dob).getFullYear()
                        : "N/A"}
                    </span>
                    {player.foot && (
                        <span>
                          Foot: {" "}
                        {player.foot}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[0.7rem] text-primary-muted">
                    Club &amp; availability on confirmation
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-divider pt-4">
                    <Link
                      href={`/${lang}/players/${player.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-action hover:underline"
                    >
                      {dict.homepage.featuredPlayers.viewProfile}{" "}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary-text">
                      <Play className="h-3.5 w-3.5" /> Watch highlights
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-[0.7rem] text-muted-foreground">
            Preview records use supplied footage. Detailed club information
            pending confirmation.
          </p>
        </section>

        {/* Recruitment brief */}
        <section className="bg-secondary-bg-alt">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2">
            <div>
              <p className="eyebrow">For clubs &amp; scouts</p>
              <h2 className="mt-5 font-heading text-4xl leading-tight uppercase">
                Your recruitment brief.
                <br />
                Our starting point.
              </h2>
              <p className="mt-5 max-w-md text-sm text-primary-muted">
                Tell us what you need. We'll identify the right profile,
                coordinate the conversation and keep your sporting requirements
                at the centre.
              </p>
              <Button variant="default" size="lg" className="mt-8 ">
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
                    <span className="font-heading text-xs text-primary-accent-strong">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-base font-medium">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-primary-muted">
                        {s.copy}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 text-primary-muted" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section className="py-16 " id="blog">
          <div
            className="max-w-7xl mx-auto px-4 text-center"
            data-aos="fade-up"
          >
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold mb-4 text-primary-text">
              {dict.homepage.blog.title}
            </h2>
            <div className="w-24 h-1 bg-primary-accent mx-auto mb-4" />

            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-end items-center mb-4 px-4 sm:px-6 lg:px-8 xl:px-12">
                <Link
                  href={`/${lang}/blog`}
                  className="group inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-primary-navy/5 backdrop-blur-sm border border-primary-navy/10 rounded-xl text-primary-action hover:bg-primary-navy/10 hover:border-primary-navy/20 transition-all duration-300"
                >
                  <span className="font-semibold text-sm lg:text-base">
                    {dict.homepage.blog.visitBlog}
                  </span>
                  <svg
                    className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
              <div
                className="text-left grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4 py-4 sm:px-6 lg:px-8 xl:px-12"
                data-aos="fade-up"
              >
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-primary-surface rounded-xl shadow hover:shadow-md transition"
                    data-aos="fade-up"
                  >
                    <Image
                      src={
                        post.imageUrl &&
                        post.imageUrl.length > 0 &&
                        post.imageUrl[0]
                          ? post.imageUrl[0]
                          : "/logo/logo-1.png"
                      }
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="text-sm text-primary-muted mb-2">
                        {formatTimeAgo(post.createdAt)}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-primary-text">
                        {post.title}
                      </h3>
                      <p className="text-sm text-primary-muted mb-4 line-clamp-3">
                        {post.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                      </p>
                      <Link href={`/${lang}/blog/${post.id}`}>
                        <span className="text-primary-action hover:underline text-sm font-medium">
                          {dict.homepage.blog.readMore}
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-10 flex justify-end"></div>
          </div>
        </section>

        {/* Direction */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="eyebrow">Beyond the highlight reel</p>
          <h2 className="mt-5 font-heading text-4xl uppercase">
            A career deserves a clear direction.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {DIRECTION.map((d) => (
              <div key={d.n} className="rule-divider pt-5">
                <span className="text-[0.7rem] text-primary-muted">
                  {d.n}
                </span>
                <h3 className="mt-6 text-base font-medium">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-muted">
                  {d.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="bg-primary-navy">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
            <img
              src={agentInfo?.profilePhoto || "/FootballBank_agent.jpg"}
              alt={
                agentInfo?.name ||
                "Ayodeji Fatade, founder of FootballBank International"
              }
              width={1008}
              height={1104}
              loading="lazy"
              className="h-112 w-full rounded-lg object-cover"
            />
            <div>
              <p className="eyebrow">The people behind the pathway</p>
              <h2 className="mt-5 font-heading text-4xl leading-tight text-primary-text-inverse uppercase">
                Licensed representation.
                <br />
                <span className="text-primary-accent">Personal commitment.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-text-inverse/70">
                Ayodeji Fatade is a United States-based FIFA-licensed football
                agent and the founder of FootballBank International, focused on
                player representation, career development and international
                football opportunities.
              </p>
              <p className="mt-8 font-heading text-lg text-primary-text-inverse">
                Ayodeji Fatade
              </p>
              <p className="text-xs text-primary-text-inverse/60">
                Founder · FIFA-licensed Football Agent
              </p>
              <Button variant="onNavy" size="lg" className="mt-7">
                Meet your representative <ArrowUpRight />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA SECTION*/}
        <section className="bg-secondary-bg">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">The next conversation matters</p>
              <h2 className="mt-5 font-heading text-4xl leading-tight text-primary-text-inverse uppercase">
                The right talent.
                <br />
                The right opportunity.
              </h2>
            </div>
            <div>
              <p className="text-sm text-primary-text-inverse/70">
                Recruiting for a club or ready for the next step in your career?
                Start with FootballBank.
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
    </div>
  );
}
