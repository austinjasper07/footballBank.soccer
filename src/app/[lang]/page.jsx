import Image from "next/image";
import Link from "next/link";
import "aos/dist/aos.css";
import { getFeaturedPlayers, getFeaturedPosts } from "@/actions/publicActions";
import { getAuthUser } from "@/lib/oauth";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { formatTimeAgo } from "@/utils/dateHelper";
import HeroBackground from "@/components/HeroBackground";

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

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  try {
    const user = await getAuthUser();
    // User sync is now handled automatically by the authentication system
  } catch (error) {
    console.error("Error getting user:", error);
  }

  const featuredPosts = await getFeaturedPosts();
  const featuredPlayers = await getFeaturedPlayers();

  const playerOfTheWeek = featuredPlayers.find((p) => p.playerOfTheWeek);
  const today = new Date();
  const age = playerOfTheWeek?.dob
    ? today.getFullYear() - new Date(playerOfTheWeek.dob).getFullYear()
    : "N/A";

  return (
    <div className="">
      {/* HERO SECTION */}
      <div className="relative min-h-[calc(100vh+100px)] md:h-[calc(100vh+100px)] w-full overflow-hidden pt-8 pb-16 lg:pb-2 lg:pt-0 px-6 lg:px-12 flex flex-col lg:flex-row justify-between gap-12 items-center">
        {/* Background Carousel */}
        <HeroBackground />

        {/* LEFT CONTENT */}
        <section className="relative z-10 w-full lg:w-[50%] h-full flex items-center justify-center lg:justify-start text-center lg:text-left">
          <div className="max-w-2xl space-y-6 h-1/2">
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
                        dict.homepage.hero.titleHighlight
                      ).length -
                        1 && (
                      <span className="text-accent-red">
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
              className="flex sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start pt-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Link href={`/${lang}/submit-profile`}>
                <span className="bg-accent-red text-white text-sm md:text-base px-4 py-2 md:px-6 md:py-3 rounded-md font-medium text-center transition-all hover:opacity-90 shadow-lg">
                  {dict.homepage.hero.submitProfile}
                </span>
              </Link>
              <Link href={`/${lang}/players`}>
                <span className="border-2 border-accent-red text-accent-red text-sm md:text-base px-4 py-2 md:px-6 md:py-3 rounded-md font-medium text-center transition hover:bg-accent-red hover:text-white shadow-sm">
                  {dict.homepage.hero.browsePlayers}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* PLAYER OF THE WEEK */}

        {playerOfTheWeek && (
          <section
            className="w-full lg:w-1/2 flex items-center justify-center"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <Link href={`/${lang}/players/${playerOfTheWeek.id}`}>
              <div className="group relative w-full max-w-sm lg:max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs sm:text-sm font-semibold rounded-full shadow-lg">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {playerOfTheWeek?.firstName} {playerOfTheWeek?.lastName}
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-2backdrop-blur-sm">
                      <div className="text-blue-200 text-xs sm:text-sm font-medium mb-1">
                        {dict.playerProfile.position}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {playerOfTheWeek?.position}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-blue-200 text-xs sm:text-sm font-medium mb-1">
                        {dict.playerProfile.age}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {age}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-blue-200 text-xs sm:text-sm font-medium mb-1">
                        {dict.playerProfile.foot}
                      </div>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {playerOfTheWeek?.foot}
                      </div>
                    </div>
                  </div>

                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                    {playerOfTheWeek?.description ||
                      "This player stands out for their dedication, talent and extraordinary performance on the pitch."}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center text-white text-xs sm:text-sm font-medium group-hover:text-red-300 transition-colors">
                      View Profile
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
        )}
      </div>

      <div className="w-full">
        {/* WHY FOOTBALLBANK */}
        <section className="py-16 bg-[#F9FAFB] ">
          <div
            className="max-w-7xl mx-auto text-center px-4"
            data-aos="fade-up"
          >
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold  text-[#111827] mb-4">
              {dict.homepage.whyFootballBank.title}
            </h2>
            <div className="w-24 h-1 bg-accent-red/80 mx-auto mb-10" />
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
                  className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E7EB] text-center hover:shadow-md transition-all group"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  <div className="w-16 h-16 bg-accent-red/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-red">
                    <i className={`fa-solid ${icon} text-white text-2xl`} />
                  </div>
                  <h3 className="text-xl  font-semibold text-[#111827] mb-4">
                    {title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PLAYERS */}
        <section 
          className="py-16 relative overflow-hidden " 
          style={{
            backgroundImage: 'url(/5618044.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          data-aos="fade-up"
        >
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="mb-8 text-center w-full relative z-10">
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold text-white mb-2">
              {dict.homepage.featuredPlayers.title}
            </h2>
            <div className="w-24 h-1 bg-accent-red/80 mx-auto mb-4" />
            <p className="text-white/90 text-lg lg:text-xl max-w-2xl mx-auto">
              Discover exceptional talent from around the world
            </p>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto ">
            <div className="flex flex-col lg:flex-row justify-end items-center mb-4 px-4 sm:px-6 lg:px-8 xl:px-12">
              <Link
                href={`/${lang}/players`}
                className="group inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-accent-red hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                <span className="font-semibold text-sm lg:text-base">
                  {dict.homepage.featuredPlayers.viewAll}
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
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4 py-4 sm:px-6 lg:px-8 xl:px-12"
              data-aos="fade-up"
            >
              {featuredPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-3xl"
                  // data-aos="fade-up"
                  // data-aos-delay={index * 100}
                >
                  {/* Full Player Image */}
                  <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                    <Image
                      src={player.imageUrl[0]}
                      alt={player.firstName}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                      Featured
                    </div>

                    {/* Player Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                        {player.firstName} {player.lastName}
                      </h3>

                      {/* Player Stats */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {player.position}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          Age:{" "}
                          {player.dob
                            ? new Date().getFullYear() -
                              new Date(player.dob).getFullYear()
                            : "N/A"}
                        </span>
                        {player.foot && (
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {player.foot}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 lg:p-6 space-y-4">
                    <p className="text-slate-950 text-sm leading-relaxed line-clamp-3">
                      {player.description?.slice(0, 120)}...
                    </p>

                    <Link href={`/${lang}/players/${player.id}`}>
                      <span className="group/btn inline-flex items-center w-full justify-center bg-gradient-to-r from-red-400 via-red-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base shadow-lg">
                        {dict.homepage.featuredPlayers.viewProfile}
                        <svg
                          className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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
                    </Link>
                  </div>
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
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold mb-4">
              {dict.homepage.blog.title}
            </h2>
            <div className="w-24 h-1 bg-accent-red mx-auto mb-4" />

            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-end items-center mb-4 px-4 sm:px-6 lg:px-8 xl:px-12">
                <Link
                  href={`/${lang}/blog`}
                  className="group inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-accent-red hover:bg-white/20 hover:border-white/30 transition-all duration-300"
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
                    className="bg-[#f9fafb] rounded-xl shadow hover:shadow-md transition"
                    data-aos="fade-up"
                  >
                    <Image
                      src={
                        post.imageUrl &&
                        post.imageUrl.length > 0 &&
                        post.imageUrl[0]
                          ? post.imageUrl[0]
                          : "/logo.jpg"
                      }
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-2">
                        {formatTimeAgo(post.createdAt)}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {post.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                      </p>
                      <Link href={`/${lang}/blog/${post.id}`}>
                        <span className="text-accent-red hover:underline text-sm font-medium">
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

        {/* CTA SECTION */}

        <footer className="bg-gray-900 text-white py-20 text-center">
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4">
              {/* Get started with <span className="text-red-500">Your career</span> today */}
              <span
                dangerouslySetInnerHTML={{ __html: dict.homepage.cta.title }}
              />
            </h2>
            <p className="text-gray-400 mb-8">
              {/* Try the Free plan or upgrade anytime. No credit card required to begin.*/}
              {dict.homepage.cta.subtitle}
            </p>
            <Link
              href={`/${lang}/pricing`}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg"
            >
              {dict.homepage.cta.getInTouch}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
