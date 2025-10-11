import React from "react";
import { Calendar } from "lucide-react";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { getDictionary } from '@/lib/dictionaries'

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: "Privacy Policy - FootballBank",
    description: "Read our Privacy Policy for FootballBank.soccer. Learn how we collect, use, and protect your personal information on our football talent platform.",
    keywords: [
      "privacy policy",
      "data protection",
      "personal information",
      "privacy rights",
      "data security",
      "user privacy",
      "GDPR compliance"
    ],
    url: "/privacy-policy",
    type: "website"
  });
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `
We collect personal information such as your name, email address, and phone number when you register or interact with FootballBank.soccer. 
We may also collect player information like bios, videos, and statistics, as well as technical data such as your IP address, browser type, and usage behavior. 
Cookies and similar technologies are used to enhance site functionality and analyze user activity.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `
We use your data to operate, improve, and personalize our services. 
This includes managing user accounts, processing inquiries, enabling player profiles, and providing relevant updates or communications. 
Your data helps us deliver a more secure and optimized experience.`,
    },
    {
      title: "3. Sharing Your Information",
      content: `
We never sell your data. 
We may share your information with trusted partners, football clubs, or agents—with your consent—or as required by law. 
All third-party partners are obligated to handle your data securely and in compliance with applicable regulations.`,
    },
    {
      title: "4. Data Security",
      content: `
We use advanced encryption, secure servers, and regular audits to protect your personal data. 
While no system is entirely immune, we strive to maintain the highest security standards to prevent unauthorized access or misuse.`,
    },
    {
      title: "5. Cookies and Tracking",
      content: `
FootballBank.soccer uses cookies to ensure essential site functionality, analyze performance, and remember preferences. 
You can manage or disable cookies in your browser settings, but some parts of the site may not function properly without them.`,
    },
    {
      title: "6. Your Rights and Choices",
      content: `
You have the right to access, correct, or delete your personal data. 
You can also withdraw consent or opt out of communications at any time by contacting us. 
We aim to respond to all data requests promptly and transparently.`,
    },
    {
      title: "7. Children's Privacy",
      content: `
Our platform is not intended for children under 13 years old. 
We do not knowingly collect personal data from minors without parental consent. 
If you believe a child has provided us with personal data, please contact us immediately for removal.`,
    },
    {
      title: "8. Updates to This Policy",
      content: `
We may revise this Privacy Policy periodically to reflect legal, technical, or operational changes. 
The updated version will always be posted on this page, and significant updates will be communicated clearly.`,
    },
    {
      title: "9. Contact Us",
      content: `
If you have any questions about this Privacy Policy or your personal data, please contact us at:
contact@footballbank.soccer.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex justify-between items-center text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900 transition">
            ← Back to Home
          </a>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Effective Date: August 23, 2025</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-6 sm:py-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Your privacy matters. This Privacy Policy explains how
            FootballBank.soccer collects, uses, and protects your information
            when you use our services.
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700  sm:mb-1">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {section.content}
            </p>
          </section>
        ))}

        {/* Footer Legal Notice */}
        <div className="border-t border-gray-200 pt-6 mt-8 text-sm text-gray-600 leading-relaxed">
          <p className="mb-4">
            This Privacy Policy outlines how FootballBank.soccer handles your
            personal data with transparency and care. By using our platform, you
            consent to the practices described here.
          </p>
          <p className="text-gray-500">
            © {new Date().getFullYear()} FootballBank.soccer — All rights
            reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
