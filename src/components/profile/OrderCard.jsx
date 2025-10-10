import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  X,
  Eye,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function OrderCard({ order, onCancel, showActions = true }) {
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
        return null;
    }
  };

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Card className="bg-primary-card border border-divider hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-primary-text">
                Order #{order.id.slice(-8)}
              </div>
              <div className="text-sm text-primary-muted flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
            {order.status === "pending" && showActions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(order.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item, index) => (
            <div
              key={`${order.id}-item-${index}`}
              className="flex items-center justify-between p-3 bg-primary-bg rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-red to-red-600 rounded flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-primary-text">
                    {item.name}
                  </div>
                  <div className="text-sm text-primary-muted">
                    Qty: {item.quantity}
                  </div>
                </div>
              </div>
              <div className="font-medium text-primary-text">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-divider">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary-muted" />
            <span className="text-sm text-primary-muted">Total:</span>
            <span className="font-semibold text-primary-text">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/orders/${order.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
              {order.status === "completed" && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
