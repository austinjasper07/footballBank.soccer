"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

export default function SubscriptionManager({ subscriptions, onUpdate }) {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const handleCancelSubscription = async (subscriptionId) => {
    setLoading(prev => ({ ...prev, [subscriptionId]: true }));
    setError(null);

    console.log('Attempting to cancel subscription:', subscriptionId);

    try {
      const response = await fetch("/api/profile/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          subscriptionId, 
          isActive: false 
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || "Failed to cancel subscription");
      }

      const result = await response.json();
      console.log('API success response:', result);

      // Refresh subscriptions
      if (onUpdate) onUpdate();
      
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleReactivateSubscription = async (subscriptionId) => {
    setLoading(prev => ({ ...prev, [subscriptionId]: true }));
    setError(null);

    console.log('Attempting to reactivate subscription:', subscriptionId);

    try {
      const response = await fetch("/api/profile/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          subscriptionId, 
          isActive: true 
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || "Failed to reactivate subscription");
      }

      const result = await response.json();
      console.log('API success response:', result);

      // Refresh subscriptions
      if (onUpdate) onUpdate();
      
    } catch (err) {
      console.error("Error reactivating subscription:", err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (isActive, expiresAt, plan) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    if (!isActive) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    
    if (expiry < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (expiry.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) { // 7 days
      return <Badge variant="secondary">Expiring Soon</Badge>;
    }
    
    if (plan === "free") {
      return <Badge variant="outline" className="text-green-600 border-green-600">Free Plan</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  const getStatusIcon = (isActive, expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    if (!isActive) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    
    if (expiry < now) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Subscriptions Found
          </h3>
          <p className="text-gray-500">
            You don't have any active subscriptions yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}
      
      {subscriptions.map((subscription) => (
        <Card key={subscription._id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <div>
                  <CardTitle className="text-lg capitalize">
                    {subscription.plan} Plan
                  </CardTitle>
                  <p className="text-sm text-gray-500 capitalize">
                    {subscription.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(subscription.isActive, subscription.expiresAt)}
                  {getStatusBadge(subscription.isActive, subscription.expiresAt, subscription.plan)}
                </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Started</p>
                  <p className="font-medium">
                    {formatDate(subscription.startedAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Expires</p>
                  <p className="font-medium">
                    {formatDate(subscription.expiresAt)}
                  </p>
                </div>
              </div>
            </div>

            {subscription.stripeSubId && (
              <div className="mb-4">
                <p className="text-xs text-gray-500">Stripe ID</p>
                <p className="font-mono text-sm text-gray-600">
                  {subscription.stripeSubId}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              {subscription.isActive ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelSubscription(subscription._id)}
                  disabled={loading[subscription._id]}
                >
                  {loading[subscription._id] ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Cancel Subscription
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleReactivateSubscription(subscription._id)}
                  disabled={loading[subscription._id]}
                >
                  {loading[subscription._id] ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Reactivate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
