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
      "player showcase"
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
    <div className="bg-[#F9FAFB]">
      {/* HERO SECTION */}
      <div className="relative min-h-[calc(100vh+100px)] md:h-[calc(100vh+100px)] w-full bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ff] to-[#fff] overflow-hidden pt-8 pb-16 lg:pb-2 lg:pt-0 px-6 lg:px-12 flex flex-col lg:flex-row justify-between gap-12 items-center">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-accent-red rounded-full blur-[200px] -top-24 -left-20 opacity-25" />
          <div className="absolute w-80 h-80 bg-accent-green rounded-full blur-[120px] bottom-10 right-10 opacity-30" />
        </div>

        {/* LEFT CONTENT */}
        <section className="z-10 w-full lg:w-[50%] h-full flex items-center justify-center lg:justify-start text-center lg:text-left">
          <div className="max-w-2xl space-y-6 h-1/2">
            <h1
              className=" font-bold text-[clamp(2.5rem,3.5vw,4rem)] leading-tight tracking-tight text-primary-text"
              data-aos="fade-up"
            >
              {dict.homepage.hero.title.split(dict.homepage.hero.titleHighlight).map((part, index) => (
                <span key={index}>
                  {part}
                  {index < dict.homepage.hero.title.split(dict.homepage.hero.titleHighlight).length - 1 && (
                    <span className="text-accent-red">{dict.homepage.hero.titleHighlight}</span>
                  )}
                </span>
              ))}
            </h1>
            <p
              className="text-primary-muted text-[clamp(1rem,2.5vw,1.25rem)]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {dict.homepage.hero.subtitle}
            </p>
            <div
              className="flex sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
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
            className="relative z-10 w-full lg:w-[50%] flex items-center justify-center lg:h-[700px] "
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <Link href={`/${lang}/players/${playerOfTheWeek.id}`}>
            <div className="relative w-full md:w-[80%] lg:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-row-reverse gap-6 p-4 mx-auto">
              <div className="absolute top-4 right-4 z-20 bg-accent-red/90 text-white px-3 py-1 text-xs rounded-full shadow">
                {dict.homepage.hero.starOnTheRise}
              </div>
              <div className="relative w-full h-full rounded-xl shadow-lg">
                <Image
                  src={playerOfTheWeek?.imageUrl?.[0] || "/placeholder.jpg"}
                  alt={`${playerOfTheWeek?.firstName} ${playerOfTheWeek?.lastName}`}
                  width={500}
                  height={500}
                  className="object-cover w-full h-[350px] lg:h-full rounded-xl"
                />
              </div>
              <div className="w-full mt-4">
                <h3 className="text-xl font-bold text-[#111827]  my-3">
                  {playerOfTheWeek?.firstName} {playerOfTheWeek?.lastName}
                </h3>
                <p className="text-accent-red font-semibold mb-2">
                  <span className="font-semibold text-primary-muted">
                    {dict.playerProfile.position}:{" "}
                  </span>
                  {playerOfTheWeek?.position}
                </p>
                <p className="text-accent-red font-semibold mb-2">
                  <span className="font-semibold text-primary-muted">
                    {dict.playerProfile.age}:{" "}
                  </span>
                  {age}
                </p>
                <p className="text-accent-red font-semibold mb-2">
                  <span className="font-semibold text-primary-muted">
                    {dict.playerProfile.foot}:{" "}
                  </span>
                  {playerOfTheWeek?.foot}
                </p>
                <p className="text-gray-600 text-sm line-clamp-6 md:line-clamp-8 lg:line-clamp-15">
                  {playerOfTheWeek?.description||
                    "This player stands out for their dedication, talent and extraordinary performance on the pitch."}
                </p>
              </div>
            </div>
            </Link>
          </section>
        )}
      </div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  desc: dict.homepage.whyFootballBank.rapidVisibility.description,
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
        <section className="py-16 bg-primary-bg" data-aos="fade-up">
          <div className=" px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold">
                {dict.homepage.featuredPlayers.title}
              </h2>
              <Link href={`/${lang}/players`} className="text-accent-red hover:underline">
                {dict.homepage.featuredPlayers.viewAll}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden h-[300px] lg:h-[400px] flex flex-col lg:justify-between"
                  data-aos="fade-up"
                >
                  <div className="relative w-full h-40 lg:h-48">
                    <Image
                      src={player.imageUrl[0]}
                      alt={player.firstName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-xl mb-1">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {player.description?.slice(0, 180)}
                    </p>
                    <Link href={`/${lang}/players/${player.id}`}>
                      <span className="block bg-accent-red text-white text-center py-2 rounded hover:bg-red-600 transition">
                        {dict.homepage.featuredPlayers.viewProfile}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG */}

        <section className="py-20 bg-white" id="blog">
          <div
            className="max-w-7xl mx-auto px-4 text-center"
            data-aos="fade-up"
          >
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold mb-4">
              {dict.homepage.blog.title}
            </h2>
            <div className="w-24 h-1 bg-accent-red mx-auto mb-10" />
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-[#f9fafb] rounded-xl shadow hover:shadow-md transition"
                  data-aos="fade-up"
                >
                  <Image
                    src={post.imageUrl[0]}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatTimeAgo(post.createdAt)}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.content.slice(0, 100)}
                    </p>
                    <Link href={`/${lang}/posts/${post.id}`}>
                      <span className="text-accent-red hover:underline text-sm font-medium">
                        {dict.homepage.blog.readMore}
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Link href={`/${lang}/blog`}>
                <span className="bg-accent-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium">
                  {dict.homepage.blog.visitBlog}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section
          className="py-20 bg-accent-red/50 relative"
          data-aos="zoom-in-up"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-red/80 to-accent-red/40 z-0" />
          <div className="relative max-w-7xl mx-auto px-4 z-10 text-center text-white">
            <h2 className="text-[clamp(1.2rem,2.5vw,2.5rem)] font-bold mb-4">
              {dict.homepage.cta.title}
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {dict.homepage.cta.subtitle}
            </p>
            <Link href={`/${lang}/contact`}>
              <span className="bg-white text-accent-red px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                {dict.homepage.cta.getInTouch}
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
