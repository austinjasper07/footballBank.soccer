'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Users, 
  FileText, 
  Upload, 
  Copyright, 
  AlertTriangle, 
  X, 
  Mail, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Scale,
  Lock,
  Eye,
  Trash2
} from 'lucide-react'
import "aos/dist/aos.css"

export default function TermsOfServicePage() {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const terms = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: CheckCircle,
      color: "bg-green-500",
      content: "By using FootballBank.soccer, you confirm that you are at least 18 years old or have the permission of a parent or legal guardian. Your continued use of this site constitutes your agreement to these terms and any future updates.",
      highlights: ["18+ years old requirement", "Parent/guardian permission for minors", "Automatic agreement by continued use"]
    },
    {
      id: 2,
      title: "Use of Our Services",
      icon: Users,
      color: "bg-blue-500",
      content: "You may use FootballBank.soccer to view player profiles, submit football-related data, request representation, or interact with our football content. You agree not to misuse or interfere with the functionality or security of the site.",
      highlights: ["View player profiles", "Submit football data", "Request representation", "No misuse or interference"]
    },
    {
      id: 3,
      title: "Account Registration",
      icon: Lock,
      color: "bg-purple-500",
      content: "To access certain features, you may be required to register and maintain a secure account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account.",
      highlights: ["Secure account required", "Confidentiality responsibility", "Account activity monitoring"]
    },
    {
      id: 4,
      title: "Content Submissions",
      icon: Upload,
      color: "bg-orange-500",
      content: "By submitting player profiles, videos, images, or other content, you grant FootballBank.soccer a worldwide, non-exclusive, royalty-free license to use, reproduce, and promote the submitted content. You confirm that you own or have permission to submit such content.",
      highlights: ["Worldwide license granted", "Non-exclusive rights", "Content ownership confirmation"]
    },
    {
      id: 5,
      title: "Intellectual Property",
      icon: Copyright,
      color: "bg-indigo-500",
      content: "All trademarks, content, and branding on FootballBank.soccer are owned by FootballBank or its licensors. You may not reproduce or reuse content without explicit written permission.",
      highlights: ["Trademark protection", "Content ownership", "Permission required for reuse"]
    },
    {
      id: 6,
      title: "Limitation of Liability",
      icon: AlertTriangle,
      color: "bg-yellow-500",
      content: "FootballBank.soccer is not liable for any indirect, incidental, or consequential damages resulting from your use of the site. Services and content are provided \"as is\" and \"as available\" without warranties.",
      highlights: ["No liability for indirect damages", "Services provided 'as is'", "No warranties implied"]
    },
    {
      id: 7,
      title: "Termination",
      icon: X,
      color: "bg-red-500",
      content: "We reserve the right to terminate or suspend your access to the site without notice for conduct that violates these terms or is harmful to other users or FootballBank.soccer.",
      highlights: ["Right to terminate access", "No notice required", "Violation consequences"]
    },
    {
      id: 8,
      title: "Changes to Terms",
      icon: FileText,
      color: "bg-teal-500",
      content: "We may revise these Terms of Service from time to time. Continued use of the site means you accept any updates or modifications to the terms.",
      highlights: ["Terms may be revised", "Automatic acceptance", "Continued use agreement"]
    }
  ]

  return (
    <div className="bg-primary-bg min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ff] to-[#fff] py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-accent-red rounded-full blur-[200px] -top-24 -left-20 opacity-25" />
          <div className="absolute w-80 h-80 bg-accent-green rounded-full blur-[120px] bottom-10 right-10 opacity-30" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6" data-aos="fade-up">
              <div className="w-20 h-20 bg-accent-red rounded-full flex items-center justify-center">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 
              className="font-bold text-[clamp(2.5rem,3.5vw,4rem)] leading-tight tracking-tight text-primary-text mb-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Terms of Service
            </h1>
            <p 
              className="text-xl text-primary-muted mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Welcome to FootballBank.soccer. By accessing or using our website, you agree to be bound by the following Terms of Service.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-primary-muted" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Effective Date: August 23, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Introduction */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ff] to-[#fff] border border-divider rounded-xl p-8">
            <p className="text-lg text-primary-muted leading-relaxed max-w-4xl mx-auto">
              Please read these terms carefully. Your continued use of this site constitutes your agreement to these terms and any future updates.
            </p>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {terms.map((term, index) => {
            const IconComponent = term.icon
            const isExpanded = expandedSection === term.id
            
            return (
              <Card 
                key={term.id} 
                className={`bg-primary-card border border-divider hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  isExpanded ? 'ring-2 ring-accent-red' : ''
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => toggleSection(term.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${term.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-primary-text flex items-center gap-2">
                        {term.title}
                        <ArrowRight className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`} />
                      </CardTitle>
                      <Badge variant="outline" className="text-sm mt-2">
                        Section {term.id}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    <Separator className="mb-6" />
                    <p className="text-primary-muted leading-relaxed mb-6">
                      {term.content}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary-text mb-3">Key Points:</h4>
                      {term.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-primary-muted">
                          <div className="w-2 h-2 bg-accent-red rounded-full" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 mb-16" data-aos="fade-up">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                Important Notice
              </h3>
              <p className="text-yellow-700 leading-relaxed">
                These terms are legally binding. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ff] to-[#fff] border border-divider rounded-xl p-8 text-center" data-aos="fade-up">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary-text mb-6">
              Questions About Our Terms?
            </h2>
            <p className="text-lg text-primary-muted leading-relaxed mb-8">
              If you have questions or concerns about these terms, please don't hesitate to contact us. We're here to help clarify any points and ensure you understand your rights and responsibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                className="bg-accent-red hover:bg-accent-red/90 text-white px-8 py-3"
              >
                <a href="mailto:legal@footballbank.soccer">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Legal Team
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white px-8 py-3"
              >
                <a href="/contact">
                  General Contact
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-16 text-center" data-aos="fade-up">
          <p className="text-sm text-primary-muted">
            Last updated: August 23, 2025 | FootballBank.soccer
          </p>
        </div>
      </div>
    </div>
  )
}

