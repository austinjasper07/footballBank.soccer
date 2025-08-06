import Image from "next/image";
import Link from "next/link";
import "aos/dist/aos.css";

export const metadata = {
  title: "About Our Agent | FootballBank.soccer",
  description:
    "Representing football talent globally with integrity, insight, and strategic vision.",
};

const AboutAgent = () => {
  

  return (
    <main className="bg-primary-bg text-primary-text font-inter min-h-screen">
      {/* Hero Section */}
      <div className="py-12 text-center" data-aos="fade-up">
        <h1 className="font-poppins font-bold text-[clamp(1.8rem,3vw,2.5rem)] mb-6">
          About Our Agent
        </h1>
        <p className="text-primary-muted text-[clamp(1rem,2.5vw,1.25rem)] max-w-2xl mx-auto mb-2">
          Representing global football talent with vision, integrity, and
          developmental expertise.
        </p>
      </div>

      {/* Bio Section */}
      <section className="pb-16" data-aos="fade-up">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-primary-card rounded-xl p-8 md:p-12 border border-divider shadow-lg">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <Image
                src="/FootballBank_agent.jpg"
                alt="Ayodeji Fatade headshot"
                width={192}
                height={192}
                className="rounded-full border-4 border-accent-red object-cover"
              />
              <div className="text-center md:text-left flex-1">
                <h2 className="font-poppins font-bold text-[clamp(1.75rem,4vw,2.5rem)] mb-4">
                  Ayodeji Fatade
                </h2>
                <p className="text-accent-red font-semibold text-lg mb-4">
                  FIFA Licensed Football Agent
                </p>
                <div className="bg-primary-bg rounded-lg p-4 mb-6 border border-divider flex justify-center md:justify-start items-center gap-3">
                  <i className="fa-solid fa-certificate text-accent-green" />
                  <span className="font-medium text-primary-text">
                    FIFA License ID: 202309-4469
                  </span>
                </div>
                <p className="text-primary-muted leading-relaxed mb-6">
                  Ayodeji Fatade is the founder of FootballBank, an
                  international football agency dedicated to discovering and
                  developing talented players, especially youth prospects. With
                  25+ years in football, a PFSA scouting certification, and a
                  Certificate in Football Management (Open University, UK), he’s
                  an experienced agent focused on career growth, youth
                  transfers, and transparent representation. He partners with
                  clubs and academies across Africa, Europe, and the U.S. to
                  unlock global opportunities.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-accent-red/10 text-accent-red px-3 py-1 rounded-full text-sm border border-accent-red/20">
                    FIFA Licensed (Minors & Adults)
                  </span>
                  <span className="bg-accent-green/10 text-accent-green px-3 py-1 rounded-full text-sm border border-accent-green/20">
                    25+ Years in Football
                  </span>
                  <span className="bg-accent-amber/10 text-accent-amber px-3 py-1 rounded-full text-sm border border-accent-amber/20">
                    Global Club Network
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="pb-16 md:pb-24" data-aos="fade-up">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-poppins font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-center mb-12">
            Career Timeline
          </h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-accent-red"></div>
            {[
              {
                date: "1999 - 2008",
                title: "Amateur Football Career",
                desc: "Active as an amateur player, developing a deep understanding of grassroots football and the player’s journey.",
                dotColor: "bg-accent-red",
                alignRight: false,
              },
              {
                date: "2009 - 2017",
                title: "Youth Talent Spotter & Football Writer",
                desc: "Began contributing to football publications and working with local academies, identifying young prospects and sharing insight through analysis.",
                dotColor: "bg-accent-green",
                alignRight: true,
              },
              {
                date: "2018 - 2021",
                title: "Certified Football Scout",
                desc: "Earned PFSA certification in the UK and scouted players across African academies, building key relationships with international clubs.",
                dotColor: "bg-accent-amber",
                alignRight: false,
              },
              {
                date: "2022 - Present",
                title: "FIFA Licensed Agent & Founder of FootballBank",
                desc: "Established FootballBank to formally represent players, manage transfers, and create opportunities globally with a focus on youth development.",
                dotColor: "bg-accent-red",
                alignRight: true,
              },
            ].map(({ date, title, desc, dotColor, alignRight }, i) => (
              <div
                key={i}
                className={`relative flex items-center mb-12 ${alignRight ? "md:flex-row-reverse" : ""}`}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div
                  className={`absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 ${dotColor} rounded-full border-4 border-primary-bg`}
                />
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${alignRight ? "md:pl-8" : "md:pr-8"}`}
                >
                  <div className="bg-primary-card rounded-xl p-6 border border-divider shadow-lg">
                    <span className="text-accent-amber font-semibold text-sm">
                      {date}
                    </span>
                    <h3 className="font-poppins font-semibold text-xl mb-2">
                      {title}
                    </h3>
                    <p className="text-primary-muted">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="pb-16 md:pb-24" data-aos="fade-up">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-poppins font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                icon: "fa-handshake",
                color: "red",
                desc: "We uphold the highest standards of transparency and ethics in every representation, negotiation, and transfer.",
              },
              {
                title: "Opportunity",
                icon: "fa-door-open",
                color: "green",
                desc: "We unlock doors to international clubs, academies, and trials—connecting talent to the world stage.",
              },
              {
                title: "Development",
                icon: "fa-chart-line",
                color: "amber",
                desc: "From grassroots to global, we prioritize player growth with coaching, mentorship, and career planning.",
              },
            ].map(({ title, icon, color, desc }, i) => (
              <div
                key={title}
                className={`bg-primary-card rounded-xl p-8 border border-divider shadow-lg text-center hover:border-accent-${color} transition-colors`}
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div
                  className={`w-16 h-16 bg-accent-${color}/10 rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <i
                    className={`fa-solid ${icon} text-accent-${color} text-2xl`}
                  />
                </div>
                <h3
                  className={`font-poppins font-semibold text-2xl mb-4 text-accent-${color}`}
                >
                  {title}
                </h3>
                <p className="text-primary-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-16 md:pb-24  " data-aos="zoom-in-up">
        <div className="container mx-auto px-4  max-w-4xl ">
          <div className="bg-gradient-to-r from-accent-red to-accent-green rounded-xl p-8 md:p-12 text-center shadow-lg h-full flex flex-col ">
            <h2 className="font-poppins font-bold text-[clamp(1.75rem,4vw,2.5rem)] mb-6 text-white">
              Ready to Take the Next Step?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a rising star or a seasoned player, FootballBank is
              here to represent you with purpose, precision, and global reach.
            </p>
            <div className="flex flex-col md:flex-row gap-8 md:gap-4 w-full">
              <Link href="/contact">
                <span className="bg-white text-accent-red px-4 md:px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors text-nowrap">
                  Schedule Consultation
                </span>
              </Link>
              <Link href="/submit-profile">
                <span className="border-2 border-white text-white px-4 md:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors">
                  Submit Your Profile
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutAgent;
