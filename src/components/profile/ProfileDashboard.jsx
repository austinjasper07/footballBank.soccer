import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ShoppingBag,
  Crown,
  Users,
  Trophy,
  Star,
  Eye,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "./StatsCard";
import OrderCard from "./OrderCard";
import SubscriptionCard from "./SubscriptionCard";

export default function ProfileDashboard({ 
  userData, 
  orders = [], 
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTotalSpent = () => {
    if (!Array.isArray(orders)) return 0;
    return orders
      .filter(order => order.status === "completed")
      .reduce((total, order) => {
        return total + (order.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }, 0);
  };

  const getActiveSubscriptions = () => {
    if (!Array.isArray(subscriptions)) return 0;
    return subscriptions.filter(sub => sub.isActive).length;
  };

  const getRecentOrders = () => {
    if (!Array.isArray(orders)) return [];
    return orders.slice(0, 3);
  };

  const getRecentSubscriptions = () => {
    if (!Array.isArray(subscriptions)) return [];
    return subscriptions.slice(0, 2);
  };

  const getPlayerStats = () => {
    if (!playerData || !playerData.stats) return [];
    
    const stats = [];
    
    if (playerData.stats.career) {
      Object.entries(playerData.stats.career).forEach(([key, value]) => {
        stats.push({
          label: key.replace(/([A-Z])/g, " $1").trim(),
          value: value,
          trend: Math.floor(Math.random() * 21) - 10 // Random trend for demo
        });
      });
    }
    
    return stats.slice(0, 5); // Show top 5 stats
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-muted">Total Orders</p>
                <p className="text-2xl font-bold text-primary-text">{orders.length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-accent-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-muted">Active Subscriptions</p>
                <p className="text-2xl font-bold text-primary-text">{getActiveSubscriptions()}</p>
              </div>
              <Crown className="w-8 h-8 text-accent-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-muted">Total Spent</p>
                <p className="text-2xl font-bold text-primary-text">{formatCurrency(getTotalSpent())}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-muted">Member Since</p>
                <p className="text-2xl font-bold text-primary-text">
                  {formatDate(userData?.createdAt).split(" ")[1]}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-accent-red" />
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
                <Star className="w-5 h-5 text-accent-red" />
                Player Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-muted">Position</span>
                <Badge className="bg-accent-red/10 text-accent-red">
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

      {/* Recent Orders */}
      <Card className="bg-primary-card border border-divider">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-red" />
              Recent Orders
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {getRecentOrders().length > 0 ? (
            <div className="space-y-4">
              {getRecentOrders().map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-primary-muted mx-auto mb-4" />
              <p className="text-primary-muted mb-4">No orders yet</p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Subscriptions */}
      <Card className="bg-primary-card border border-divider">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent-red" />
              Active Subscriptions
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/subscriptions">Manage All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {getRecentSubscriptions().length > 0 ? (
            <div className="space-y-4">
              {getRecentSubscriptions().map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Crown className="w-12 h-12 text-primary-muted mx-auto mb-4" />
              <p className="text-primary-muted mb-4">No subscriptions yet</p>
              <Button asChild>
                <Link href="/subscriptions">View Plans</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-primary-card border border-divider">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-red" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href="/profile/edit">
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
