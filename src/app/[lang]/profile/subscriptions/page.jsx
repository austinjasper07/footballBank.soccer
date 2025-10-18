"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Crown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";
import ProfileLayout from "@/components/profile/ProfileLayout";
import SubscriptionCard from "@/components/profile/SubscriptionCard";

export default function SubscriptionsPage() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, user]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile/subscriptions");
      const data = await response.json();
      setSubscriptions(data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionToggle = async (subscriptionId, isActive) => {
    try {
      const response = await fetch("/api/profile/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId, isActive }),
      });

      if (response.ok) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading || loading) {
    return (
      <ProfileLayout title="Subscriptions" userRole={user?.role}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red" />
          <p className="ml-2 text-primary-muted">Loading subscriptions...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProfileLayout title="Subscriptions" userRole="user">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">Authentication Required</h2>
          <p className="text-primary-muted mb-6">Please log in to view your subscriptions.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  const activeSubscriptions = Array.isArray(subscriptions) ? subscriptions.filter(sub => sub.isActive) : [];
  const inactiveSubscriptions = Array.isArray(subscriptions) ? subscriptions.filter(sub => !sub.isActive) : [];

  return (
    <ProfileLayout title="Subscriptions" userRole={user?.role}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">My Subscriptions</h1>
            <p className="text-primary-muted">Manage your active subscriptions</p>
          </div>
          <Button asChild className="self-start sm:self-auto">
            <Link href="/pricing">
              <Plus className="w-4 h-4 mr-2" />
              View Plans
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-primary-card border border-divider">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-primary-muted truncate">Active Subscriptions</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-text">{activeSubscriptions.length}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-card border border-divider">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-primary-muted truncate">Total Subscriptions</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-text">{Array.isArray(subscriptions) ? subscriptions.length : 0}</p>
                </div>
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-accent-red flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-card border border-divider sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-primary-muted truncate">Monthly Cost</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-text truncate">
                    {formatCurrency(
                      activeSubscriptions.reduce((total, sub) => total + (sub.price || 0), 0)
                    )}
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-accent-red flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Subscriptions */}
        {activeSubscriptions.length > 0 && (
          <Card className="bg-primary-card border border-divider">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {activeSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription._id || subscription.id || `active-${Math.random()}`}
                    subscription={subscription}
                    onToggle={handleSubscriptionToggle}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inactive Subscriptions */}
        {inactiveSubscriptions.length > 0 && (
          <Card className="bg-primary-card border border-divider">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="w-5 h-5 text-primary-muted" />
                Inactive Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {inactiveSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription._id || subscription.id || `inactive-${Math.random()}`}
                    subscription={subscription}
                    onToggle={handleSubscriptionToggle}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Subscriptions */}
        {(!Array.isArray(subscriptions) || subscriptions.length === 0) && (
          <Card className="bg-primary-card border border-divider">
            <CardContent className="text-center py-12">
              <Crown className="w-16 h-16 text-primary-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-text mb-2">
                No subscriptions yet
              </h3>
              <p className="text-primary-muted mb-6">
                Subscribe to our services to get started
              </p>
              <Button asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProfileLayout>
  );
}
