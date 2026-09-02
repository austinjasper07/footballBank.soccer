// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { getClientDictionary } from "@/lib/client-dictionaries";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Target,
//   Users,
//   TrendingUp,
//   BookOpen,
//   MessageCircle,
//   Heart,
//   Network,
//   FileText,
//   Shield,
//   Activity,
//   Search,
//   Filter,
//   ArrowRight,
//   Star,
//   Clock,
//   Award,
//   Lightbulb,
//   Zap,
//   Globe,
//   CheckCircle,
//   Play,
//   Download,
//   Share2,
// } from "lucide-react";
// import "aos/dist/aos.css";

// export default function CareerTipsPage() {
//   const params = useParams();
//   const lang = params?.lang || "en";
//   const [dict, setDict] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [hoveredCard, setHoveredCard] = useState(null);

//   useEffect(() => {
//     getClientDictionary(lang).then(setDict);
//   }, [lang]);

//   const categories = [
//     { id: "all", name: dict?.careerTipsPage?.categories?.all || "All Tips", icon: Globe },
//     { id: "planning", name: dict?.careerTipsPage?.categories?.planning || "Planning", icon: Target },
//     { id: "skills", name: dict?.careerTipsPage?.categories?.skills || "Skills", icon: BookOpen },
//     { id: "networking", name: dict?.careerTipsPage?.categories?.networking || "Networking", icon: Network },
//     { id: "growth", name: dict?.careerTipsPage?.categories?.growth || "Growth", icon: TrendingUp },
//   ];

//   const tips = [
//     {
//       id: 1,
//       title: "Define Your Goals Clearly",
//       description:
//         "Having a clear sense of direction is the first step to success. Know what you want from your career—whether it's signing with a club, becoming a certified coach, or launching a personal brand in sports. Break big goals into small, actionable steps.",
//       icon: Target,
//       color: "from-blue-500 to-blue-600",
//       bgColor: "bg-blue-50",
//       category: "planning",
//       difficulty: "Beginner",
//       readTime: "3 min",
//       featured: true,
//       tags: ["Goal Setting", "Planning", "Strategy"],
//     },
//     {
//       id: 2,
//       title: "Build a Personal Brand",
//       description:
//         "You are your own brand. Make sure your online profiles, personal statements, highlight videos, and behavior reflect professionalism and confidence. Whether you're a football player or a contributor to the sports ecosystem, let your digital presence showcase your value and credibility.",
//       icon: Users,
//       color: "from-purple-500 to-purple-600",
//       bgColor: "bg-purple-50",
//       category: "skills",
//       difficulty: "Intermediate",
//       readTime: "5 min",
//       featured: true,
//       tags: ["Branding", "Online Presence", "Professionalism"],
//     },
//     {
//       id: 3,
//       title: "Stay Consistently Committed",
//       description:
//         "Consistency beats talent without discipline. Whether training, applying to clubs, networking, or submitting deliverables—show up consistently. Daily routines, small improvements, and persistence will distinguish you over time.",
//       icon: TrendingUp,
//       color: "from-green-500 to-green-600",
//       bgColor: "bg-green-50",
//       category: "growth",
//       difficulty: "Beginner",
//       readTime: "4 min",
//       featured: false,
//       tags: ["Consistency", "Discipline", "Routine"],
//     },
//     {
//       id: 4,
//       title: "Keep Learning and Upskilling",
//       description:
//         "Stay updated with industry trends. Take online courses, attend training camps, earn certifications, and read materials relevant to your field. The most successful professionals in sports, tech, and business are those who never stop learning.",
//       icon: BookOpen,
//       color: "from-orange-500 to-orange-600",
//       bgColor: "bg-orange-50",
//       category: "skills",
//       difficulty: "Intermediate",
//       readTime: "6 min",
//       featured: true,
//       tags: ["Learning", "Education", "Development"],
//     },
//     {
//       id: 5,
//       title: "Seek Mentorship and Constructive Feedback",
//       description:
//         "Mentors offer guidance, encouragement, and insider knowledge that can help you avoid common mistakes. Be open to criticism—it's often the fastest way to grow. Ask for feedback from coaches, managers, peers, and even fans.",
//       icon: MessageCircle,
//       color: "from-pink-500 to-pink-600",
//       bgColor: "bg-pink-50",
//       category: "networking",
//       difficulty: "Beginner",
//       readTime: "4 min",
//       featured: false,
//       tags: ["Mentorship", "Feedback", "Growth"],
//     },
//     {
//       id: 6,
//       title: "Develop Soft Skills",
//       description:
//         "Technical ability is important, but soft skills set you apart. Communication, time management, teamwork, and emotional intelligence are critical in building lasting relationships and progressing in your career.",
//       icon: Heart,
//       color: "from-red-500 to-red-600",
//       bgColor: "bg-red-50",
//       category: "skills",
//       difficulty: "Intermediate",
//       readTime: "5 min",
//       featured: false,
//       tags: ["Soft Skills", "Communication", "Teamwork"],
//     },
//     {
//       id: 7,
//       title: "Network Purposefully",
//       description:
//         "Make intentional efforts to connect with people in your industry. Attend local tournaments, career expos, webinars, and conferences. Use social media platforms like Facebook, X, Youtube, TikTok and Instagram to follow key figures and engage thoughtfully.",
//       icon: Network,
//       color: "from-indigo-500 to-indigo-600",
//       bgColor: "bg-indigo-50",
//       category: "networking",
//       difficulty: "Intermediate",
//       readTime: "6 min",
//       featured: true,
//       tags: ["Networking", "Connections", "Industry"],
//     },
//     {
//       id: 8,
//       title: "Document and Showcase Achievements",
//       description:
//         "Keep track of your milestones—match stats, certificates, academic grades, media appearances, or projects completed. Create a personal portfolio or digital resume that can be shared instantly when opportunities arise.",
//       icon: FileText,
//       color: "from-teal-500 to-teal-600",
//       bgColor: "bg-teal-50",
//       category: "skills",
//       difficulty: "Beginner",
//       readTime: "4 min",
//       featured: false,
//       tags: ["Portfolio", "Achievements", "Documentation"],
//     },
//     {
//       id: 9,
//       title: "Embrace Resilience",
//       description:
//         "Rejection is part of the journey. Don't be discouraged by setbacks. Learn from failure, reset your approach, and keep moving forward. A strong mindset and emotional toughness are vital in competitive industries.",
//       icon: Shield,
//       color: "from-yellow-500 to-yellow-600",
//       bgColor: "bg-yellow-50",
//       category: "growth",
//       difficulty: "Advanced",
//       readTime: "5 min",
//       featured: true,
//       tags: ["Resilience", "Mindset", "Overcoming"],
//     },
//     {
//       id: 10,
//       title: "Balance Health and Ambition",
//       description:
//         "Your body and mind are the engines of your career. Eat right, sleep well, exercise regularly, and manage stress. Mental and physical fitness boost your productivity and ability to seize opportunities.",
//       icon: Activity,
//       color: "from-emerald-500 to-emerald-600",
//       bgColor: "bg-emerald-50",
//       category: "growth",
//       difficulty: "Beginner",
//       readTime: "4 min",
//       featured: false,
//       tags: ["Health", "Balance", "Wellness"],
//     },
//   ];

//   const filteredTips = tips.filter((tip) => {
//     const matchesSearch =
//       tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tip.tags.some((tag) =>
//         tag.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     const matchesCategory =
//       selectedCategory === "all" || tip.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const featuredTips = tips.filter((tip) => tip.featured);

//   return (
//     <div className="bg-primary-bg min-h-screen">
//       <div className="container mx-auto px-4 py-16 max-w-6xl">
//         {/* Page Header */}
//         <div className="text-center mb-16" data-aos="fade-up">
//           <h1 className="font-bold text-4xl lg:text-5xl leading-tight tracking-tight text-primary-text mb-6">
//             {dict?.careerTipsPage?.title || "Career Tips"}
//           </h1>
//           <p className="text-xl text-primary-muted mb-8 max-w-4xl mx-auto">
//             {dict?.careerTipsPage?.subtitle || "Whether you're an aspiring footballer, a student, or a professional looking to make your mark, navigate your career path with intention, strategy, and perseverance."}
//           </p>
//         </div>

//         {/* Search and Filter */}
//         <div className="mb-16" data-aos="fade-up">
//           <div className="bg-primary-card rounded-xl p-8 border border-divider shadow-sm">
//             <div className="flex flex-col lg:flex-row gap-6">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-muted w-5 h-5" />
//                   <Input
//                     type="text"
//                     placeholder={dict?.careerTipsPage?.searchPlaceholder || "Search career tips..."}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-12 pr-4 py-4 w-full border-divider focus:border-accent-red rounded-xl text-lg bg-primary-bg"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2 flex-wrap">
//                 {categories.map((category) => {
//                   const IconComponent = category.icon;
//                   return (
//                     <Button
//                       key={category.id}
//                       variant={
//                         selectedCategory === category.id ? "default" : "outline"
//                       }
//                       onClick={() => setSelectedCategory(category.id)}
//                       className={`px-6 py-4 rounded-xl transition-all duration-300 ${
//                         selectedCategory === category.id
//                           ? "bg-primary-action text-white shadow-lg"
//                           : "border-divider hover:border-primary-action bg-primary-bg text-primary-text"
//                       }`}
//                     >
//                       <IconComponent className="w-4 h-4 mr-2" />
//                       {category.name}
//                     </Button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Featured Tips */}
//         {selectedCategory === "all" && (
//           <div className="mb-16" data-aos="fade-up">
//             <div className="flex items-center gap-4 mb-8">
//               <Star className="w-6 h-6 text-primary-action" />
//               <h2 className="text-3xl font-bold text-primary-text">
//                 {dict?.careerTipsPage?.featured || "Featured Tips"}
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {featuredTips.slice(0, 4).map((tip, index) => {
//                 const IconComponent = tip.icon;
//                 return (
//                   <Card
//                     key={tip.id}
//                     className="group bg-primary-card border border-divider hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-xl overflow-hidden"
//                     data-aos="fade-up"
//                     data-aos-delay={index * 100}
//                     onMouseEnter={() => setHoveredCard(tip.id)}
//                     onMouseLeave={() => setHoveredCard(null)}
//                   >
//                     <div className="h-2 bg-linear-to-r from-primary-action to-primary-action-hover" />
//                     <CardHeader className="pb-4">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-primary-action to-primary-action-hover flex items-center justify-center shadow-lg">
//                           <IconComponent className="w-7 h-7 text-white" />
//                         </div>
//                         <div className="flex gap-2">
//                           <Badge
//                             variant="outline"
//                             className="text-xs border-divider"
//                           >
//                             {tip.difficulty}
//                           </Badge>
//                           <Badge
//                             variant="outline"
//                             className="text-xs border-divider"
//                           >
//                             <Clock className="w-3 h-3 mr-1" />
//                             {tip.readTime}
//                           </Badge>
//                         </div>
//                       </div>
//                       <CardTitle className="text-xl font-bold text-primary-text group-hover:text-primary-action transition-colors">
//                         {tip.title}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-primary-muted leading-relaxed mb-6">
//                         {tip.description}
//                       </p>
//                       <div className="flex flex-wrap gap-2 mb-6">
//                         {tip.tags.map((tag, tagIndex) => (
//                           <Badge
//                             key={tagIndex}
//                             variant="secondary"
//                             className="text-xs bg-primary-bg text-primary-muted border-divider"
//                           >
//                             {tag}
//                           </Badge>
//                         ))}
//                       </div>
               
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* All Tips Grid */}
//         <div className="mb-16" data-aos="fade-up">
//           <div className="flex items-center gap-4 mb-8">
//             <Lightbulb className="w-6 h-6 text-primary-action" />
//             <h2 className="text-3xl font-bold text-primary-text">
//               {selectedCategory === "all"
//                 ? (dict?.careerTipsPage?.allTips || "All Career Tips")
//                 : `${categories.find((c) => c.id === selectedCategory)?.name} ${dict?.careerTipsPage?.tipsCount || "tips"}`}
//             </h2>
//             <Badge variant="outline" className="text-sm border-divider">
//               {filteredTips.length} {dict?.careerTipsPage?.tipsCount || "tips"}
//             </Badge>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredTips.map((tip, index) => {
//               const IconComponent = tip.icon;
//               return (
//                 <Card
//                   key={tip.id}
//                   className="group bg-primary-card border border-divider hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden"
//                   data-aos="fade-up"
//                   data-aos-delay={index * 100}
//                 >
//                   <div className="h-1 bg-linear-to-r from-primary-action to-primary-action-hover" />
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="w-12 h-12 rounded-xl bg-linear-to-r from-primary-action to-primary-action-hover flex items-center justify-center shadow-lg">
//                         <IconComponent className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="flex gap-1">
//                         <Badge
//                           variant="outline"
//                           className="text-xs border-divider"
//                         >
//                           {tip.difficulty}
//                         </Badge>
//                       </div>
//                     </div>
//                     <CardTitle className="text-lg font-bold text-primary-text group-hover:text-primary-action transition-colors">
//                       {tip.title}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-primary-muted leading-relaxed mb-4 text-sm">
//                       {tip.description}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-xs text-primary-muted">
//                         <Clock className="w-3 h-3" />
//                         {tip.readTime}
//                       </div>
                      
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>

//         {/* Final Word Section */}
//         <div
//           className="bg-linear-to-r from-primary-action to-primary-action-hover rounded-3xl p-12 text-white text-center mb-16"
//           data-aos="fade-up"
//         >
//           <div className="max-w-4xl mx-auto">
//             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
//               <Award className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-4xl font-bold mb-6">
//               {dict?.careerTipsPage?.finalWord?.title || "Your Career is Your Legacy"}
//             </h2>
//             <p className="text-xl text-blue-100 leading-relaxed mb-8">
//               {dict?.careerTipsPage?.finalWord?.subtitle || "Plan ahead, stay focused, and never stop investing in your growth. At FootballBank.soccer, we are committed to guiding and representing individuals who are ready to take charge of their future."}
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 size="lg"
//                 className="bg-white text-primary-action hover:bg-primary-surface px-8 py-4 rounded-xl shadow-lg"
//                 asChild
//               >
//                 <Link href={`/${lang}/contact`}>
//                   <MessageCircle className="w-5 h-5 mr-2" />
//                   {dict?.careerTipsPage?.finalWord?.mentorshipCta || "Get Mentorship"}
//                 </Link>
//               </Button>
//                <Button
//                  size="lg"
//                  variant="outline"
//                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl backdrop-blur-sm"
//                  asChild
//                >
//                 <a
//                   href="/career-guide.pdf"
//                    download
//                    target="_blank"
//                    rel="noopener noreferrer"
//                    style={{ textDecoration: "none" }}
//                  >
//                    <Download className="w-5 h-5 mr-2" />
//                   {dict?.careerTipsPage?.finalWord?.downloadGuide || "Download Guide"}
//                  </a>
//                </Button>
//             </div>
//           </div>
//         </div>

//         {/* Contact Section */}
//         <div className="text-center" data-aos="fade-up">
//           <h3 className="text-3xl font-bold text-primary-text mb-4">
//             {dict?.careerTipsPage?.contact?.title || "Ready to Take the Next Step?"}
//           </h3>
//           <p className="text-xl text-primary-muted mb-12 max-w-3xl mx-auto">
//             {dict?.careerTipsPage?.contact?.subtitle || "Join thousands of players and professionals who are building their careers with FootballBank.soccer"}
//           </p>
//           <div className="flex flex-col sm:flex-row gap-6 justify-center">
//             <Button 
//               size="lg"
//               className="bg-primary-action hover:bg-primary-action-hover text-white px-8 py-4 rounded-xl shadow-lg"
//               asChild
//             >
//               <Link href={`/${lang}/submit-profile`}>
//                 <Users className="w-5 h-5 mr-2" />
//                 {dict?.careerTipsPage?.contact?.submitProfile || "Submit Your Profile"}
//               </Link>
//             </Button>
//             <Button 
//               size="lg"
//               variant="outline"
//               className="border-2 border-primary-action text-primary-action hover:bg-primary-action/10 px-8 py-4 rounded-xl"
//               asChild
//             >
//               <Link href={`/${lang}/contact`}>
//                 <MessageCircle className="w-5 h-5 mr-2" />
//                 {dict?.careerTipsPage?.contact?.getInTouch || "Get in Touch"}
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getClientDictionary } from "@/lib/client-dictionaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import "aos/dist/aos.css";

export default function CareerTipsPage() {
  const params = useParams();
  const lang = params?.lang || "en";
  const [dict, setDict] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  const categories = [
    { id: "all", name: dict?.careerTipsPage?.categories?.all || "All Tips" },
    { id: "planning", name: dict?.careerTipsPage?.categories?.planning || "Planning" },
    { id: "skills", name: dict?.careerTipsPage?.categories?.skills || "Skills" },
    { id: "networking", name: dict?.careerTipsPage?.categories?.networking || "Networking" },
    { id: "growth", name: dict?.careerTipsPage?.categories?.growth || "Growth" },
  ];

  const tips = [
    {
      id: 1,
      title: "Define Your Goals Clearly",
      description:
        "Having a clear sense of direction is the first step to success. Know what you want from your career—whether it's signing with a club, becoming a certified coach, or launching a personal brand in sports. Break big goals into small, actionable steps.",
      category: "planning",
      difficulty: "Beginner",
      readTime: "3 min",
      featured: true,
      tags: ["Goal Setting", "Planning", "Strategy"],
    },
    {
      id: 2,
      title: "Build a Personal Brand",
      description:
        "You are your own brand. Make sure your online profiles, personal statements, highlight videos, and behavior reflect professionalism and confidence. Whether you're a football player or a contributor to the sports ecosystem, let your digital presence showcase your value and credibility.",
      category: "skills",
      difficulty: "Intermediate",
      readTime: "5 min",
      featured: true,
      tags: ["Branding", "Online Presence", "Professionalism"],
    },
    {
      id: 3,
      title: "Stay Consistently Committed",
      description:
        "Consistency beats talent without discipline. Whether training, applying to clubs, networking, or submitting deliverables—show up consistently. Daily routines, small improvements, and persistence will distinguish you over time.",
      category: "growth",
      difficulty: "Beginner",
      readTime: "4 min",
      featured: false,
      tags: ["Consistency", "Discipline", "Routine"],
    },
    {
      id: 4,
      title: "Keep Learning and Upskilling",
      description:
        "Stay updated with industry trends. Take online courses, attend training camps, earn certifications, and read materials relevant to your field. The most successful professionals in sports, tech, and business are those who never stop learning.",
      category: "skills",
      difficulty: "Intermediate",
      readTime: "6 min",
      featured: true,
      tags: ["Learning", "Education", "Development"],
    },
    {
      id: 5,
      title: "Seek Mentorship and Constructive Feedback",
      description:
        "Mentors offer guidance, encouragement, and insider knowledge that can help you avoid common mistakes. Be open to criticism—it's often the fastest way to grow. Ask for feedback from coaches, managers, peers, and even fans.",
      category: "networking",
      difficulty: "Beginner",
      readTime: "4 min",
      featured: false,
      tags: ["Mentorship", "Feedback", "Growth"],
    },
    {
      id: 6,
      title: "Develop Soft Skills",
      description:
        "Technical ability is important, but soft skills set you apart. Communication, time management, teamwork, and emotional intelligence are critical in building lasting relationships and progressing in your career.",
      category: "skills",
      difficulty: "Intermediate",
      readTime: "5 min",
      featured: false,
      tags: ["Soft Skills", "Communication", "Teamwork"],
    },
    {
      id: 7,
      title: "Network Purposefully",
      description:
        "Make intentional efforts to connect with people in your industry. Attend local tournaments, career expos, webinars, and conferences. Use social platforms to follow key figures and engage thoughtfully.",
      category: "networking",
      difficulty: "Intermediate",
      readTime: "6 min",
      featured: true,
      tags: ["Networking", "Connections", "Industry"],
    },
    {
      id: 8,
      title: "Document and Showcase Achievements",
      description:
        "Keep track of your milestones—match stats, certificates, academic grades, media appearances, or projects completed. Create a personal portfolio or digital resume that can be shared instantly when opportunities arise.",
      category: "skills",
      difficulty: "Beginner",
      readTime: "4 min",
      featured: false,
      tags: ["Portfolio", "Achievements", "Documentation"],
    },
    {
      id: 9,
      title: "Embrace Resilience",
      description:
        "Rejection is part of the journey. Don't be discouraged by setbacks. Learn from failure, reset your approach, and keep moving forward. A strong mindset and emotional toughness are vital in competitive industries.",
      category: "growth",
      difficulty: "Advanced",
      readTime: "5 min",
      featured: true,
      tags: ["Resilience", "Mindset", "Overcoming"],
    },
    {
      id: 10,
      title: "Balance Health and Ambition",
      description:
        "Your body and mind are the engines of your career. Eat right, sleep well, exercise regularly, and manage stress. Mental and physical fitness boost your productivity and ability to seize opportunities.",
      category: "growth",
      difficulty: "Beginner",
      readTime: "4 min",
      featured: false,
      tags: ["Health", "Balance", "Wellness"],
    },
  ];

  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTips = tips.filter((tip) => tip.featured);

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        {/* Page Header */}
        <div className="mb-16" data-aos="fade-up">
          <p className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3">
            Career Tips
          </p>
          <h1 className="font-bold text-4xl lg:text-5xl leading-tight tracking-tight text-[#0B1220] mb-5 max-w-3xl">
            {dict?.careerTipsPage?.title || "Build your career with intention"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            {dict?.careerTipsPage?.subtitle ||
              "Whether you're an aspiring footballer, a student, or a professional looking to make your mark, navigate your career path with intention, strategy, and perseverance."}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-16 flex flex-col md:flex-row gap-4 md:items-center md:justify-between" data-aos="fade-up">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={dict?.careerTipsPage?.searchPlaceholder || "Search tips..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-gray-200 rounded-full text-sm bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[#0B1220] text-white"
                    : "text-gray-600 border border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Tips */}
        {selectedCategory === "all" && (
          <div className="mb-20" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-8">
              {dict?.careerTipsPage?.featured || "Featured"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredTips.slice(0, 4).map((tip, index) => (
                <Card
                  key={tip.id}
                  className="group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 rounded-2xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardHeader className="pb-3">
                    <span className="inline-block w-fit text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                      {categories.find((c) => c.id === tip.category)?.name}
                    </span>
                    <CardTitle className="text-xl font-bold text-[#0B1220] group-hover:text-blue-600 transition-colors">
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-5 text-[15px]">
                      {tip.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
                      <span>{tip.difficulty} · {tip.readTime} read</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Tips Grid */}
        <div className="mb-20" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-[#0B1220]">
              {selectedCategory === "all"
                ? dict?.careerTipsPage?.allTips || "All Tips"
                : `${categories.find((c) => c.id === selectedCategory)?.name} ${dict?.careerTipsPage?.tipsCount || "tips"}`}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredTips.length} {dict?.careerTipsPage?.tipsCount || "tips"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {filteredTips.map((tip, index) => (
              <div
                key={tip.id}
                className="group border-t border-gray-200 py-8"
                data-aos="fade-up"
                data-aos-delay={index * 60}
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xl font-bold text-gray-300 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#0B1220] group-hover:text-blue-600 transition-colors">
                        {tip.title}
                      </h3>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {categories.find((c) => c.id === tip.category)?.name}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm mb-3">
                      {tip.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      {tip.difficulty} · {tip.readTime} read
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Word Section */}
        <div className="bg-[#0B1220] rounded-3xl p-10 lg:p-14 text-white text-center mb-20" data-aos="fade-up">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-5">
              {dict?.careerTipsPage?.finalWord?.title || "Your career is your legacy"}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              {dict?.careerTipsPage?.finalWord?.subtitle ||
                "Plan ahead, stay focused, and never stop investing in your growth. At FootballBank.soccer, we are committed to guiding and representing individuals who are ready to take charge of their future."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full"
                asChild
              >
                <Link href={`/${lang}/contact`}>
                  {dict?.careerTipsPage?.finalWord?.mentorshipCta || "Get Mentorship"}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-white/30 text-white hover:bg-white/10 px-7 py-3 rounded-full"
                asChild
              >
                <a href="/career-guide.pdf" download target="_blank" rel="noopener noreferrer">
                  {dict?.careerTipsPage?.finalWord?.downloadGuide || "Download Guide"}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center" data-aos="fade-up">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#0B1220] mb-3">
            {dict?.careerTipsPage?.contact?.title || "Ready to take the next step?"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            {dict?.careerTipsPage?.contact?.subtitle ||
              "Join players and professionals who are building their careers with FootballBank.soccer"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full" asChild>
              <Link href={`/${lang}/submit-profile`}>
                {dict?.careerTipsPage?.contact?.submitProfile || "Submit Your Profile"}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-7 py-3 rounded-full"
              asChild
            >
              <Link href={`/${lang}/contact`}>
                {dict?.careerTipsPage?.contact?.getInTouch || "Get in Touch"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}