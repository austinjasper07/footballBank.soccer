'use client'

import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ExternalLink } from 'lucide-react'
import "aos/dist/aos.css"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const faqData = [
    {
      id: 'about-1',
      question: 'What is FootballBank.soccer?',
      answer: 'A player representation and talent-banking platform. We scout, prepare, and place players with clubs and academies, and we publish verified player profiles, highlights, and live scores.'
    },
    {
      id: 'about-2',
      question: 'Are you a licensed agent?',
      answer: 'Yes. Representation is led by a FIFA-licensed Football Agent (ID: 202309-4469).'
    },
    {
      id: 'about-3',
      question: 'Where are you based and where do you operate?',
      answer: 'Based in New Jersey, USA, with active networks across the USA, Europe (UK, Spain, Turkey, Belgium, Scotland, Poland), Africa (including Nigeria), and beyond.'
    },
    {
      id: 'about-4',
      question: 'Do you guarantee trials or contracts?',
      answer: 'No. We don\'t sell promises. We evaluate, advocate, and present the right profiles to the right clubs. Final decisions rest with clubs.'
    },
    {
      id: 'players-1',
      question: 'How do I submit my profile?',
      answer: 'Use our player intake form (e.g., /submit-player). You\'ll need: full name, DOB, nationality/passport status, position(s), dominant foot, height/weight, current/last club, season stats, coach references, medical/injury history (if any), and video links (full-match + highlights).'
    },
    {
      id: 'players-2',
      question: 'What video do you accept?',
      answer: '3–5 minute highlights. Show clear angles, jersey number, opposition quality, and date. Include match context (league, venue).'
    },
    {
      id: 'players-3',
      question: 'Do you charge players for representation?',
      answer: 'Initial evaluation is free. If we sign you, compensation is typically commission-based in line with FIFA/league rules. We never ask for "trial fees."'
    },
    {
      id: 'players-4',
      question: 'How long until I hear back after submitting?',
      answer: 'Usually 3-7 days. If we\'re interested, we\'ll request verification materials or a live assessment.'
    },
    {
      id: 'players-5',
      question: 'Can minors apply?',
      answer: 'Yes—with a parent/guardian. We follow safeguarding standards and require consent for any next steps.'
    },
    {
      id: 'players-6',
      question: 'Do you help with visas and travel?',
      answer: 'We will coordinate invitation letters and club documentation. We will also help with visa applications but all travel expenses/charges or payment will be covered by you unless a club covers them.'
    },
    {
      id: 'players-7',
      question: 'Can you place student-athletes (scholarships)?',
      answer: 'Case-by-case with partner schools/academies. Academic eligibility and compliance rules apply.'
    },
    {
      id: 'players-8',
      question: 'What happens if I\'m invited to a trial?',
      answer: 'We issue a trial brief (club, dates, expectations), advise on insurance, arrange communications, and coordinate feedback post-trial.'
    },
    {
      id: 'players-9',
      question: 'Will my data and videos be public?',
      answer: 'Profiles marked "public" appear in our database; sensitive items (IDs, medical files) are private. You can request edits or removal at any time.'
    },
    {
      id: 'clubs-1',
      question: 'How do I access your player database?',
      answer: 'Click on players to browse through all the players you will like to see. Filters include name, position and nationality.'
    },
    {
      id: 'clubs-2',
      question: 'Can I request a full dossier or live stream of a player?',
      answer: 'Yes. We provide dossiers (technical/tactical notes, references, data, video) and can arrange live observation when available.'
    },
    {
      id: 'clubs-3',
      question: 'How do you verify the authenticity of video and stats?',
      answer: 'We cross-check metadata (date/opponents/competition), and validate stats with coaches/official sources.'
    },
    {
      id: 'clubs-4',
      question: 'What are your collaboration terms?',
      answer: 'Standard agent-club protocols: clear mandate, transparent fees per regulations, and reporting during trial/negotiation phases.'
    },
    {
      id: 'clubs-5',
      question: 'Who do I contact for a specific profile?',
      answer: 'Email contact@footballbank.soccer with the profile link and your request (trial, transfer inquiry, scouting report).'
    },
    {
      id: 'highlights-1',
      question: 'Are your highlights licensed?',
      answer: 'Yes. We embed official/rights-cleared videos and follow each competition\'s usage policies. We don\'t host unlicensed content.'
    },
    {
      id: 'highlights-2',
      question: 'Do you offer live streaming?',
      answer: 'Only where rights permit and subject to geoblocking. Otherwise, we link users to the official broadcasters/OTT platforms.'
    },
    {
      id: 'highlights-3',
      question: 'Where do live scores/fixtures come from?',
      answer: 'From reputable data partners/APIs. Scores update automatically; occasional delays or discrepancies can occur.'
    },
    {
      id: 'highlights-4',
      question: 'How do I report a rights or DMCA issue?',
      answer: 'Email contact@footballbank.soccer with the URL, rights details, and your contact. We respond promptly.'
    },
    {
      id: 'partnerships-1',
      question: 'Can brands advertise on FootballBank.soccer?',
      answer: 'Yes. We offer banner placements, sponsored content, and affiliate integrations. Request our media kit our email contact@footballbank.soccer.'
    },
    {
      id: 'partnerships-2',
      question: 'Do you collaborate with academies or tournaments?',
      answer: 'Yes. We go to academies and tournaments to scout for fresh talents, we also do tournaments ourselves. If you would like for us to attend any, kindly share your proposal and timelines.'
    },
    {
      id: 'partnerships-3',
      question: 'Press/Interview requests?',
      answer: 'Email contact@footballbank.soccer with your outlet, topic, and deadline.'
    },
    {
      id: 'store-1',
      question: 'Do you sell FootballBank merchandise?',
      answer: 'Limited drops (caps, bags, apparel) are announced on our socials and /store. Quantities are limited.'
    },
    {
      id: 'store-2',
      question: 'What\'s your shipping & returns policy?',
      answer: 'Orders ship in 3–7 business days. Returns accepted within 14 days on unused items with tags. Custom items are final sale.'
    },
    {
      id: 'account-1',
      question: 'How do I edit or delete my profile?',
      answer: 'Email contact@footballbank.soccer from your registered email and indicate what you would like to edit or if you want your profile to be deleted.'
    },
    {
      id: 'account-2',
      question: 'What\'s your privacy policy?',
      answer: 'We collect only what\'s needed to evaluate and promote players. We don\'t sell personal data. See /privacy for details (GDPR/CCPA compliant).'
    },
    {
      id: 'account-3',
      question: 'Security of my documents?',
      answer: 'Sensitive files are stored securely with restricted access. We recommend watermarking sensitive PDFs you upload.'
    }
  ]

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const FAQAccordion = ({ faqs }) => (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border border-gray-200 rounded-lg mb-4 bg-white hover:shadow-sm transition-shadow">
          <AccordionTrigger className="text-left font-medium text-lg hover:no-underline py-6 px-6">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed pb-6 px-6">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Frequently asked questions
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Everything you need to know about FootballBank.soccer
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-accent-red focus:ring-accent-red"
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            <FAQAccordion faqs={filteredFAQs} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              className="bg-accent-red hover:bg-accent-red/90 text-white px-6 py-2"
            >
              <a href="mailto:contact@footballbank.soccer">
                Contact Us
              </a>
            </Button>
            <Button 
              asChild 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              <a href="/submit-profile">
                Submit Profile
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
