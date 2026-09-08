import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Users,
  Trophy,
  Star,
  Calendar,
  Plus,
  Edit,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "./StatsCard";

export default function ProfileDashboard({ 
  userData, 
  subscriptions = [], 
  playerData = null,
  userRole = "user" 
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActiveSubscriptions = () => {
    if (!Array.isArray(subscriptions)) return 0;
    return subscriptions.filter(sub => sub.isActive).length;
  };

  const getRecentSubscriptions = () => {
    if (!Array.isArray(subscriptions) || subscriptions.length === 0) return [];
    return subscriptions.slice(0, 2);
  };

  const getPlayerStats = () => {
    if (!playerData || !playerData.stats) return [];
    
    const stats = [];
    
    if (playerData.stats.career) {
      Object.entries(playerData.stats.career).forEach(([key, value], index) => {
        // Ensure we have valid key and value
        if (key && value !== undefined && value !== null) {
          stats.push({
            id: `stat-${key}-${index}`, // Add unique ID
            label: key.replace(/([A-Z])/g, " $1").trim(),
            value: value,
            trend: Math.floor(Math.random() * 21) - 10 // Random trend for demo
          });
        }
      });
    }
    
    return stats.slice(0, 5); // Show top 5 stats
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-primary-muted truncate">Active Subscriptions</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-text">{getActiveSubscriptions()}</p>
              </div>
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary-action shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-primary-muted truncate">Member Since</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-text truncate">
                  {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary-action shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player-specific stats for players */}
      {userRole === "player" && playerData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsCard
            title="Career Statistics"
            stats={getPlayerStats()}
            icon={Trophy}
          />
          <Card className="bg-primary-card border border-divider">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary-action" />
                Player Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-muted">Position</span>
                <Badge className="bg-primary-action/10 text-primary-action">
                  {playerData.position}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-muted">Country</span>
                <span className="font-medium text-primary-text">{playerData.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-muted">Status</span>
                <Badge className="bg-green-100 text-green-800">
                  {playerData.contractStatus || "Available"}
                </Badge>
              </div>
              {playerData.featured && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Featured Player
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Subscriptions */}
      <Card className="bg-primary-card border border-divider">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary-action" />
              Active Subscriptions
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/__subscriptions">Manage All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {getRecentSubscriptions().length > 0 ? (
            <div className="space-y-4">
              {getRecentSubscriptions().map((subscription, index) => (
                <div key={subscription.id || `subscription-${index}`} className="p-4 rounded-lg border border-divider bg-primary-bg flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-primary-text capitalize">{subscription.plan || "Plan"}</p>
                    <p className="text-sm text-primary-muted">{subscription.type || "Subscription"}</p>
                  </div>
                  <Badge className={subscription.isActive ? "bg-green-100 text-green-800" : "bg-primary-muted/15 text-primary-muted"}>
                    {subscription.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Crown className="w-12 h-12 text-primary-muted mx-auto mb-4" />
              <p className="text-primary-muted mb-4">No subscriptions yet</p>
              <Button asChild>
                <Link href="#">View Plans</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-primary-card border border-divider">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-action" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href="/profile/settings">
                <Edit className="w-6 h-6 mb-2" />
                <span>Edit Profile</span>
              </Link>
            </Button>
            
            {userRole === "player" ? (
              <Button variant="outline" className="h-auto p-4 flex-col" asChild>
                <Link href="/player-profile/edit">
                  <Trophy className="w-6 h-6 mb-2" />
                  <span>Update Player Info</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="h-auto p-4 flex-col" asChild>
                <Link href="/submit-profile">
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Submit Player Profile</span>
                </Link>
              </Button>
            )}
            
            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href="/contact">
                <MessageCircle className="w-6 h-6 mb-2" />
                <span>Contact Support</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
