"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Calendar, 
  User, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { getAllSubscriptions, updateSubscription } from "@/actions/adminActions";
import { useToast } from "@/hooks/use-toast";
import LoadingSplash from "@/components/ui/loading-splash";

export default function SubscriptionsView() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (subscriptionId, isActive) => {
    setUpdating(prev => ({ ...prev, [subscriptionId]: true }));
    
    try {
      await updateSubscription(subscriptionId, { isActive });
      
      setSubscriptions(prev => 
        prev.map(sub => 
          sub._id === subscriptionId 
            ? { ...sub, isActive } 
            : sub
        )
      );
      
      toast({
        title: "Success",
        description: `Subscription ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setUpdating(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (isActive, expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    if (!isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    
    if (expiry < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (expiry.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) { // 7 days
      return <Badge variant="secondary">Expiring Soon</Badge>;
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

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'premium':
        return 'text-yellow-600 bg-yellow-100';
      case 'basic':
        return 'text-blue-600 bg-blue-100';
      case 'free':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <LoadingSplash message="Loading subscriptions..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscriptions Management</h2>
          <p className="text-gray-600">Manage user subscriptions and billing</p>
        </div>
        <Button onClick={fetchSubscriptions} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {subscriptions.filter(sub => sub.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">
                  {subscriptions.filter(sub => !sub.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription._id}>
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
                  {getStatusBadge(subscription.isActive, subscription.expiresAt)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="font-medium">
                      {subscription.userId?.firstName} {subscription.userId?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{subscription.userId?.email}</p>
                  </div>
                </div>
                
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
                  <Calendar className="w-4 h-4 text-gray-400" />
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
                  <p className="text-xs text-gray-500">Stripe Subscription ID</p>
                  <p className="font-mono text-sm text-gray-600">
                    {subscription.stripeSubId}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge className={getPlanColor(subscription.plan)}>
                  {subscription.plan.toUpperCase()}
                </Badge>
                
                <div className="flex space-x-2">
                  {subscription.isActive ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleToggleSubscription(subscription._id, false)}
                      disabled={updating[subscription._id]}
                    >
                      {updating[subscription._id] ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleToggleSubscription(subscription._id, true)}
                      disabled={updating[subscription._id]}
                    >
                      {updating[subscription._id] ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Subscriptions Found
            </h3>
            <p className="text-gray-500">
              No subscriptions have been created yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
