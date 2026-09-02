
import React from 'react'
import Link from 'next/link'
import { getDictionary } from '@/lib/dictionaries'
import { Button } from '@/components/ui/button'
import {
  Users,
  Globe,
  Shield,
  Heart,
  Award,
  Search,
  Users2,
  Briefcase,
  CheckCircle,
} from 'lucide-react'
import "aos/dist/aos.css"

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const values = [
    {
      icon: Shield,
      title: dict.about.valuesItems.integrity,
      description: dict.about.valuesDescriptions?.integrity || dict.about.valuesItems.integrity
    },
    {
      icon: Award,
      title: dict.about.valuesItems.excellence,
      description: dict.about.valuesDescriptions?.excellence || dict.about.valuesItems.excellence
    },
    {
      icon: Globe,
      title: dict.about.valuesItems.opportunity,
      description: dict.about.valuesDescriptions?.opportunity || dict.about.valuesItems.opportunity
    },
    {
      icon: Heart,
      title: dict.about.valuesItems.innovation,
      description: dict.about.valuesDescriptions?.innovation || dict.about.valuesItems.innovation
    }
  ]

  const iconMap = [Users, Search, Users2, Briefcase];
  const whatWeDo = (dict.about?.whatWeDo?.items || []).map((item, index) => ({
    icon: iconMap[index],
    title: item.title,
    description: item.description
  }))

  return (
    <div className="bg-white max-w-6xl mx-auto">
      {/* Hero — left-aligned, editorial rather than centered */}
      <section className="border-b border-gray-200 py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <p
              className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-4"
              data-aos="fade-up"
            >
              {dict.about?.badge || "About Us"}
            </p>
            <h1
              className="font-bold text-2xl lg:text-4xl leading-[1.05] tracking-tight text-[#0B1220] mb-6"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              {dict.about.title}
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {dict.about.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3" data-aos="fade-up" data-aos-delay="150">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full" asChild>
                <Link href={`/${lang}/submit-profile`}>
                  {dict.navigation.submitProfile}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-gray-500 text-[#0B1220] hover:border-blue-600 hover:text-white px-7 py-3 rounded-full "
                asChild
              >
                <Link href={`/${lang}/contact`}>
                  {dict.about?.joinMovement?.buttons?.contactUs || "Contact Us"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision — narrative masthead pairs, not boxed cards */}
      <section className="py-20 border-b border-gray-200" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-4 lg:gap-10 mb-16">
            <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase pt-1">
              01 · {dict.about.mission}
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg max-w-2xl">
                {dict.about.missionText}
              </p>
              <ul className="space-y-3">
                {(dict.about?.missionItems || [
                  "Identify and represent emerging football talent from underrepresented regions",
                  "Provide transparent and structured platform for player visibility",
                  "Deliver tailored career support and representation",
                  "Foster ethical football agency practices"
                ]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-gray-600 text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-4 lg:gap-10">
            <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase pt-1">
              02 · {dict.about.vision}
            </div>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg max-w-2xl">
              {dict.about.visionText}
            </p>
          </div>
        </div>
      </section>

      {/* What We Do — inline row list instead of a card grid */}
      <section className="py-20 bg-[#F9FAFB]" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-3">
              {dict.about?.whatWeDoSection?.title || "What We Do"}
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {dict.about?.whatWeDoSection?.subtitle || "FootballBank.soccer is more than just a player database—we're a digital ecosystem where talent meets opportunity."}
            </p>
          </div>

          <div className="border-t border-gray-200">
            {whatWeDo.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[40px_200px_1fr] gap-2 md:gap-8 items-start py-6 border-b border-gray-200"
                  // data-aos="fade-up"
                  // data-aos-delay={index * 60}
                >
                  {IconComponent && <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />}
                  <h3 className="font-bold text-[#0B1220] text-base md:text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Values — flat strip, divided by rules instead of cards */}
      <section className="py-16" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-3">
              {dict.about.values}
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {dict.about?.valuesSection?.subtitle || "The principles that guide everything we do at FootballBank.soccer"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l-0 lg:border-l border-gray-200">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={index}
                  className="py-6 px-0 lg:px-8 lg:first:pl-0 border-b lg:border-b-0 lg:border-r last:border-r-0 border-gray-200"
                  // data-aos="fade-up"
                  // data-aos-delay={index * 80}
                >
                  <IconComponent className="w-5 h-5 text-blue-600 mb-3" />
                  <h3 className="font-bold text-[#0B1220] text-base md:text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Join the Movement — asymmetric split instead of centered stack */}
      <section className="py-20" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="bg-[#0B1220] rounded-3xl p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {dict.about?.joinMovement?.title || "Join the Movement"}
                </h2>
                <p className="text-gray-300 leading-relaxed max-w-xl mb-2 text-base md:text-lg">
                  {dict.about?.joinMovement?.subtitle || "Whether you're a footballer ready to be seen, a scout seeking fresh talent, or a supporter of grassroots development—FootballBank.soccer is your trusted partner in the beautiful game."}
                </p>
                <p className="text-gray-500 text-sm md:text-base">
                  {dict.about?.joinMovement?.description || "Let's connect talent to opportunity."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full" asChild>
                  <Link href={`/${lang}/submit-profile`}>
                    {dict.about?.joinMovement?.buttons?.getStarted || "Get Started"}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-white/30 text-white hover:bg-white/10 px-7 py-3 rounded-full"
                  asChild
                >
                  <Link href={`/${lang}/contact`}>
                    {dict.about?.joinMovement?.buttons?.contactUs || "Contact Us"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact — simple closing line */}
      <section className="pb-24 pt-4" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-[#0B1220]/25 mb-3">
            {dict.about?.contactSection?.title || "Get in Touch"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-base md:text-lg">
            {dict.about?.contactSection?.subtitle || "Ready to take the next step? We're here to help you achieve your football dreams."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full" asChild>
              <a href="mailto:contact@footballbank.soccer">
                {dict.about?.contactSection?.buttons?.email || "contact@footballbank.soccer"}
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-gray-300 text-[#0B1220] hover:border-blue-600 hover:text-blue-600 px-7 py-3 rounded-full"
              asChild
            >
              <Link href={`/${lang}/career-tips`}>
                {dict.about?.contactSection?.buttons?.learnMore || "Learn More"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}