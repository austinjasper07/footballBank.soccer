'use client'

import Image from 'next/image'
import FAQ from './FAQ'

const colorMap = {
  'accent-red': 'text-accent-red',
  'accent-amber': 'text-accent-amber',
  'primary-bg': 'text-primary-bg',
}

const buttonClassMap = {
  'accent-red': 'bg-accent-red text-white hover:bg-accent-red/80',
  'accent-amber': 'bg-accent-amber text-primary-bg hover:bg-accent-amber/80',
  'primary-bg': 'bg-primary-bg text-primary-text border hover:bg-accent-red hover:text-white',
}

export default function ProfileSubmission() {
  return (
    <main className="bg-primary-bg text-primary-text text-center py-16">
      <h1 className=" font-bold text-5xl mb-6 bg-gradient-to-r from-accent-red to-accent-amber bg-clip-text text-transparent">
        Submit Your Profile to Be Discovered
      </h1>
      <p className="text-xl text-primary-muted mb-8">
        Choose a plan that suits your career goals and get seen by clubs worldwide.
      </p>

      {/* Pricing Tiers */}
      <section className="container mx-auto px-4 text-center py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              id: 'basic',
              title: 'Basic',
              price: '$10',
              highlight: false,
              features: [
                '1 video highlight link',
                'Basic profile listing',
                '30-day visibility',
                'Email confirmation',
              ],
              exclusions: ['Priority placement', 'Scout feedback'],
              color: 'primary-bg',
              btn: 'Select Basic',
            },
            {
              id: 'standard',
              title: 'Standard',
              price: '$25',
              highlight: true,
              features: [
                '3 video highlight links',
                'Priority listing placement',
                '90-day visibility',
                'Fast-track approval (24h)',
                'Enhanced profile features',
              ],
              exclusions: ['Detailed scout feedback'],
              color: 'accent-red',
              btn: 'Select Standard',
            },
            {
              id: 'pro',
              title: 'Pro',
              price: '$80',
              highlight: false,
              features: [
                'Unlimited video links',
                'Featured placement (top)',
                '6-month visibility',
                'Instant approval',
                'Premium profile badge',
                'Detailed scout feedback',
              ],
              exclusions: [],
              color: 'accent-amber',
              btn: 'Select Pro',
            },
          ].map(({ id, title, price, highlight, features, exclusions, color, btn }) => (
            <div
              key={id}
              className={`relative rounded-2xl p-8 shadow-2xl border ${
                highlight ? `border-2 border-${color}` : 'border-divider'
              } bg-primary-secondary transform ${
                highlight ? 'scale-105' : 'hover:scale-105'
              } transition-all duration-300`}
            >
              {highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent-red text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className=" font-bold text-2xl mb-2">{title}</h3>
                <div className="flex justify-center items-center mb-4">
                  <span className={`text-5xl font-bold ${colorMap[color] || ''}`}>{price}</span>
                  <span className="text-primary-muted ml-2">/submission</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 text-left">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <i className="fa-solid fa-check text-accent-green" />
                    <span>{feat}</span>
                  </li>
                ))}
                {exclusions.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary-muted">
                    <i className="fa-solid fa-times" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                  buttonClassMap[color] || ''
                }`}
              >
                {btn}
              </button>
            </div>
          ))}
        </div>
      </section>

      <FAQ />

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className=" font-bold text-4xl md:text-5xl mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-primary-muted">
              Players who found their dream clubs through FootballBank
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Marcus Silva',
                club: '→ Real Madrid CF',
                flag: '🇧🇷',
                img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
                quote:
                  'FootballBank helped me get noticed by top European clubs. The Pro plan was worth every penny!',
              },
              {
                name: 'Emma Johnson',
                club: '→ Chelsea FC Women',
                flag: '🇺🇸',
                img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
                quote:
                  'The detailed feedback from scouts helped me improve my game before signing with Chelsea.',
              },
              {
                name: 'Ahmed Hassan',
                club: '→ AC Milan',
                flag: '🇪🇬',
                img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
                quote:
                  'Started with the Basic plan and got scouted within 2 weeks. Now playing in Serie A!',
              },
            ].map(({ name, club, flag, img, quote }, i) => (
              <div
                key={i}
                className="bg-primary-secondary rounded-2xl border border-divider p-8 text-center shadow-2xl"
              >
                <Image
                  src={img}
                  alt={name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-accent-green object-cover"
                />
                <h3 className=" font-semibold text-lg mb-2">{name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">{flag}</span>
                  <span className="text-primary-muted">{club}</span>
                </div>
                <p className="text-primary-muted italic">&quot;{quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        id="final-cta"
        className="py-16 md:py-24 bg-gradient-to-r from-accent-red to-accent-amber"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className=" font-bold text-4xl md:text-5xl mb-6 text-white">
            Ready to Showcase Your Talent?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of players who have taken the next step in their football career
          </p>
          <button className="bg-white text-accent-red hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl">
            Start Your Submission
          </button>
        </div>
      </section>
    </main>
  )
}
