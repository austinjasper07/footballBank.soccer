import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { getDictionary } from '@/lib/dictionaries'

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: "Terms of Service - FootballBank",
    description: "Read our Terms of Service for FootballBank.soccer. Learn about our user agreements, service terms, and legal policies for our football talent platform.",
    keywords: [
      "terms of service",
      "user agreement",
      "legal terms",
      "football platform",
      "service terms",
      "user policies",
      "legal agreement"
    ],
    url: "/terms-of-service",
    type: "website"
  });
}

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `
      By accessing or using FootballBank.soccer, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
      If you do not agree with these terms, you are prohibited from using this site. 
      You confirm that you are at least 18 years of age, or have the consent of a legal guardian.`
    },
    {
      title: "2. Use of Services",
      content: `
      FootballBank.soccer provides digital tools for players, agents, and clubs to share and access football-related data. 
      You agree to use these services only for lawful purposes and in compliance with all applicable laws. 
      You must not interfere with the security, availability, or integrity of our platform.`
    },
    {
      title: "3. Account Registration",
      content: `
      Some services require registration. You must provide accurate information and keep your login credentials confidential. 
      You are responsible for any activity under your account. We reserve the right to suspend or terminate accounts that violate our terms.`
    },
    {
      title: "4. Content Submissions",
      content: `
      By uploading player profiles, videos, or other materials, you grant FootballBank.soccer a worldwide, non-exclusive, royalty-free license 
      to use, display, and promote that content for the purpose of operating and improving our services. 
      You confirm you own the rights or have permission to submit such content.`
    },
    {
      title: "5. Intellectual Property",
      content: `
      All site materials, including text, graphics, and trademarks, are the property of FootballBank.soccer or its licensors. 
      You may not copy, modify, or distribute any part of the website without explicit written consent.`
    },
    {
      title: "6. Limitation of Liability",
      content: `
      FootballBank.soccer and its affiliates are not liable for indirect, incidental, or consequential damages arising from your use of the site. 
      All services are provided "as is" without warranties of any kind.`
    },
    {
      title: "7. Termination",
      content: `
      We reserve the right to suspend or terminate access to our services at our discretion, without notice, if you violate these terms 
      or act in a way that harms FootballBank.soccer or its users.`
    },
    {
      title: "8. Changes to Terms",
      content: `
      We may revise these terms at any time by updating this page. 
      Continued use of FootballBank.soccer after such changes constitutes your acceptance of the updated terms.`
    },
    {
      title: "9. Contact Us",
      content: `
      For questions or concerns regarding these Terms of Service, please contact us at:
      contact@footballbank.soccer.`
    }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Last updated: August 23, 2025</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Please read these Terms of Service carefully before using FootballBank.soccer.
            By continuing to use our website or services, you acknowledge that you have read, understood, and agreed to be bound by these terms.
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
            These Terms of Service constitute the entire agreement between you and FootballBank.soccer regarding your use of our services.
            If any part of these terms is deemed invalid or unenforceable, the remaining provisions will remain in full effect.
          </p>
        </div>
      </main>
    </div>
  )
}
