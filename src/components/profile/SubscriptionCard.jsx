import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  CheckCircle,
  X,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function SubscriptionCard({ 
  subscription, 
  onToggle, 
  showActions = true 
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "premium":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
      case "standard":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900";
      case "basic":
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-gray-900";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-gray-900";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "live_streaming":
        return "📺";
      case "player_publication":
        return "📝";
      default:
        return "📋";
    }
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(subscription.expiresAt);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    const expiryDate = new Date(subscription.expiresAt);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <Card className="bg-primary-card border border-divider hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-primary-text flex items-center gap-2">
                {getTypeIcon(subscription.type)}
                {subscription.type.replace("_", " ").toUpperCase()}
              </div>
              <div className="text-sm text-primary-muted">
                {subscription.plan.toUpperCase()} Plan
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={
                subscription.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {subscription.isActive ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <X className="w-4 h-4 mr-1" />
              )}
              {subscription.isActive ? "Active" : "Inactive"}
            </Badge>
            {showActions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggle(subscription._id || subscription.id, !subscription.isActive)}
              >
                {subscription.isActive ? "Deactivate" : "Activate"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-primary-muted mb-1">Started</div>
            <div className="font-medium text-primary-text flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(subscription.startedAt)}
            </div>
          </div>
          <div>
            <div className="text-sm text-primary-muted mb-1">Expires</div>
            <div className="font-medium text-primary-text flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatDate(subscription.expiresAt)}
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {isExpired() && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Subscription Expired</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Your subscription expired on {formatDate(subscription.expiresAt)}. 
              Renew to continue using this service.
            </p>
          </div>
        )}

        {isExpiringSoon() && !isExpired() && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Expiring Soon</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Your subscription expires on {formatDate(subscription.expiresAt)}. 
              Consider renewing to avoid service interruption.
            </p>
          </div>
        )}

        {/* Plan Badge */}
        <div className="mb-4">
          <Badge className={getPlanColor(subscription.plan)}>
            {subscription.plan.toUpperCase()} PLAN
          </Badge>
        </div>

      </CardContent>
    </Card>
  );
}
