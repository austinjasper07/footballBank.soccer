import Image from "next/image";
import Link from "next/link";
import "aos/dist/aos.css";
import { getDictionary } from "@/lib/dictionaries";
import { getAgentInfo } from "@/actions/adminActions";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.agentPage.metadata.title,
    description: dict.agentPage.metadata.description,
  };
}

const AboutAgent = async ({ params }) => {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const agentInfo = await getAgentInfo();

  return (
    <main className=" text-primary-text min-h-screen">
      {/* Hero Section with Enhanced Profile Layout */}
      <section className="pb-12 pt-20 " data-aos="fade-up">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Side - Enhanced Profile Card */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="bg-primary-card rounded-2xl p-8 shadow-xl border border-divider/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <Image
                      src={agentInfo?.profilePhoto || "/FootballBank_agent.jpg"}
                      alt={`${agentInfo?.name || "Ayodeji Fatade"} headshot`}
                      width={140}
                      height={175}
                      className="rounded-xl border-3 border-accent-red object-cover shadow-lg"
                    />
                    {/* Verification badge */}
                    <div className="absolute -top-2 -right-2 bg-accent-green text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                      <i className="fa-solid fa-check text-sm"></i>
                    </div>
                  </div>

                  {/* Enhanced name and credentials */}
                  <h2 className="font-bold text-3xl text-primary-text">
                    {agentInfo?.name || dict.agentPage.hero.name}
                  </h2>

                  {/* Enhanced license display */}
                  <div className="bg-gradient-to-r from-accent-green/10 to-accent-green/5 rounded-xl p-4 border border-accent-green/20">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <i className="fa-solid fa-certificate text-accent-green text-xl" />
                      <span className="font-bold text-primary-text">
                        {dict.agentPage.hero.license.title || agentInfo?.credentials}
                      </span>
                    </div>
                    <p className="text-sm text-primary-muted">
                      {dict.agentPage.hero.license.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="space-y-8">
                <div>
                  <h1 className="font-bold text-[clamp(1.5rem,5vw,2rem)] mb-2 leading-tight text-primary-text">
                    {dict.agentPage.hero.title}
                  </h1>
                </div>

                <div className="bg-primary-card/50 rounded-2xl p-4 border border-divider/30 backdrop-blur-sm">
                  <p className="text-primary-muted leading-relaxed text-xl mb-6">
                    {dict.agentPage.hero.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-red/10 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-calendar text-accent-red"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-primary-text">
                          {dict.agentPage.hero.stats.experience.title}
                        </p>
                        <p className="text-sm text-primary-muted">
                          {dict.agentPage.hero.stats.experience.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-green/10 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-graduation-cap text-accent-green"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-primary-text">
                          {dict.agentPage.hero.stats.certification.title}
                        </p>
                        <p className="text-sm text-primary-muted">
                          {dict.agentPage.hero.stats.certification.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-amber/10 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-globe text-accent-amber"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-primary-text">
                          {dict.agentPage.hero.stats.network.title}
                        </p>
                        <p className="text-sm text-primary-muted">
                          {dict.agentPage.hero.stats.network.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-red/10 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-trophy text-accent-red"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-primary-text">
                          {dict.agentPage.hero.stats.focus.title}
                        </p>
                        <p className="text-sm text-primary-muted">
                          {dict.agentPage.hero.stats.focus.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-primary-muted leading-relaxed text-lg">
                    {dict.agentPage.hero.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Core Values */}
      <section
        className="py-12 bg-gradient-to-br from-primary-card/20 to-primary-bg"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-bold text-[clamp(2rem,4vw,3rem)] mb-4 bg-gradient-to-r from-primary-text to-accent-red bg-clip-text text-transparent">
              {dict.agentPage.coreValues.title}
            </h2>
            <p className="text-primary-muted text-xl max-w-3xl mx-auto">
              {dict.agentPage.coreValues.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dict.agentPage.coreValues.values.map(
              ({ title, icon, color, desc, features }, i) => (
                <div
                  key={title}
                  className="group bg-primary-card rounded-2xl p-8 border border-divider/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-accent-red/30 backdrop-blur-sm"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 bg-accent-${color}/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <i
                        className={`fa-solid ${icon} text-accent-${color} text-2xl`}
                      />
                    </div>
                    <h3
                      className={`font-bold text-2xl mb-3 text-accent-${color}`}
                    >
                      {title}
                    </h3>
                  </div>

                  <p className="text-primary-muted leading-relaxed mb-6 text-center">
                    {desc}
                  </p>

                  <div className="space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 bg-accent-${color} rounded-full flex-shrink-0`}
                        ></div>
                        <span className="text-sm text-primary-muted">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section
        className="py-20 bg-gradient-to-br from-accent-red to-red-600"
        data-aos="zoom-in-up"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-bold text-[clamp(2.5rem,5vw,4rem)] mb-6 text-white leading-tight">
              {dict.agentPage.cta.title}
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {dict.agentPage.cta.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-calendar-check text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">
                    {dict.agentPage.cta.consultation.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {dict.agentPage.cta.consultation.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                {dict.agentPage.cta.consultation.description}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-user-plus text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">
                    {dict.agentPage.cta.profile.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {dict.agentPage.cta.profile.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                {dict.agentPage.cta.profile.description}
              </p>
            </div>
          </div>

			<div className="flex flex-col md:flex-row gap-6 justify-center">
				<Link href={`/${lang}/contact`} className="group w-full md:w-auto">
					<span className="bg-white text-accent-red px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-300 inline-flex items-center gap-3 justify-center shadow-xl hover:shadow-2xl transform hover:scale-105 w-full md:w-auto">
                <i className="fa-solid fa-calendar-plus"></i>
                {dict.agentPage.cta.buttons.consultation}
              </span>
            </Link>
				<Link href={`/${lang}/submit-profile`} className="group w-full md:w-auto">
					<span className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-accent-red transition-all duration-300 inline-flex items-center gap-3 justify-center backdrop-blur-sm hover:shadow-xl transform hover:scale-105 w-full md:w-auto">
                <i className="fa-solid fa-file-upload"></i>
                {dict.agentPage.cta.buttons.profile}
              </span>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/70 text-sm">
              <i className="fa-solid fa-shield-check mr-2"></i>
              {dict.agentPage.cta.trust}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutAgent;
