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
  RefreshCw,
} from "lucide-react";
import { getAllSubscriptions, updateSubscription } from "@/actions/adminActions";
import { useToast } from "@/hooks/use-toast";
import LoadingSplash from "@/components/ui/loading-splash";
import { SearchBar } from "@/components/admin/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubscriptionsView() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
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
    setUpdating((prev) => ({ ...prev, [subscriptionId]: true }));

    try {
      await updateSubscription(subscriptionId, { isActive });

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, isActive } : sub
        )
      );

      toast({
        title: "Success",
        description: `Subscription ${isActive ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

    if (expiry.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // 7 days
      return <Badge variant="secondary">Expiring Soon</Badge>;
    }

    return (
      <Badge className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "premium":
        return "text-yellow-600 bg-yellow-100";
      case "basic":
        return "text-blue-600 bg-blue-100";
      case "free":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const query = searchQuery.toLowerCase();
    const userName = sub.userId?.firstName && sub.userId?.lastName
      ? `${sub.userId.firstName} ${sub.userId.lastName}`.toLowerCase()
      : "";
    const userEmail = sub.userId?.email?.toLowerCase() || "";
    const plan = sub.plan?.toLowerCase() || "";
    const type = sub.type?.toLowerCase() || "";

    return (
      userName.includes(query) ||
      userEmail.includes(query) ||
      plan.includes(query) ||
      type.includes(query)
    );
  });

  if (loading) {
    return <LoadingSplash message="Loading subscriptions..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscriptions Management</h2>
          <p className="text-muted-foreground">Manage user subscriptions and billing</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search subscriptions..."
            className="w-80"
          />
          <Button onClick={fetchSubscriptions} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Subscriptions</p>
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
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {subscriptions.filter((sub) => sub.isActive).length}
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
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">
                  {subscriptions.filter((sub) => !sub.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Subscriptions Found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "No subscriptions match your search criteria."
                  : "No subscriptions have been created yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Stripe ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id || subscription._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {subscription.userId?.firstName && subscription.userId?.lastName
                              ? `${subscription.userId.firstName} ${subscription.userId.lastName}`
                              : "Unknown User"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {subscription.userId?.email || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanColor(subscription.plan)}>
                          {subscription.plan?.toUpperCase() || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {subscription.type?.replace("_", " ") || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.isActive, subscription.expiresAt)}
                      </TableCell>
                      <TableCell>{formatDate(subscription.startedAt)}</TableCell>
                      <TableCell>{formatDate(subscription.expiresAt)}</TableCell>
                      <TableCell>
                        {subscription.stripeSubId ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            {subscription.stripeSubId.substring(0, 20)}...
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {subscription.isActive ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleToggleSubscription(subscription.id || subscription._id, false)
                              }
                              disabled={updating[subscription.id || subscription._id]}
                            >
                              {updating[subscription.id || subscription._id] ? (
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                handleToggleSubscription(subscription.id || subscription._id, true)
                              }
                              disabled={updating[subscription.id || subscription._id]}
                            >
                              {updating[subscription.id || subscription._id] ? (
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Activate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
