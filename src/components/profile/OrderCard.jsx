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
  Copy,
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

  const copyOrderId = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      // You could add a toast notification here if needed
    } catch (err) {
      console.error('Failed to copy order ID:', err);
    }
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

  const totalAmount = (order.items || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="border-b border-divider py-4 hover:bg-muted/50 transition-colors">
      <div className="grid grid-cols-8 gap-4 items-center text-sm">
        {/* Order ID */}
        <div className="font-mono text-sm flex items-center gap-2">
          <span>
            {order._id ? order._id.slice(-8) : order.id ? order.id.slice(-8) : 'N/A'}
          </span>
          {(order._id || order.id) && (
            <button
              onClick={() => copyOrderId(order._id || order.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy Order ID"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {/* Customer (simplified for profile view) */}
        <div className="text-sm">
          You
        </div>
        
        {/* Items Count */}
        <div className="text-sm">
          {(order.items || []).length} items
        </div>
        
        {/* Total Amount */}
        <div className="font-medium">
          {formatCurrency(totalAmount)}
        </div>
        
        {/* Order Status */}
        <div>
          <Badge className={getStatusColor(order.status || 'unknown')}>
            {getStatusIcon(order.status || 'unknown')}
            <span className="ml-1 capitalize">{order.status || 'Unknown'}</span>
          </Badge>
        </div>
        
        {/* Payment Status (simplified) */}
        <div>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        </div>
        
        {/* Date */}
        <div className="text-sm text-muted-foreground">
          {formatDate(order.createdAt || new Date())}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          {showActions && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/profile/orders/${order._id || order.id || 'unknown'}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
              {(order.status || 'unknown') === "completed" && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
