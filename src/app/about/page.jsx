'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Users, 
  Globe, 
  Shield, 
  Heart, 
  Award,
  Eye,
  Search,
  Users2,
  Briefcase,
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react'
import "aos/dist/aos.css"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with honesty, transparency, and accountability in all our dealings."
    },
    {
      icon: Award,
      title: "Excellence", 
      description: "We are committed to high standards in talent promotion and client support."
    },
    {
      icon: Globe,
      title: "Inclusion",
      description: "We give a voice to players regardless of background or geography."
    },
    {
      icon: Heart,
      title: "Empowerment",
      description: "We equip our clients with the tools and representation they need to succeed."
    }
  ]

  const whatWeDo = [
    {
      icon: Users,
      title: "Player Profiles",
      description: "Footballers can submit professional profiles and gain global exposure"
    },
    {
      icon: Search,
      title: "Talent Discovery",
      description: "Scouts and clubs can discover vetted, up-and-coming talents"
    },
    {
      icon: Users2,
      title: "Progress Tracking",
      description: "Parents and mentors can track progress and stay involved in the journey"
    },
    {
      icon: Briefcase,
      title: "Brand Partnerships",
      description: "Brands can connect with grassroots football communities for sponsorship"
    }
  ]

  return (
    <div className="bg-primary-bg min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-card border-b border-divider py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent-red/10 text-accent-red rounded-full px-4 py-2 mb-8">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">About Us</span>
            </div>
            <h1 
              className="font-bold text-3xl lg:text-4xl leading-tight tracking-tight text-primary-text mb-6"
              data-aos="fade-up"
            >
              About <span className="text-accent-red">FootballBank.soccer</span>
            </h1>
            <p 
              className="text-base text-primary-muted mb-8 leading-relaxed max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              We are committed to bridging the gap between raw football talent and global opportunities. 
              Founded with the mission to represent, promote, and elevate football players from diverse backgrounds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
              <Button 
                size="lg"
                className="bg-accent-red hover:bg-red-700 text-white px-8 py-4 rounded-xl shadow-lg"
                asChild
              >
                <Link href="/submit-profile">
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Platform
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-accent-red text-accent-red hover:bg-red-50 px-8 py-4 rounded-xl"
                asChild
              >
                <Link href="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20" >
          <Card className="bg-primary-card border border-divider hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary-text mb-4">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-muted leading-relaxed mb-6">
                To be the world's most inclusive and accessible football talent gateway—connecting 
                ambitious players with clubs, agents, and scouts across all continents.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
                  <span className="text-primary-muted">Identify and represent emerging football talent from underrepresented regions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
                  <span className="text-primary-muted">Provide transparent and structured platform for player visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
                  <span className="text-primary-muted">Deliver tailored career support and representation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
                  <span className="text-primary-muted">Foster ethical football agency practices</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary-card border border-divider hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary-text mb-4">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-muted leading-relaxed text-lg">
                To be the world's most inclusive and accessible football talent gateway—connecting 
                ambitious players with clubs, agents, and scouts across all continents.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-text mb-4">
              What We Do
            </h2>
            <p className="text-base text-primary-muted max-w-3xl mx-auto">
              FootballBank.soccer is more than just a player database—we're a digital ecosystem 
              where talent meets opportunity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatWeDo.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Card 
                  key={index}
                  className="bg-primary-card border border-divider hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl text-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-primary-text">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary-muted text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-text mb-4">
              Our Values
            </h2>
            <p className="text-base text-primary-muted max-w-3xl mx-auto">
              The principles that guide everything we do at FootballBank.soccer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card 
                  key={index}
                  className="bg-primary-card border border-divider hover:shadow-xl transition-all duration-300 rounded-xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-primary-text mb-2">
                          {value.title}
                        </CardTitle>
                        <p className="text-primary-muted leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Join the Movement */}
        <div className="bg-gradient-to-r from-accent-red to-red-600 rounded-3xl p-12 text-white text-center mb-16" data-aos="fade-up">
          <div className="max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Join the Movement
            </h2>
            <p className="text-base text-red-100 leading-relaxed mb-8">
              Whether you're a footballer ready to be seen, a scout seeking fresh talent, 
              or a supporter of grassroots development—FootballBank.soccer is your trusted 
              partner in the beautiful game.
            </p>
            <p className="text-base text-red-200 mb-8">
              Let's connect talent to opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-accent-red hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg"
                asChild
              >
                <Link href="/submit-profile">
                  <Users className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl backdrop-blur-sm"
                asChild
              >
                <Link href="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center" data-aos="fade-up">
          <h3 className="text-3xl font-bold text-primary-text mb-4">
            Get in Touch
          </h3>
          <p className="text-base text-primary-muted mb-8 max-w-3xl mx-auto">
            Ready to take the next step? We're here to help you achieve your football dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-accent-red hover:bg-red-700 text-white px-8 py-4 rounded-xl shadow-lg"
              asChild
            >
              <a href="mailto:info@footballbank.soccer">
                <Mail className="w-5 h-5 mr-2" />
                info@footballbank.soccer
              </a>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-accent-red text-accent-red hover:bg-red-50 px-8 py-4 rounded-xl"
              asChild
            >
              <Link href="/career-tips">
                <ArrowRight className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
