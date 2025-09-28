"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Lock,
  Cookie,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Database,
  Settings,
} from "lucide-react";
import "aos/dist/aos.css";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: Database,
      items: [
        "Personal Information (e.g., name, email address, phone number)",
        "Player Profile Information (e.g., bio, photos, videos, statistics)",
        "Device and Usage Information (e.g., IP address, browser type, pages visited)",
        "Cookies and Tracking Technologies",
      ],
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: Settings,
      items: [
        "Provide, operate, and maintain FootballBank.soccer",
        "Create and manage player profiles",
        "Respond to inquiries and provide customer support",
        "Improve site functionality and user experience",
        "Send promotional or informational content (if opted-in)",
      ],
    },
    {
      id: 3,
      title: "Sharing Your Information",
      icon: Users,
      items: [
        "We do not sell your personal information",
        "Service providers performing tasks on our behalf",
        "Football clubs, scouts, or agents with your consent",
        "Legal authorities if required by law",
      ],
    },
    {
      id: 4,
      title: "Data Security",
      icon: Lock,
      items: [
        "We use appropriate technical and organizational measures",
        "Protect your personal data from unauthorized access",
        "Secure data transmission and storage",
        "Regular security audits and updates",
      ],
    },
    {
      id: 5,
      title: "Cookies & Tracking Technologies",
      icon: Cookie,
      items: [
        "We use cookies to enhance your experience",
        "Analyze usage patterns and personalize content",
        "You can control cookie settings through your browser",
        "Essential cookies for site functionality",
      ],
    },
    {
      id: 6,
      title: "Your Rights & Choices",
      icon: UserCheck,
      items: [
        "Access, update, or delete your personal information",
        "Withdraw consent to processing (where applicable)",
        "Opt out of marketing emails or communications",
        "Request data portability",
      ],
    },
    {
      id: 7,
      title: "Children's Privacy",
      icon: Baby,
      items: [
        "We do not knowingly collect information from individuals under 13",
        "Parental consent required for minors",
        "Special protections for children's data",
        "Parents can request deletion of their child's information",
      ],
    },
    {
      id: 8,
      title: "Updates to This Policy",
      icon: RefreshCw,
      items: [
        "We may update this Privacy Policy from time to time",
        "Updated version will be posted on this page",
        "Revised effective date will be provided",
        "We will notify users of significant changes",
      ],
    },
  ];

  return (
    <div className="bg-primary-bg min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-card border-b border-divider py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent-red/10 text-accent-red rounded-full px-4 py-2 mb-8">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Privacy Policy</span>
            </div>
            <h2 className="text-3xl font-bold text-primary-text mb-4">
              Our Commitment to Privacy
            </h2>
            <p
              className="text-base text-primary-muted mb-8 leading-relaxed max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              FootballBank.soccer is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or interact
              with our services.
            </p>
            <div
              className="flex items-center justify-center gap-4 text-sm text-primary-muted"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Effective Date: August 23, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Privacy Sections */}
        <div className="space-y-16 mb-20">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                className="group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary-text mb-6 group-hover:text-accent-red transition-colors duration-300">
                      {section.title}
                    </h3>
                    <ul className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-4">
                          <div className="w-2 h-2 bg-accent-red rounded-full mt-2 flex-shrink-0" />
                          <span className="text-primary-muted leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {index < sections.length - 1 && (
                  <div className="mt-12 border-b border-divider/50" />
                )}
              </div>
            );
          })}
        </div>

        {/* Key Highlights */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-text mb-4">
              Key Privacy Highlights
            </h2>
            <p className="text-lg text-primary-muted max-w-3xl mx-auto">
              Important points about how we protect and handle your personal
              information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-accent-red to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-4 group-hover:text-accent-red transition-colors duration-300">
                We Don't Sell Data
              </h3>
              <p className="text-primary-muted leading-relaxed">
                We do not sell your personal information to third parties
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-accent-red to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-4 group-hover:text-accent-red transition-colors duration-300">
                Secure Storage
              </h3>
              <p className="text-primary-muted leading-relaxed">
                Your data is protected with industry-standard security measures
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-accent-red to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-4 group-hover:text-accent-red transition-colors duration-300">
                Your Control
              </h3>
              <p className="text-primary-muted leading-relaxed">
                You have full control over your personal information and data
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center" data-aos="fade-up">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-accent-red">
                Last Updated
              </span>
            </div>
            <p className="text-lg text-primary-muted mb-4">
              This Privacy Policy was last updated on{" "}
              <strong className="text-primary-text">August 23, 2025</strong>
            </p>
            <p className="text-primary-muted">
              We may update this policy from time to time. Any changes will be
              posted on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
