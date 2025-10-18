"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Edit,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import "aos/dist/aos.css";

export default function UserProfilePage() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only make API calls if user is authenticated and not loading
    if (isAuthenticated && user && !isLoading) {
      fetchProfileData();
      fetchOrders();
      fetchSubscriptions();
    }
  }, [isAuthenticated, user, isLoading]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [isLoading, isAuthenticated]);

  const fetchProfileData = async () => {
    // Don't make API calls if not authenticated
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/user");
      
      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated, redirect to login
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        console.warn("Empty response from profile API");
        setProfileData(null);
        return;
      }
      
      const data = JSON.parse(text);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    // Don't make API calls if not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const response = await fetch(`/api/profile/orders?page=1&limit=3`);
      
      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated, redirect to login
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        console.warn("Empty response from orders API");
        setOrders([]);
        return;
      }
      
      const data = JSON.parse(text);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchSubscriptions = async () => {
    // Don't make API calls if not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const response = await fetch("/api/profile/subscriptions");
      
      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated, redirect to login
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        console.warn("Empty response from subscriptions API");
        setSubscriptions([]);
        return;
      }
      
      const data = JSON.parse(text);
      console.log('Subscriptions API response:', data);
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    }
  };


  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red mx-auto mb-4" />
          <p className="text-primary-muted">Loading your profile...</p>
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
            Please log in to access your profile.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const profileActions = [
    {
      label: "Edit Profile",
      icon: Edit,
      href: "/profile/settings",
      variant: "outline"
    },
    {
      label: "Submit Profile",
      icon: Plus,
      href: "/submit-profile"
    }
  ];

  return (
    <ProfileLayout
      title={`${profileData?.firstName} ${profileData?.lastName}`}
      subtitle={profileData?.email}
      userRole={profileData?.role}
      actions={profileActions}
    >
      <ProfileDashboard
        userData={profileData}
        orders={orders}
        subscriptions={subscriptions}
        userRole={profileData?.role}
      />
    </ProfileLayout>
  );
}
