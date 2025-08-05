// import Image from 'next/image';
// import Link from 'next/link';

// export const metadata = {
//   title: 'About Our Agent | FootballBank.soccer',
//   description: 'Empowering football talent worldwide through visibility and opportunity.',
// };

// const AboutAgent = () => {
//   return (
//     <main className="bg-primary-bg text-primary-text font-inter">

//       {/* Hero Section */}
//       <div className="py-12 text-center">
//         <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">About Our Agent</h1>
//         <p className="text-primary-muted text-lg max-w-2xl mx-auto mb-2">
//           Dedicated to empowering football talent with integrity, opportunity, and growth
//         </p>
//       </div>

//       {/* Bio Section */}
//       <section className="pb-16">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="bg-primary-card rounded-xl p-8 md:p-12 border border-divider shadow-lg">
//             <div className="flex flex-col md:flex-row gap-8 items-center">
//               <Image
//                 src="/FootballBank_agent.jpg"
//                 alt="Marcus Rodriguez headshot"
//                 width={192}
//                 height={192}
//                 className="rounded-full border-4 border-accent-red object-cover"
//               />
//               <div className="text-center md:text-left flex-1">
//                 <h2 className="font-poppins font-bold text-3xl mb-4">Ayodeji Fatade</h2>
//                 <p className="text-accent-red font-semibold text-lg mb-4">FIFA Licensed Football Agent</p>
//                 <div className="bg-primary-bg rounded-lg p-4 mb-6 border border-divider flex justify-center md:justify-start items-center gap-3">
//                   <i className="fa-solid fa-certificate text-accent-green" />
//                   <span className="font-medium text-primary-text">FIFA License ID: 202309-4469</span>
//                 </div>
//                 <p className="text-primary-muted leading-relaxed mb-6">
//                   With over 15 years of experience in football representation, Marcus has successfully guided numerous players from youth academies to professional contracts across Europe&apos;s top leagues.
//                 </p>
//                 <div className="flex flex-wrap gap-3">
//                   <span className="bg-accent-red/-10 text-accent-red px-3 py-1 rounded-full text-sm border border-accent-red border/20">UEFA Licensed</span>
//                   <span className="bg-accent-green/-10 text-accent-green px-3 py-1 rounded-full text-sm border border-accent-green border/20">150+ Players Represented</span>
//                   <span className="bg-accent-amber/-10 text-accent-amber px-3 py-1 rounded-full text-sm border border-accent-amber border/20">25 Countries</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Timeline */}
//       <section className="pb-16 md:pb-24">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <h2 className="font-poppins font-bold text-3xl text-center mb-12">Career Timeline</h2>
//           <div className="relative">
//             <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-accent-red"></div>
//             {[
//               {
//                 date: '2008 - 2012',
//                 title: 'Junior Scout & Analyst',
//                 desc: 'Started career with Manchester United Academy, identifying and evaluating youth talent across England and Ireland.',
//                 dotColor: 'bg-accent-red',
//                 alignRight: false,
//               },
//               {
//                 date: '2012 - 2016',
//                 title: 'Player Development Coordinator',
//                 desc: "Joined Barcelona's La Masia academy, working directly with young players on career planning and professional development.",
//                 dotColor: 'bg-accent-green',
//                 alignRight: true,
//               },
//               {
//                 date: '2016 - 2019',
//                 title: 'International Transfer Specialist',
//                 desc: 'Facilitated cross-border transfers for Juventus FC, managing complex negotiations and regulatory compliance.',
//                 dotColor: 'bg-accent-amber',
//                 alignRight: false,
//               },
//               {
//                 date: '2019 - Present',
//                 title: 'FIFA Licensed Agent',
//                 desc: 'Founded independent agency, representing players across Premier League, La Liga, Serie A, and emerging markets worldwide.',
//                 dotColor: 'bg-accent-red',
//                 alignRight: true,
//               },
//             ].map(({ date, title, desc, dotColor, alignRight }, i) => (
//               <div
//                 key={i}
//                 className={`relative flex items-center mb-12 ${alignRight ? 'md:flex-row-reverse' : ''}`}
//               >
//                 <div className={`absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 ${dotColor} rounded-full border-4 border-primary-bg`} />
//                 <div className={`ml-12 md:ml-0 md:w-1/2 ${alignRight ? 'md:pl-8' : 'md:pr-8'}`}>
//                   <div className="bg-primary-card rounded-xl p-6 border border-divider shadow-lg">
//                     <span className="text-accent-amber font-semibold text-sm">{date}</span>
//                     <h3 className="font-poppins font-semibold text-xl mb-2">{title}</h3>
//                     <p className="text-primary-muted">{desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Core Values */}
//       <section className="pb-16 md:pb-24">
//         <div className="container mx-auto px-4 max-w-6xl">
//           <h2 className="font-poppins font-bold text-3xl text-center mb-12">Our Core Values</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: 'Integrity',
//                 icon: 'fa-handshake',
//                 color: 'red',
//                 desc: 'We believe in transparent, honest dealings with all parties. Every negotiation is conducted with the highest ethical standards.',
//               },
//               {
//                 title: 'Opportunity',
//                 icon: 'fa-door-open',
//                 color: 'green',
//                 desc: 'We create pathways where none existed before, opening doors to opportunities that transform careers.',
//               },
//               {
//                 title: 'Growth',
//                 icon: 'fa-chart-line',
//                 color: 'amber',
//                 desc: "We invest in each player's journey, providing mentorship, training resources, and strategic guidance for sustained success.",
//               },
//             ].map(({ title, icon, color, desc }) => (
//               <div
//                 key={title}
//                 className={`bg-primary-card rounded-xl p-8 border border-divider shadow-lg text-center hover:border-accent-${color} transition-colors`}
//               >
//                 <div className={`w-16 h-16 bg-accent-${color}/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
//                   <i className={`fa-solid ${icon} text-accent-${color} text-2xl`} />
//                 </div>
//                 <h3 className={`font-poppins font-semibold text-2xl mb-4 text-accent-${color}`}>{title}</h3>
//                 <p className="text-primary-muted leading-relaxed">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="pb-16 md:pb-24">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="bg-gradient-to-r from-accent-red to-accent-green rounded-xl p-8 md:p-12 text-center shadow-lg">
//             <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-6 text-white">Ready to Take the Next Step?</h2>
//             <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
//               Whether you&apos;re a promising talent or an established player looking for new opportunities, we&apos;re here to guide your journey to success.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href={'/contact'} className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
//                 Schedule Consultation
//               </Link>
//               <Link href={'/submit-profile'} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors">
//                 Submit Your Profile
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// };

// export default AboutAgent;



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
    <main className="bg-primary-bg text-primary-text font-inter">
      {/* Hero Section */}
      <div className="py-12 text-center" data-aos="fade-up">
        <h1 className="font-poppins font-bold text-[clamp(1.2rem,2.5vw,2.5rem)] mb-6">
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
      <section className="pb-16 md:pb-24" data-aos="zoom-in-up">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-accent-red to-accent-green rounded-xl p-8 md:p-12 text-center shadow-lg">
            <h2 className="font-poppins font-bold text-[clamp(1.75rem,4vw,2.5rem)] mb-6 text-white">
              Ready to Take the Next Step?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a rising star or a seasoned player, FootballBank is
              here to represent you with purpose, precision, and global reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <span className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                  Schedule Consultation
                </span>
              </Link>
              <Link href="/submit-profile">
                <span className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors">
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

// import Image from 'next/image';
// import Link from 'next/link';

// export const metadata = {
//   title: 'About Our Agent | FootballBank.soccer',
//   description: 'Representing football talent globally with integrity, insight, and strategic vision.',
// };

// const AboutAgent = () => {
//   return (
//     <main className="bg-primary-bg text-primary-text font-inter">

//       {/* Hero Section */}
//       <div className="py-12 text-center">
//         <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">About Our Agent</h1>
//         <p className="text-primary-muted text-lg max-w-2xl mx-auto mb-2">
//           Representing global football talent with vision, integrity, and developmental expertise.
//         </p>
//       </div>

//       {/* Bio Section */}
//       <section className="pb-16">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="bg-primary-card rounded-xl p-8 md:p-12 border border-divider shadow-lg">
//             <div className="flex flex-col md:flex-row gap-8 items-center">
//               <Image
//                 src="/FootballBank_agent.jpg"
//                 alt="Ayodeji Fatade headshot"
//                 width={192}
//                 height={192}
//                 className="rounded-full border-4 border-accent-red object-cover"
//               />
//               <div className="text-center md:text-left flex-1">
//                 <h2 className="font-poppins font-bold text-3xl mb-4">Ayodeji Fatade</h2>
//                 <p className="text-accent-red font-semibold text-lg mb-4">FIFA Licensed Football Agent</p>
//                 <div className="bg-primary-bg rounded-lg p-4 mb-6 border border-divider flex justify-center md:justify-start items-center gap-3">
//                   <i className="fa-solid fa-certificate text-accent-green" />
//                   <span className="font-medium text-primary-text">FIFA License ID: 202309-4469</span>
//                 </div>
//                 <p className="text-primary-muted leading-relaxed mb-6">
//                   Ayodeji Fatade is the founder of FootballBank, an international football agency dedicated to discovering and developing talented players, especially youth prospects. With 25+ years in football, a PFSA scouting certification, and a Certificate in Football Management (Open University, UK), he’s an experienced agent focused on career growth, youth transfers, and transparent representation. He partners with clubs and academies across Africa, Europe, and the U.S. to unlock global opportunities.
//                 </p>
//                 <div className="flex flex-wrap gap-3">
//                   <span className="bg-accent-red/-10 text-accent-red px-3 py-1 rounded-full text-sm border border-accent-red border/20">FIFA Licensed (Minors & Adults)</span>
//                   <span className="bg-accent-green/-10 text-accent-green px-3 py-1 rounded-full text-sm border border-accent-green border/20">25+ Years in Football</span>
//                   <span className="bg-accent-amber/-10 text-accent-amber px-3 py-1 rounded-full text-sm border border-accent-amber border/20">Global Club Network</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Career Timeline */}
//       <section className="pb-16 md:pb-24">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <h2 className="font-poppins font-bold text-3xl text-center mb-12">Career Timeline</h2>
//           <div className="relative">
//             <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-accent-red"></div>
//             {[
//               {
//                 date: '1999 - 2008',
//                 title: 'Amateur Football Career',
//                 desc: 'Active as an amateur player, developing a deep understanding of grassroots football and the player’s journey.',
//                 dotColor: 'bg-accent-red',
//                 alignRight: false,
//               },
//               {
//                 date: '2009 - 2017',
//                 title: 'Youth Talent Spotter & Football Writer',
//                 desc: 'Began contributing to football publications and working with local academies, identifying young prospects and sharing insight through analysis.',
//                 dotColor: 'bg-accent-green',
//                 alignRight: true,
//               },
//               {
//                 date: '2018 - 2021',
//                 title: 'Certified Football Scout',
//                 desc: 'Earned PFSA certification in the UK and scouted players across African academies, building key relationships with international clubs.',
//                 dotColor: 'bg-accent-amber',
//                 alignRight: false,
//               },
//               {
//                 date: '2022 - Present',
//                 title: 'FIFA Licensed Agent & Founder of FootballBank',
//                 desc: 'Established FootballBank to formally represent players, manage transfers, and create opportunities globally with a focus on youth development.',
//                 dotColor: 'bg-accent-red',
//                 alignRight: true,
//               },
//             ].map(({ date, title, desc, dotColor, alignRight }, i) => (
//               <div
//                 key={i}
//                 className={`relative flex items-center mb-12 ${alignRight ? 'md:flex-row-reverse' : ''}`}
//               >
//                 <div className={`absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 ${dotColor} rounded-full border-4 border-primary-bg`} />
//                 <div className={`ml-12 md:ml-0 md:w-1/2 ${alignRight ? 'md:pl-8' : 'md:pr-8'}`}>
//                   <div className="bg-primary-card rounded-xl p-6 border border-divider shadow-lg">
//                     <span className="text-accent-amber font-semibold text-sm">{date}</span>
//                     <h3 className="font-poppins font-semibold text-xl mb-2">{title}</h3>
//                     <p className="text-primary-muted">{desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Core Values */}
//       <section className="pb-16 md:pb-24">
//         <div className="container mx-auto px-4 max-w-6xl">
//           <h2 className="font-poppins font-bold text-3xl text-center mb-12">Our Core Values</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: 'Integrity',
//                 icon: 'fa-handshake',
//                 color: 'red',
//                 desc: 'We uphold the highest standards of transparency and ethics in every representation, negotiation, and transfer.',
//               },
//               {
//                 title: 'Opportunity',
//                 icon: 'fa-door-open',
//                 color: 'green',
//                 desc: 'We unlock doors to international clubs, academies, and trials—connecting talent to the world stage.',
//               },
//               {
//                 title: 'Development',
//                 icon: 'fa-chart-line',
//                 color: 'amber',
//                 desc: 'From grassroots to global, we prioritize player growth with coaching, mentorship, and career planning.',
//               },
//             ].map(({ title, icon, color, desc }) => (
//               <div
//                 key={title}
//                 className={`bg-primary-card rounded-xl p-8 border border-divider shadow-lg text-center hover:border-accent-${color} transition-colors`}
//               >
//                 <div className={`w-16 h-16 bg-accent-${color}/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
//                   <i className={`fa-solid ${icon} text-accent-${color} text-2xl`} />
//                 </div>
//                 <h3 className={`font-poppins font-semibold text-2xl mb-4 text-accent-${color}`}>{title}</h3>
//                 <p className="text-primary-muted leading-relaxed">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="pb-16 md:pb-24">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="bg-gradient-to-r from-accent-red to-accent-green rounded-xl p-8 md:p-12 text-center shadow-lg">
//             <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-6 text-white">Ready to Take the Next Step?</h2>
//             <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
//               Whether you're a rising star or a seasoned player, FootballBank is here to represent you with purpose, precision, and global reach.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href={'/contact'} className="bg-white text-accent-red px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
//                 Schedule Consultation
//               </Link>
//               <Link href={'/submit-profile'} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-red transition-colors">
//                 Submit Your Profile
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// };

// export default AboutAgent;
