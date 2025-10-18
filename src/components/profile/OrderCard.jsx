import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  
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
      toast({
        title: "Order ID Copied",
        description: "Order ID has been copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy order ID:', err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy order ID to clipboard",
        variant: "destructive",
      });
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

  // Use totalAmount from order if available, otherwise calculate from items
  const totalAmount = order.totalAmount || (order.items || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="border-b border-divider py-3 sm:py-4 hover:bg-muted/50 transition-colors">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {/* Mobile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                #{order._id ? order._id.slice(-8) : order.id ? order.id.slice(-8) : 'N/A'}
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
            <Badge className={getStatusColor(order.status || 'unknown')}>
              {getStatusIcon(order.status || 'unknown')}
              <span className="ml-1 capitalize text-xs">{order.status || 'Unknown'}</span>
            </Badge>
          </div>
          
          {/* Mobile Content */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-primary-muted">Items:</span>
              <span className="ml-1 font-medium">{(order.items || []).length}</span>
            </div>
            <div>
              <span className="text-primary-muted">Total:</span>
              <span className="ml-1 font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            <div>
              <span className="text-primary-muted">Date:</span>
              <span className="ml-1">{formatDate(order.createdAt || new Date())}</span>
            </div>
            <div>
              <Badge className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Paid
              </Badge>
            </div>
          </div>
          
          {/* Mobile Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href={`/profile/orders/${order._id || order.id || 'unknown'}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Link>
              </Button>
              {(order.status || 'unknown') === "completed" && (
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-8 gap-4 items-center text-sm">
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
