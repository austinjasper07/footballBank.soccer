import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { getDictionary } from '@/lib/dictionaries'

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: dict.termsOfService?.title || "Terms of Service - FootballBank.soccer",
    description: dict.termsOfService?.sections?.acceptance?.content?.slice(0, 160) || "Read our Terms of Service for FootballBank.soccer.",
    keywords: [
      "terms of service",
      "user agreement",
      "legal terms",
      "football platform",
      "service terms",
      "user policies",
      "legal agreement"
    ],
    url: `/${lang}/terms-of-service`,
    type: "website"
  });
}

export default async function TermsOfServicePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const order = [
    'acceptance',
    'useOfServices',
    'accountRegistration',
    'contentSubmissions',
    'intellectualProperty',
    'limitationOfLiability',
    'termination',
    'governingLaw',
    'changes',
    'contact'
  ];
  const sections = order
    .map(key => dict.termsOfService?.sections?.[key])
    .filter(Boolean)
    .map((s, idx) => ({ title: s.title, content: s.content }));

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center text-sm text-gray-600">
          <Link href={`/${lang}`} className="flex items-center gap-2 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" />
            {dict.navigation?.home || 'Home'}
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{dict.termsOfService?.lastUpdated || 'Last updated: December 2024'}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {dict.termsOfService?.title || 'Terms of Service'}
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {dict.termsOfService?.intro || 'Please read these Terms of Service carefully before using FootballBank.soccer.'}
          </p>
        </div>
      </section>

      {/* Terms Body */}
      <main className="max-w-3xl mx-auto px-6 py-8 md:py-12">
        {sections.map((section, idx) => (
          <section key={idx} className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
              {section.title}
            </h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </section>
        ))}

        {/* Legal Note */}
        <div className="mt-12 md:mt-16 border-t border-gray-200 pt-6 text-xs md:text-sm text-gray-600 leading-relaxed">
          <p>
            {dict.termsOfService?.footerNote || 'These Terms of Service constitute the entire agreement between you and FootballBank.soccer regarding your use of our services.'}
          </p>
        </div>
      </main>
    </div>
  )
}
