export const dynamic = "force-dynamic";


import Image from "next/image";
import Link from "next/link";
import "aos/dist/aos.css";
import { getFeaturedPlayers, getFeaturedPosts } from "@/actions/publicActions";
import { getAuthUser } from "@/lib/oauth";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

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
    <div className="pb-20 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-[200px] -top-24 -left-20 opacity-20 animate-pulse" />
          <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-[120px] bottom-10 right-10 opacity-25 animate-pulse" />
          <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15 animate-pulse" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* HERO CONTENT - Responsive Layout */}
        <div className="max-w-7xl relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 min-h-[calc(100vh-6rem)]">
            {/* LEFT CONTENT */}
            <section className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start text-center lg:text-left">
              <div className="max-w-2xl space-y-6 lg:space-y-8">
                <div className="space-y-4 lg:space-y-6">
                  <h1
                    className="font-bold text-[clamp(2rem,5vw,4rem)] leading-tight tracking-tight text-white"
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
                            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                              {dict.homepage.hero.titleHighlight}
                            </span>
                          )}
                        </span>
                      ))}
                  </h1>
                  <p
                    className="text-blue-100 text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed max-w-xl mx-auto lg:mx-0"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    {dict.homepage.hero.subtitle}
                  </p>
                </div>

                <div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <Link href={`/${lang}/submit-profile`}>
                    <span className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-pink-600 w-full sm:w-auto">
                      <span className="relative z-10">
                        {dict.homepage.hero.submitProfile}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </span>
                  </Link>
                  <Link href={`/${lang}/players`}>
                    <span className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white border-2 border-white/30 rounded-xl backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                      {dict.homepage.hero.browsePlayers}
                    </span>
                  </Link>
                </div>

                {/* Stats Section */}
                <div
                  className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-8"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      10K+
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm">
                      Players
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      500+
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm">
                      Clubs
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      50+
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm">
                      Countries
                    </div>
                  </div>
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
                        src={
                          playerOfTheWeek?.imageUrl?.[0] || "/placeholder.jpg"
                        }
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

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                          <div className="text-blue-200 text-xs sm:text-sm font-medium mb-1">
                            {dict.playerProfile.position}
                          </div>
                          <div className="text-white font-semibold text-sm sm:text-base">
                            {playerOfTheWeek?.position}
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                          <div className="text-blue-200 text-xs sm:text-sm font-medium mb-1">
                            {dict.playerProfile.age}
                          </div>
                          <div className="text-white font-semibold text-sm sm:text-base">
                            {age}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                        <div className="text-blue-200 text-xs sm:text-sm font-medium mb-1">
                          {dict.playerProfile.foot}
                        </div>
                        <div className="text-white font-semibold text-sm sm:text-base">
                          {playerOfTheWeek?.foot}
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
        </div>
      </div>

      <div className="w-full">
        {/* WHY FOOTBALLBANK */}
        <section className="py-20 bg-gradient-to-br relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div
            className="max-w-7xl mx-auto text-center px-4 relative z-10"
            data-aos="fade-up"
          >
            <div className="mb-12 lg:mb-16">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-slate-900 mb-4 lg:mb-6">
                {dict.homepage.whyFootballBank.title}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mb-6 lg:mb-8 rounded-full" />
              <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover why thousands of players and clubs trust FootballBank
                for their recruitment needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: "fa-certificate",
                  title: dict.homepage.whyFootballBank.fifaCertified.title,
                  desc: dict.homepage.whyFootballBank.fifaCertified.description,
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: "fa-globe",
                  title: dict.homepage.whyFootballBank.globalNetwork.title,
                  desc: dict.homepage.whyFootballBank.globalNetwork.description,
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: "fa-bolt",
                  title: dict.homepage.whyFootballBank.rapidVisibility.title,
                  desc: dict.homepage.whyFootballBank.rapidVisibility
                    .description,
                  gradient: "from-yellow-500 to-orange-500",
                  bgGradient: "from-yellow-50 to-orange-50",
                },
              ].map(({ icon, title, desc, gradient, bgGradient }, i) => (
                <div
                  key={title}
                  className={`group relative bg-gradient-to-br ${bgGradient} p-8 rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <i className={`fa-solid ${icon} text-white text-3xl`} />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 lg:mb-4 group-hover:text-slate-700 transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PLAYERS */}
        <section
          className=" py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
          data-aos="fade-up"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute w-96 h-96 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-[200px] -top-24 -left-20" />
            <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-[120px] bottom-10 right-10" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="text-center lg:text-left mb-8 lg:mb-0">
                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white mb-4">
                  {dict.homepage.featuredPlayers.title}
                </h2>
                <p className="text-blue-200 text-lg lg:text-xl max-w-2xl">
                  Discover exceptional talent from around the world
                </p>
              </div>
              <Link
                href={`/${lang}/players`}
                className="group inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 xl:px-12">
              {featuredPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-3xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
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
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
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
                    <p className="text-blue-200 text-sm leading-relaxed line-clamp-3">
                      {player.description?.slice(0, 120)}...
                    </p>

                    <Link href={`/${lang}/players/${player.id}`}>
                      <span className="group/btn inline-flex items-center w-full justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base shadow-lg">
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
        <section
          className="py-20 bg-gradient-to-br relative overflow-hidden"
          id="blog"
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div
            className="max-w-7xl mx-auto px-4 text-center relative z-10"
            data-aos="fade-up"
          >
            <div className="mb-12 lg:mb-16">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-slate-900 mb-4 lg:mb-6">
                {dict.homepage.blog.title}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mb-6 lg:mb-8 rounded-full" />
              <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Stay updated with the latest insights, tips, and stories from
                the football world
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-slate-200"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.imageUrl[0]}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      Blog
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatTimeAgo(post.createdAt)}
                    </div>

                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed line-clamp-3 text-sm lg:text-base">
                      {post.content.slice(0, 120)}...
                    </p>

                    <Link href={`/${lang}/posts/${post.id}`}>
                      <span className="group/btn inline-flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors">
                        {dict.homepage.blog.readMore}
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
                </article>
              ))}
            </div>

            <div className="mt-16">
              <Link href={`/${lang}/blog`}>
                <span className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {dict.homepage.blog.visitBlog}
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
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
        </section>

        {/* CTA SECTION */}
        <section
          className="max-w-7xl mx-auto py-24 bg-gradient-to-br from-slate-900 via-red-900 to-pink-900 relative overflow-hidden"
          data-aos="zoom-in-up"
        >
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute w-96 h-96 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full blur-[200px] -top-24 -left-20 animate-pulse" />
            <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-[120px] bottom-10 right-10 animate-pulse" />
            <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 z-10 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold mb-4 lg:mb-6 leading-tight">
                {dict.homepage.cta.title}
              </h2>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
                {dict.homepage.cta.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href={`/${lang}/contact`}>
                  <span className="group relative inline-flex items-center justify-center px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg font-semibold text-white bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    <span className="relative z-10">
                      {dict.homepage.cta.getInTouch}
                    </span>
                    <svg
                      className="ml-2 lg:ml-3 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform"
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

                <Link href={`/${lang}/submit-profile`}>
                  <span className="group inline-flex items-center justify-center px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg font-semibold text-slate-900 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    <span>Start Your Journey</span>
                    <svg
                      className="ml-2 lg:ml-3 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 lg:pt-12 border-t border-white/20">
                <p className="text-blue-200 text-base lg:text-lg mb-4 lg:mb-6">
                  Trusted by players and clubs worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 opacity-60">
                  <div className="text-lg lg:text-xl font-bold">FIFA</div>
                  <div className="text-lg lg:text-xl font-bold">UEFA</div>
                  <div className="text-lg lg:text-xl font-bold">
                    Premier League
                  </div>
                  <div className="text-lg lg:text-xl font-bold">La Liga</div>
                  <div className="text-lg lg:text-xl font-bold">Serie A</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
