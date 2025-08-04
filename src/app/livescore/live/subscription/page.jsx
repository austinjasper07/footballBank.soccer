'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const plans = [
  {
    title: 'Match Pass',
    price: '$4.99',
    period: 'match',
    icon: 'fa-play',
    iconColor: 'text-accent-red',
    iconBg: 'bg-accent-red/10',
    features: [
      'Single match access',
      'HD streaming quality',
      '2-hour replay access',
      'Mobile & desktop support',
    ],
    buttonLabel: 'Buy Match Pass',
    buttonClass:
      'w-full bg-primary-bg border border-accent-red text-accent-red hover:bg-accent-red hover:text-white py-3 rounded-lg font-semibold transition-all',
    cardClass:
      'bg-primary-card rounded-2xl p-8 border border-divider hover:border-accent-red transition-all transform hover:scale-105 shadow-sm hover:shadow-lg',
  },
  {
    title: 'Monthly Pass',
    price: '$14.99',
    period: 'month',
    icon: 'fa-calendar-days',
    iconColor: 'text-accent-red',
    iconBg: 'bg-accent-red/10',
    features: [
      'Unlimited matches',
      'Full HD + 4K streaming',
      '7-day replay access',
      'Ad-free experience',
      'Live chat access',
      '3 device streaming',
    ],
    buttonLabel: 'Start Monthly Plan',
    buttonClass:
      'w-full bg-accent-red hover:bg-opacity-90 text-white py-3 rounded-lg font-semibold transition-all',
    cardClass:
      'bg-primary-card rounded-2xl p-8 border-2 border-accent-red relative hover:border-accent-green transition-all transform hover:scale-105 shadow-lg',
    popular: true,
  },
  {
    title: 'Season Pass',
    price: '$59.99',
    period: 'season',
    icon: 'fa-trophy',
    iconColor: 'text-accent-green',
    iconBg: 'bg-accent-green/10',
    features: [
      'All season matches',
      'Premium 4K streaming',
      'Unlimited replay access',
      'Exclusive content',
      'Priority support',
      '5 device streaming',
    ],
    tag: 'Save 66%',
    buttonLabel: 'Get Season Pass',
    buttonClass:
      'w-full bg-accent-green hover:bg-opacity-90 text-white py-3 rounded-lg font-semibold transition-all',
    cardClass:
      'bg-primary-card rounded-2xl p-8 border border-divider hover:border-accent-green transition-all transform hover:scale-105 shadow-sm hover:shadow-lg',
  },
]

const comparisonRows = [
  { feature: 'Streaming Quality', values: ['HD', 'Full HD + 4K', 'Premium 4K'] },
  { feature: 'Replay Access', values: ['2 hours', '7 days', 'Unlimited'] },
  { feature: 'Device Limit', values: ['2', '3', '5'] },
  { feature: 'Ad-Free', values: [false, true, true] },
  { feature: 'Live Chat', values: [false, true, true] },
  { feature: 'Priority Support', values: [false, false, true] },
]

const testimonials = [
  {
    quote: 'The streaming quality is incredible. Never missed a goal since I subscribed!',
    name: 'Marcus Johnson',
    role: 'Football Fan',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
  },
  {
    quote: 'Love the replay feature. I can catch up on matches I missed during work.',
    name: 'Sarah Mitchell',
    role: 'Season Pass Holder',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
  },
  {
    quote: 'Best value for money. The season pass pays for itself in just a few matches.',
    name: 'David Rodriguez',
    role: 'Monthly Subscriber',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
  },
]

const StreamingPricingPage = () => {
  useEffect(() => {
    window.scrollToPricing = () => {
      const pricingSection = document.getElementById('pricing-section')
      pricingSection?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <main id="streaming-pricing-page" className="min-h-screen bg-primary-bg font-inter text-primary-text">
      {/* Pricing */}
      <section id="pricing-section" className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl mb-4">Choose Your Streaming Plan</h2>
          <p className="text-primary-muted text-lg max-w-2xl mx-auto">
            Flexible options to fit your football viewing needs. All plans include HD streaming and mobile support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.title} className={plan.cardClass}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent-red text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <div className={`${plan.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`fa-solid ${plan.icon} ${plan.iconColor} text-2xl`}></i>
                </div>
                <h3 className="font-poppins font-bold text-xl mb-2">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-primary-muted">/{plan.period}</span>
                </div>
                {plan.tag && (
                  <div className="bg-accent-green/10 text-accent-green px-3 py-1 rounded-full text-sm font-semibold mb-6">
                    {plan.tag}
                  </div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="text-primary-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={plan.buttonClass}>{plan.buttonLabel}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-poppins font-bold text-2xl text-center mb-12">Compare All Features</h3>
          <div className="bg-primary-card rounded-2xl border border-divider shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-primary-bg">
                <tr>
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold">Match Pass</th>
                  <th className="text-center p-6 font-semibold text-accent-red">Monthly Pass</th>
                  <th className="text-center p-6 font-semibold text-accent-green">Season Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {comparisonRows.map(({ feature, values }) => (
                  <tr key={feature}>
                    <td className="p-6">{feature}</td>
                    {values.map((value, idx) => (
                      <td key={idx} className="text-center p-6">
                        {typeof value === 'boolean' ? (
                          <i className={`fa-solid ${value ? 'fa-check text-accent-green' : 'fa-xmark text-accent-red'}`} />
                        ) : (
                          <span className="text-primary-muted">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-poppins font-bold text-2xl text-center mb-12">What Our Viewers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ quote, name, role, avatar }, idx) => (
              <div key={idx} className="bg-primary-card rounded-2xl p-6 border border-divider shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-accent-amber" />
                  ))}
                </div>
                <p className="text-primary-muted mb-4">&ldquo;{quote}&ldquo;</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={avatar}
                    alt={name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-primary-muted">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Placeholder */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-primary-muted">
          <h3 className="font-poppins font-bold text-2xl mb-6 text-primary-text">Frequently Asked Questions</h3>
          <p>Coming soon...</p>
        </div>
      </section>
    </main>
  )
}

export default StreamingPricingPage
