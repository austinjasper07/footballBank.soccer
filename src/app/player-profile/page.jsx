"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Footprints,
  Trophy,
  Target,
  Users,
  Star,
  Play,
  Download,
  Edit,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  Award,
  TrendingUp,
  Clock,
  Globe,
  Shield,
  Camera,
  Video,
  FileText,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import "aos/dist/aos.css";

export default function PlayerProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPlayerData();
    }
  }, [isAuthenticated, user]);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch("/api/profile/player");
      const data = await response.json();
      setPlayerData(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPositionColor = (position) => {
    const colors = {
      "Goalkeeper": "bg-blue-100 text-blue-800",
      "Defender": "bg-green-100 text-green-800",
      "Midfielder": "bg-yellow-100 text-yellow-800",
      "Forward": "bg-red-100 text-red-800",
      "Striker": "bg-red-100 text-red-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Under Contract":
        return "bg-blue-100 text-blue-800";
      case "On Trial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red mx-auto mb-4" />
          <p className="text-primary-muted">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="w-16 h-16 text-accent-red mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-primary-text mb-4">
            Authentication Required
          </h1>
          <p className="text-primary-muted mb-6">
            Please log in to access your player profile.
          </p>
          <Button asChild>
            <Link href="/api/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <User className="w-16 h-16 text-primary-muted mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-primary-text mb-4">
            No Player Profile Found
          </h1>
          <p className="text-primary-muted mb-6">
            You don't have a player profile yet. Submit your profile to get started.
          </p>
          <Button asChild>
            <Link href="/submit-profile">Submit Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent-red to-red-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {playerData.imageUrl && playerData.imageUrl.length > 0 ? (
                  <img
                    src={playerData.imageUrl[0]}
                    alt={`${playerData.firstName} ${playerData.lastName}`}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                {playerData.featured && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-900" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {playerData.firstName} {playerData.lastName}
                </h1>
                <div className="flex items-center gap-4 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {playerData.position}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {playerData.country}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Age {getAge(playerData.dob)}
                  </Badge>
                </div>
                <p className="text-red-100 text-lg">
                  {playerData.description || "Professional Football Player"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/player-profile/edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{playerData.height}</div>
              <div className="text-red-100">Height</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{playerData.weight}</div>
              <div className="text-red-100">Weight</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{playerData.foot}</div>
              <div className="text-red-100">Preferred Foot</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {playerData.contractStatus || "Available"}
              </div>
              <div className="text-red-100">Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-accent-red" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary-muted" />
                      <div>
                        <div className="text-sm text-primary-muted">Email</div>
                        <div className="font-medium text-primary-text">
                          {playerData.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary-muted" />
                      <div>
                        <div className="text-sm text-primary-muted">Phone</div>
                        <div className="font-medium text-primary-text">
                          {playerData.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary-muted" />
                      <div>
                        <div className="text-sm text-primary-muted">Country</div>
                        <div className="font-medium text-primary-text">
                          {playerData.country}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary-muted" />
                      <div>
                        <div className="text-sm text-primary-muted">Date of Birth</div>
                        <div className="font-medium text-primary-text">
                          {formatDate(playerData.dob)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent-red" />
                    Physical Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-primary-muted" />
                      <span className="text-primary-muted">Height</span>
                    </div>
                    <span className="font-medium text-primary-text">
                      {playerData.height}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-primary-muted" />
                      <span className="text-primary-muted">Weight</span>
                    </div>
                    <span className="font-medium text-primary-text">
                      {playerData.weight}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-primary-muted" />
                      <span className="text-primary-muted">Preferred Foot</span>
                    </div>
                    <span className="font-medium text-primary-text">
                      {playerData.foot}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Availability & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent-red" />
                  Availability & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-primary-muted mb-2">Contract Status</div>
                    <Badge className={getStatusColor(playerData.contractStatus)}>
                      {playerData.contractStatus}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-primary-muted mb-2">Available From</div>
                    <div className="font-medium text-primary-text">
                      {playerData.availableFrom || "Immediately"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-primary-muted mb-2">Preferred Leagues</div>
                    <div className="font-medium text-primary-text">
                      {playerData.preferredLeagues || "Open to all"}
                    </div>
                  </div>
                </div>
                {playerData.salaryExpectation && (
                  <div className="mt-4 pt-4 border-t border-divider">
                    <div className="text-sm text-primary-muted mb-2">Salary Expectation</div>
                    <div className="font-medium text-primary-text">
                      {playerData.salaryExpectation}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            {playerData.stats ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Career Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent-red" />
                      Career Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(playerData.stats.career || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-primary-muted capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium text-primary-text">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Season Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent-red" />
                      Current Season
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(playerData.stats.season || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-primary-muted capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium text-primary-text">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="w-16 h-16 text-primary-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-text mb-2">
                    No Statistics Available
                  </h3>
                  <p className="text-primary-muted mb-6">
                    Statistics will appear here once they are added to your profile.
                  </p>
                  <Button asChild>
                    <Link href="/player-profile/edit">
                      <Edit className="w-4 h-4 mr-2" />
                      Add Statistics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            {playerData.clubHistory && playerData.clubHistory.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent-red" />
                    Club History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {playerData.clubHistory.map((club, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-primary-bg rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-lg flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-primary-text">
                              {club.clubName}
                            </div>
                            <div className="text-sm text-primary-muted">
                              {club.position} • {club.startDate} - {club.endDate || "Present"}
                            </div>
                          </div>
                        </div>
                        <Badge className={getPositionColor(club.position)}>
                          {club.position}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="w-16 h-16 text-primary-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-text mb-2">
                    No Career History
                  </h3>
                  <p className="text-primary-muted mb-6">
                    Your club history will appear here once added to your profile.
                  </p>
                  <Button asChild>
                    <Link href="/player-profile/edit">
                      <Edit className="w-4 h-4 mr-2" />
                      Add Career History
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-accent-red" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {playerData.imageUrl && playerData.imageUrl.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {playerData.imageUrl.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`${playerData.firstName} ${playerData.lastName} - Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="w-12 h-12 text-primary-muted mx-auto mb-4" />
                      <p className="text-primary-muted">No photos available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Videos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-accent-red" />
                    Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {playerData.videoPrimary || (playerData.videoAdditional && playerData.videoAdditional.length > 0) ? (
                    <div className="space-y-4">
                      {playerData.videoPrimary && (
                        <div className="relative">
                          <video
                            src={playerData.videoPrimary}
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-accent-red text-white">Primary</Badge>
                          </div>
                        </div>
                      )}
                      {playerData.videoAdditional && playerData.videoAdditional.map((video, index) => (
                        <div key={index} className="relative">
                          <video
                            src={video}
                            controls
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Video className="w-12 h-12 text-primary-muted mx-auto mb-4" />
                      <p className="text-primary-muted">No videos available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CV Download */}
            {playerData.cvUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent-red" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-primary-bg rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-red to-red-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-primary-text">
                          Player Resume
                        </div>
                        <div className="text-sm text-primary-muted">
                          PDF Document
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={playerData.cvUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-accent-red" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent-red" />
                    <div>
                      <div className="text-sm text-primary-muted">Email</div>
                      <div className="font-medium text-primary-text">
                        {playerData.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent-red" />
                    <div>
                      <div className="text-sm text-primary-muted">Phone</div>
                      <div className="font-medium text-primary-text">
                        {playerData.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-divider">
                  <h3 className="font-semibold text-primary-text mb-4">
                    Interested in this player?
                  </h3>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href={`/contact?player=${playerData.id}`}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/contact?player=${playerData.id}&type=inquiry`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Make Inquiry
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
