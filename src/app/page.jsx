import Image from "next/image";
import Link from "next/link";
import { getFeaturedPlayers, getFeaturedPosts } from "@/actions/publicActions";
import { formatTimeAgo } from "@/utils/dateHelper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { syncUserToDb } from "@/lib/syncUserToDb";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";


export const metadata = {
  title: "FootballBank | Global Football Representation Platform",
  description:
    "Empowering football talent worldwide through professional representation and global exposure.",
};

export default async function HomePage() {

 const {isAuthenticated, getUser} = getKindeServerSession();
 const user = await getUser();

 if(user && (await isAuthenticated() )){
  console.log(user);
  await syncUserToDb();
 }

  const featuredPosts = await getFeaturedPosts()
  const featuredPlayers = await getFeaturedPlayers()

  const playerOfTheWeek = featuredPlayers.find((player) => player.playerOfTheWeek === true);

  const today = new Date();
  const age = playerOfTheWeek?.dob
  ? today.getFullYear() - new Date(playerOfTheWeek.dob).getFullYear()
  : "N/A";


  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero Section */}
      <div className="relative min-h-screen md:h-screen w-full  bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ff] to-[#fff] overflow-hidden px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between">
        {/* Color Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-accent-red rounded-full blur-[120px] -top-24 -left-20 opacity-30"></div>
          <div className="absolute w-80 h-80 bg-accent-green rounded-full blur-[100px] bottom-10 right-10 opacity-30"></div>
        </div>

        {/* Left Content */}
        <section className="z-10 w-full lg:w-[50%] mt-8 md:mt-0 h-full flex items-center justify-center lg:justify-start text-center lg:text-left">
          <div className="max-w-2xl space-y-6 h-1/2">
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl leading-tight  text-primary-text bg-clip-text">
              Empowering Football{" "}
              <span className="text-accent-red">Talent</span> Worldwide
            </h1>
            <p className="text-primary-muted text-lg font-inter">
              Connecting exceptional players with opportunities. Showcase your
              skills, get discovered, and take your football career to the next
              level.
            </p>
            <div className="flex sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/submit-profile">
                <span className="bg-accent-red text-white px-6 py-3 rounded-md font-medium text-center transition-all hover:opacity-90 shadow-lg">
                  Submit Your Profile
                </span>
              </Link>
              <Link href="/players">
                <span className="border-2 border-accent-red text-accent-red px-6 py-3 rounded-md font-medium text-center transition hover:bg-accent-red hover:text-white shadow-sm">
                  Browse Players
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Player of the Moment Card */}
        <section className="relative z-10 w-full lg:w-[50%] h-full flex justify-center items-center p-4">
          <div className="relative w-full h-2/3 max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-row-reverse gap-6 p-6">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute w-96 h-96 bg-accent-red rounded-full blur-[120px] -top-24 -left-20 opacity-30"></div>
              <div className="absolute w-80 h-80 bg-accent-green rounded-full blur-[100px] bottom-10 right-10 opacity-30"></div>
            </div>
            {/* Badge */}
            <div className="absolute top-4 right-4 z-20 bg-accent-red/90 text-white px-3 py-1 text-xs rounded-full shadow">
              Star on the rise
            </div>

            {/* Image */}
            <div className="relative w-full h-full rounded-xl shadow-lg">
              <Image
                src={playerOfTheWeek?.imageUrl?.[0] || "/placeholder.jpg"}
                alt={`${playerOfTheWeek?.firstName} ${playerOfTheWeek?.lastName}`}
                width={340}
                height={340}
                className="object-cover w-full h-full rounded-xl "
              />
            </div>

            {/* Info */}
            <div className="w-full">
              <h3 className="text-xl font-bold text-[#111827] font-poppins my-3">
                {playerOfTheWeek?.firstName} {playerOfTheWeek?.lastName}
              </h3>
              <p className="text-accent-red font-semibold mb-2">
                <span className="font-semibold text-primary-muted">
                  Position:{" "}
                </span>
                {playerOfTheWeek?.position}
              </p>
              <p className="text-accent-red font-semibold mb-2">
                <span className="font-semibold text-primary-muted">Age: </span>
                {age}
              </p>
              <p className="text-accent-red font-semibold mb-2">
                <span className="font-semibold text-primary-muted">Foot: </span>
                {playerOfTheWeek?.foot}
              </p>
              <p className="text-gray-600 text-sm line-clamp-4">
                {playerOfTheWeek?.description?.slice(0, 180) ||
                  "This player stands out for their dedication, talent and extraordinary performance on the pitch."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why FootballBank */}
        <section className="py-16 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-poppins font-bold text-[#111827] mb-4">
              Why FootballBank?
            </h2>
            <div className="w-24 h-1 bg-[#1F6FEB] mx-auto mb-10" />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "fa-certificate",
                  title: "FIFA-Certified Agent",
                  desc: "Licensed professional representation ensuring compliance with international football regulations.",
                },
                {
                  icon: "fa-globe",
                  title: "Global Club Network",
                  desc: "Extensive connections with top clubs across Europe, Asia, and the Americas.",
                },
                {
                  icon: "fa-bolt",
                  title: "Rapid Profile Visibility",
                  desc: "Fast-track your talent exposure to scouts and clubs worldwide within 48 hours.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E7EB] text-center hover:shadow-md transition-all group"
                >
                  <div className="w-16 h-16 bg-[#1F6FEB] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1F6FEB]">
                    <i className={`fa-solid ${icon} text-white text-2xl`} />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-[#111827] mb-4">
                    {title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Players */}
        <section className="py-16 bg-primary-bg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-poppins font-bold text-3xl text-primary-text">
                Featured Players
              </h2>
              <Link
                href="/players"
                className="text-accent-red hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                View All <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlayers ? (
                featuredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="bg-primary-card rounded-lg overflow-hidden border border-divider shadow-sm"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={player.imageUrl[0]}
                        alt={`Player ${player.firstName} ${player.lastName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-poppins font-semibold text-xl mb-1 text-primary-text">
                        {player.firstName} {player.lastName}
                      </h3>
                      <p className="text-primary-muted text-sm mb-4">
                        {player?.description?.slice(0, 180)}
                      </p>
                      <Link href={`/players/player-${player.id}`}>
                        <span className="block text-center bg-accent-red text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                          View Profile
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <h4>No Featured Players</h4>
              )}
            </div>
          </div>
        </section>

        {/* Live Scores Section */}
        <section className="py-16 bg-primary-secondary border-y border-divider">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary-text">
                Live Scores
              </h2>
              <Link
                href="/livescore"
                className="text-accent-red hover:text-accent-amber flex items-center gap-2 transition-colors"
              >
                View All <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            {false ? (
              <div className="bg-primary-bg rounded-lg border border-divider p-6 shadow-lg space-y-6">
                {[
                  {
                    league: "Premier League",
                    teams: ["Manchester United", "Liverpool"],
                    score: [2, 1],
                    flags: ["gb-eng", "gb-eng"],
                    minute: "65'",
                  },
                  {
                    league: "La Liga",
                    teams: ["Barcelona", "Real Madrid"],
                    score: [0, 0],
                    flags: ["es", "es"],
                    minute: "32'",
                  },
                ].map(({ league, teams, score, flags, minute }, index) => (
                  <div
                    key={index}
                    className="bg-primary-secondary rounded-lg p-4 border border-divider"
                  >
                    <div className="flex justify-between items-center text-xs mb-3">
                      <span className="text-primary-muted">
                        {league} • {minute}
                      </span>
                      <span className="bg-accent-amber/20 text-accent-amber px-2 py-1 rounded">
                        LIVE
                      </span>
                    </div>
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center mt-3"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={`https://flagcdn.com/w40/${flags[i]}.png`}
                            alt={teams[i]}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                          <span className="font-medium">{teams[i]}</span>
                        </div>
                        <span className="font-poppins font-bold text-xl">
                          {score[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <h3 className="font-poppins font-bold  text-primary-text text-center">
                Coming Soon
              </h3>
            )}
          </div>
        </section>

        {/* Affiliate CTA Banner */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-bg via-transparent to-primary-bg z-10"></div>
              <Image
                className="w-full h-64 object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/1fe97496d6-4f61a53610d5c5887618.png"
                alt="Affiliate"
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 flex items-center z-20">
                <div className="container mx-auto px-4">
                  <div className="max-w-lg">
                    <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-4 text-white">
                      Pro Equipment, Pro Performance
                    </h2>
                    <p className="text-blue-100 mb-6">
                      Get 15% off on professional football gear with code:
                      FOOTBALLBANK15
                    </p>
                    <Link href="/shop">
                      <span className="inline-block bg-accent-amber hover:bg-opacity-80 text-primary-bg font-medium px-6 py-3 rounded-md transition-colors cursor-pointer">
                        Shop Now
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-poppins font-bold text-[#111827] mb-4">
                From Our Blog
              </h2>
              <div className="w-24 h-1 bg-accent-red mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all"
                >
                  <Image
                    src={post?.imageUrl[0]}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="text-sm text-[#6B7280] mb-2">
                      {formatTimeAgo(post?.createdAt)}
                    </div>
                    <h3 className="font-poppins font-semibold text-[#111827] mb-3">
                      {post?.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-4">
                      {post?.content.slice(0, 100)}
                    </p>
                    <Link href={`/posts/${post?.id}`}>
                      <span className="text-accent-red font-medium hover:underline cursor-pointer">
                        Read More
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <span className="bg-accent-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer">
                  Visit Blog
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="py-20 mb-16 bg-accent-red/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-red/80 to-accent-red/40" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-poppins font-bold text-white mb-4">
              Club or Brand Looking to Collaborate?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We connect talent with trusted organizations.
            </p>
            <Link href="/contact">
              <span className="bg-white text-accent-red px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                Get in Touch
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
