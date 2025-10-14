"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Search,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import ProfileLayout from "@/components/profile/ProfileLayout";
import OrderCard from "@/components/profile/OrderCard";

export default function OrdersPage() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profile/orders?page=${currentPage}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
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
        fetchOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const matchesSearch =
          (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some((item) =>
            (item.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
          );
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

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

  if (isLoading || loading) {
    return (
      <ProfileLayout title="Orders" userRole={user?.role}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red" />
          <p className="ml-2 text-primary-muted">Loading orders...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProfileLayout title="Orders" userRole="user">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">
            Authentication Required
          </h2>
          <p className="text-primary-muted mb-6">
            Please log in to view your orders.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Orders" userRole={user?.role}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-text">
              Order History
            </h1>
            <p className="text-primary-muted">View and manage your orders</p>
          </div>
          <Button asChild>
            <Link href="/shop">
              <Package className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-primary-card border border-divider">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-divider rounded-md bg-primary-bg text-primary-text"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" onClick={fetchOrders}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id || `order-${index}`}
                order={order}
                onCancel={handleCancelOrder}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-primary-card border border-divider">
            <CardContent className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-primary-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-text mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No orders found"
                  : "No orders yet"}
              </h3>
              <p className="text-primary-muted mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start shopping to see your orders here"}
              </p>
              <Button asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-primary-muted">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
