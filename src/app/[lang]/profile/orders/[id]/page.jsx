"use client";

import React, { useState, useEffect, use } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  X,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Copy,
} from "lucide-react";
import Link from "next/link";
import ProfileLayout from "@/components/profile/ProfileLayout";
import Image from "next/image";

export default function OrderDetailPage({ params }) {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    if (isAuthenticated && user && resolvedParams.id) {
      fetchOrder();
    }
  }, [isAuthenticated, user, resolvedParams.id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile/orders/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        setError("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  if (isLoading || loading) {
    return (
      <ProfileLayout title="Order Details" userRole={user?.role}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red" />
          <p className="ml-2 text-primary-muted">Loading order details...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProfileLayout title="Order Details" userRole="user">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">
            Authentication Required
          </h2>
          <p className="text-primary-muted mb-6">
            Please log in to view order details.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  if (error || !order) {
    return (
      <ProfileLayout title="Order Details" userRole={user?.role}>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">
            {error || "Order Not Found"}
          </h2>
          <p className="text-primary-muted mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link href="/profile/orders">Back to Orders</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  // Use totalAmount from order if available, otherwise calculate from items
  const subtotal = order.totalAmount || (order.items || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  
  // Calculate tax and shipping from order data
  const taxAmount = order.taxAmount || 0;
  const shippingAmount = order.shippingAmount || 0;

  return (
    <ProfileLayout title="Order Details" userRole={user?.role}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/profile/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary-text">
                Order #{order._id ? order._id.slice(-8) : order.id ? order.id.slice(-8) : 'Unknown'}
              </h1>
              <p className="text-primary-muted">
                Placed on {formatDate(order.createdAt || new Date())}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(order.status || 'unknown')}>
            {getStatusIcon(order.status || 'unknown')}
            <span className="ml-1 capitalize">{order.status || 'Unknown'}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="bg-primary-card border border-divider">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-divider rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name || 'Product'}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-text">{item.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-primary-muted">
                          Quantity: {item.quantity || 1}
                        </p>
                        {item.size && (
                          <p className="text-sm text-primary-muted">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-primary-muted">Color: {item.color}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary-text">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </p>
                        <p className="text-sm text-primary-muted">
                          {formatCurrency(item.price || 0)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Information */}
            <Card className="bg-primary-card border border-divider">
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-primary-muted">Order ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {order._id ? order._id.slice(-8) : order.id ? order.id.slice(-8) : 'Unknown'}
                    </span>
                    {(order._id || order.id) && (
                      <button
                        onClick={() => copyOrderId(order._id || order.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-muted">Order Date:</span>
                  <span>{formatDate(order.createdAt || new Date())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-muted">Status:</span>
                  <Badge className={getStatusColor(order.status || 'unknown')}>
                    {getStatusIcon(order.status || 'unknown')}
                    <span className="ml-1 capitalize">{order.status || 'Unknown'}</span>
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-muted">Payment Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card className="bg-primary-card border border-divider">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <Card className="bg-primary-card border border-divider">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className={shippingAmount === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingAmount === 0 ? "FREE" : formatCurrency(shippingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="border-t border-divider pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-accent-red">{formatCurrency(subtotal + taxAmount + shippingAmount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}
