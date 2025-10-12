"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  ShoppingBag,
  Crown,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Bell,
  Edit,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import OrderCard from "@/components/profile/OrderCard";
import SubscriptionCard from "@/components/profile/SubscriptionCard";
import SubscriptionManager from "@/components/SubscriptionManager";
import "aos/dist/aos.css";

export default function UserProfilePage() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);

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

  const fetchOrders = async (page = 1) => {
    // Don't make API calls if not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const response = await fetch(`/api/profile/orders?page=${page}`);
      
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
      setOrdersTotalPages(data.totalPages || 1);
      setOrdersPage(page);
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

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch("/api/profile/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        fetchOrders(ordersPage);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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
      href: "/profile/edit",
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <ProfileDashboard
            userData={profileData}
            orders={orders}
            subscriptions={subscriptions}
            userRole={profileData?.role}
          />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent-red" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={handleCancelOrder}
                    />
                  ))}

                  {/* Pagination */}
                  {ordersTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(ordersPage - 1)}
                        disabled={ordersPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-primary-muted">
                        Page {ordersPage} of {ordersTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(ordersPage + 1)}
                        disabled={ordersPage === ordersTotalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-primary-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-text mb-2">
                    No orders yet
                  </h3>
                  <p className="text-primary-muted mb-6">
                    Start shopping to see your orders here
                  </p>
                  <Button asChild>
                    <Link href="/shop">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-accent-red" />
                My Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionManager 
                subscriptions={subscriptions} 
                onUpdate={fetchSubscriptions}
              />
            </CardContent>
          </Card>
        </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-accent-red" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-primary-text">
                      Full Name
                    </label>
                    <div className="text-primary-muted">
                      {profileData?.firstName} {profileData?.lastName}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary-text">
                      Email
                    </label>
                    <div className="text-primary-muted">{profileData?.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary-text">
                      Role
                    </label>
                    <div className="text-primary-muted">
                      {profileData?.role?.toUpperCase()}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/edit">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Information
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-red" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-primary-text">
                      Password
                    </label>
                    <div className="text-primary-muted">
                      Last updated: {formatDate(profileData?.updatedAt)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary-text">
                      Two-Factor Authentication
                    </label>
                    <div className="text-primary-muted">Not enabled</div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Update Security
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent-red" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary-text">
                      Email Notifications
                    </div>
                    <div className="text-sm text-primary-muted">
                      Receive updates about your orders and subscriptions
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary-text">
                      SMS Notifications
                    </div>
                    <div className="text-sm text-primary-muted">
                      Get text messages for important updates
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </ProfileLayout>
  );
}
