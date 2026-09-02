import React from "react";
import { Calendar } from "lucide-react";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { getDictionary } from '@/lib/dictionaries'

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: dict.privacyPolicy?.title || "Privacy Policy - FootballBank.soccer",
    description: dict.privacyPolicy?.sections?.informationWeCollect?.content?.slice(0,160) || "Read our Privacy Policy for FootballBank.soccer.",
    keywords: [
      "privacy policy",
      "data protection",
      "personal information",
      "privacy rights",
      "data security",
      "user privacy",
      "GDPR compliance"
    ],
    url: `/${lang}/privacy-policy`,
    type: "website"
  });
}

export default async function PrivacyPolicyPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const order = [
    'informationWeCollect',
    'howWeUseYourInformation',
    'sharingYourInformation',
    'dataSecurity',
    'cookiesAndTracking',
    'yourRightsAndChoices',
    'childrensPrivacy',
    'internationalTransfers',
    'changesToPolicy',
    'contactUs'
  ];
  const sections = order
    .map(key => dict.privacyPolicy?.sections?.[key])
    .filter(Boolean)
    .map(s => ({ title: s.title, content: s.content }));

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      {/* Header */}
      <header className="border-b border-divider bg-primary-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex justify-between items-center text-sm text-primary-muted">
          <a href={`/${lang}`} className="hover:text-primary-text transition">
            ← {dict.navigation?.home || 'Home'}
          </a>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{dict.privacyPolicy?.lastUpdated || 'Last updated: December 2024'}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-surface py-6 sm:py-10 border-b border-divider">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text mb-2 leading-tight">
            {dict.privacyPolicy?.title || 'Privacy Policy'}
          </h1>
          <p className="text-base md:text-lg text-primary-muted leading-relaxed max-w-2xl mx-auto">
            {dict.privacyPolicy?.intro || 'Your privacy matters. This Privacy Policy explains how FootballBank.soccer collects, uses, and protects your information when you use our services.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-6 sm:py-10">
        {sections.map((section, idx) => (
          <section
            key={idx}
            className="mb-4 sm:mb-6 last:mb-0 scroll-mt-20"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-primary-text  sm:mb-1">
              {section.title}
            </h2>
            <p className="text-primary-muted leading-relaxed text-sm md:text-base whitespace-pre-line">
              {section.content}
            </p>
          </section>
        ))}

        {/* Footer Legal Notice */}
        <div className="border-t border-divider pt-6 mt-8 text-sm text-primary-muted leading-relaxed">
          <p className="mb-4">
            {dict.privacyPolicy?.footerNote || 'This Privacy Policy outlines how FootballBank.soccer handles your personal data with transparency and care. By using our platform, you consent to the practices described here.'}
          </p>
          <p className="text-primary-muted">
            © {new Date().getFullYear()} FootballBank.soccer — {dict.footer?.allRightsReserved || 'All rights reserved.'}
          </p>
        </div>
      </main>
    </div>
  );
}
