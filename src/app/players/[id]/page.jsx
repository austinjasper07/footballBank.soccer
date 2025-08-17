import Image from "next/image"
import { notFound } from "next/navigation"
import PlayerTabs from "@/app/players/[id]/PlayerTabs"
import Head from "next/head"
import { getPlayerById } from "@/actions/publicActions"
import Link from "next/link"

export default async function PlayerPage({ params }) {
  const playerId = (await params).id
  let player= "";

  try {
    const data = await getPlayerById(playerId)
    if (!data) return notFound()
    player = data;
  } catch (err) {
    return notFound()
  }

  const age = new Date().getFullYear() - new Date(player.dob).getFullYear()

  return (
    <>
      <Head>
        <title>
          {player.firstName} {player.lastName} | FootballBank.soccer
        </title>
        <meta
          name="description"
          content="Empowering football talent worldwide through visibility and opportunity."
        />
      </Head>
      <main className="bg-primary-bg text-primary-text font-inter">
        {/* Hero */}
        <section className="pb-16 pt-8">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute w-96 h-96 bg-accent-red rounded-full blur-[120px] -top-24 -left-20 opacity-30"></div>
            <div className="absolute w-80 h-80 bg-accent-green rounded-full blur-[100px] bottom-10 right-10 opacity-30"></div>
          </div>
          <div className="flex lg:flex-row flex-col gap-12 items-center">
            <div className="shadow-md p-10 rounded-xl lg:w-[60%]">
              <div className="flex gap-4 mb-6">
                <span className="badge">Available</span>
                <span className="badge-secondary">Featured Player</span>
              </div>
              <h1 className="text-[clamp(1.5rem,3.5vw,3.5rem)]  font-bold mb-4">
                <span className="text-nowrap">{player.firstName}</span> {player.lastName}
              </h1>
              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Image
                    src={`https://flagcdn.com/w40/${player.countryCode.toLowerCase()}.png`}
                    alt={player.country}
                    width={24}
                    height={16}
                    className="rounded"
                  />
                  <span className="text-primary-muted">{player.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-map-marker-alt text-accent-red"></i>
                  <span className="text-primary-muted">—</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <DetailCard label="Position" value={player.position} />
                <DetailCard label="Age" value={`${age} years`} />
              </div>
              <p className="mb-6">{player.description}</p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  <i className="fa-solid fa-envelope mr-2" /> Contact Agent
                </button>
                <a href={player.cvUrl} className="btn-outline" download target="_blank">
                  <i className="fa-solid fa-download mr-2" /> Download CV
                </a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-divider">
              <Image
                src={player.imageUrl[0]}
                alt={`${player.firstName} ${player.lastName}`}
                width={600}
                height={500}
                className="object-cover w-full h-[500px]"
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <PlayerTabs player={player} />

        {/* Contact CTA */}
        <section className="py-16 mb-16 bg-gradient-to-r from-accent-red to-accent-red/80 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl  font-bold mb-6">
              Ready to Scout {player.firstName}?
            </h2>
            <p className="mb-8 opacity-90">
              Contact us today to learn more, arrange trials, or request
              additional information.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={'/contact'} className="text-accent-red bg-white border border-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-accent-red hover:text-white transition-colors">
                <i className="fa-solid fa-envelope mr-2 "></i> Contact Agent
              </Link>
              <button className="text-accent-red bg-white border border-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-accent-red hover:text-white transition-colors">
                <i className="fa-solid fa-calendar mr-2"></i> Schedule Meeting
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-primary-secondary rounded-lg p-4 border border-divider">
      <span className="text-primary-muted text-sm">{label}</span>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  )
}
