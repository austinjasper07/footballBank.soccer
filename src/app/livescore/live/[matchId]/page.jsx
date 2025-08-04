import Image from "next/image"

export const metadata = {
  title: "Live Match | FootballBank.soccer",
  description: "Empowering football talent worldwide through visibility and opportunity.",
}

export default function LiveMatchPage() {
  return (
    <div className="bg-primary-bg font-inter text-primary-text py-16">
      {/* Match Header */}
      <section id="match-header" className="py-6 bg-primary-secondary border-b border-divider">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Teams & Score */}
            <div className="flex items-center gap-4">
              {/* Home */}
              <div className="flex items-center gap-4">
                <Image
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                  alt="Real Madrid"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="text-center">
                  <div className="font-poppins font-bold text-2xl">Real Madrid</div>
                  <div className="text-primary-muted text-sm">HOME</div>
                </div>
              </div>

              <div className="mx-6 text-center">
                <div className="font-poppins font-bold text-4xl text-accent-green">2 - 1</div>
                <div className="text-accent-amber text-sm">78' LIVE</div>
              </div>

              {/* Away */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-poppins font-bold text-2xl">Barcelona</div>
                  <div className="text-primary-muted text-sm">AWAY</div>
                </div>
                <Image
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
                  alt="Barcelona"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            {/* Match Info */}
            <div className="flex items-center gap-4">
              <span className="bg-accent-red text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <i className="fa-solid fa-circle text-xs animate-pulse" /> LIVE
              </span>
              <span className="text-primary-muted">La Liga • Santiago Bernabéu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stream Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stream & Stats */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden relative aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-green/20 flex items-center justify-center">
                <div className="text-center">
                  <i className="fa-solid fa-play-circle text-6xl text-white mb-4 cursor-pointer hover:text-accent-blue transition-colors" />
                  <p className="text-white text-xl font-semibold">Live Stream</p>
                  <p className="text-white/70">Real Madrid vs Barcelona</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-play hover:text-accent-blue cursor-pointer" />
                    <i className="fa-solid fa-volume-high hover:text-accent-blue cursor-pointer" />
                    <span className="text-sm">78:32 / LIVE</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-expand hover:text-accent-blue cursor-pointer" />
                    <i className="fa-solid fa-cog hover:text-accent-blue cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-primary-secondary rounded-xl p-6">
              <h3 className="font-poppins font-bold text-xl mb-4">Match Timeline</h3>
              <div className="space-y-4">
                {[
                  ["78'", "Goal! Benzema scores for Real Madrid", "fa-futbol", "text-accent-green"],
                  ["65'", "Yellow card for Pedri (Barcelona)", "fa-square", "text-accent-amber"],
                  ["52'", "Goal! Lewandowski equalizes for Barcelona", "fa-futbol", "text-accent-blue"],
                  ["23'", "Goal! Vinícius Jr. opens scoring", "fa-futbol", "text-accent-green"],
                ].map(([time, text, icon, color], i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-primary-bg rounded-lg">
                    <span className="min-w-[40px] font-bold text-accent-amber">{time}</span>
                    <i className={`fa-solid ${icon} ${color}`} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-primary-secondary rounded-xl p-6">
              <h3 className="font-poppins font-bold text-xl mb-4">Match Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Possession</span>
                    <span className="font-semibold">58% - 42%</span>
                  </div>
                  <div className="w-full bg-primary-bg rounded-full h-2">
                    <div className="bg-accent-green h-2 rounded-full" style={{ width: "58%" }} />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    ["Shots on Target", "7 - 4"],
                    ["Corners", "5 - 3"],
                    ["Fouls", "12 - 8"],
                  ].map(([label, val], i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{label}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Chat */}
            <div className="bg-primary-secondary rounded-xl p-4 h-96 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-poppins font-bold">Live Chat</h3>
                <span className="text-accent-green text-sm">1,247 watching</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {[
                  ["MadridFan", "What a goal by Benzema! 🔥", "text-accent-blue"],
                  ["FootballExpert", "Barcelona needs to press higher", "text-accent-amber"],
                  ["CuleBarca", "Come on Barça! ⚡", "text-accent-green"],
                ].map(([user, msg, color], i) => (
                  <div key={i} className="text-sm">
                    <span className={`${color} font-semibold`}>{user}:</span>{" "}
                    <span className="text-primary-muted">{msg}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-primary-bg border border-divider rounded-lg px-3 py-2 text-sm"
                />
                <button className="bg-accent-blue hover:bg-accent-blue/80 text-white px-3 py-2 rounded-lg">
                  <i className="fa-solid fa-paper-plane" />
                </button>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-primary-secondary rounded-xl p-4">
              <h3 className="font-poppins font-bold mb-4">Upcoming Streams</h3>
              {[
                ["Man City vs Arsenal", "20:00", "Premier League"],
                ["PSG vs Bayern", "21:00", "Champions League"],
                ["Juventus vs Milan", "22:30", "Serie A"],
              ].map(([match, time, league], i) => (
                <div key={i} className="bg-primary-bg rounded-lg p-3 mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">{match}</span>
                    <span className="text-accent-amber text-xs">{time}</span>
                  </div>
                  <div className="text-primary-muted text-xs">{league}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Related Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-poppins font-bold text-3xl mb-8">Related Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["El Clásico Best Goals", "2.1M views • 2 days ago", "from-accent-blue/20 to-accent-green/20"],
              ["Benzema Hat-trick", "890K views • 1 week ago", "from-accent-amber/20 to-accent-red/20"],
              ["Barcelona Comeback", "1.5M views • 3 days ago", "from-accent-green/20 to-accent-blue/20"],
            ].map(([title, views, gradient], i) => (
              <div
                key={i}
                className="bg-primary-secondary rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className={`aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <i className="fa-solid fa-play-circle text-4xl text-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-primary-muted text-sm">{views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
