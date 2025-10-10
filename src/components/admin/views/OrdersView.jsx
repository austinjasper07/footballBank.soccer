'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, Package, Truck, CheckCircle, XCircle, RefreshCw, CreditCard, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { SearchBar } from '@/components/admin/SearchBar';
import { getAllOrders, updateOrderStatus, getOrderById } from '@/actions/adminActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ITEMS_PER_PAGE = 5;

export default function OrdersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders();
        setOrders(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const safeOrders = useMemo(() => {
    return Array.isArray(orders) ? orders : [];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return safeOrders.filter((order) => {
      return (
        order.id.toLowerCase().includes(q) ||
        order.userId.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    });
  }, [safeOrders, searchQuery]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'fulfilled':
        return <Truck className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'fulfilled':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const countStatus = () => {
    const pending = safeOrders.filter((o) => o.status === 'pending').length;
    const fulfilled = safeOrders.filter((o) => o.status === 'fulfilled').length;
    const completed = safeOrders.filter((o) => o.status === 'completed').length;
    const cancelled = safeOrders.filter((o) => o.status === 'cancelled').length;
    const total = safeOrders.length;
    return { pending, fulfilled, completed, cancelled, total };
  };

  const { pending, fulfilled, completed, cancelled, total } = countStatus();

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setLoadingStates(prev => ({ ...prev, [orderId]: true }));
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result && !result.error) {
        // Refresh orders list
        const updatedOrders = await getAllOrders();
        setOrders(updatedOrders);
      } else {
        console.error('Failed to update order status:', result);
        alert('Failed to update order status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const orderDetails = await getOrderById(orderId);
      setSelectedOrder(orderDetails);
      setOrderDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Error fetching order details. Please try again.');
    }
  };

  const getPaymentStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4" />;
      case 'refunded':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'refunded':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Truck className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
                <p className="text-2xl font-bold">{fulfilled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Orders</h2>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders..."
            className="w-80"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Order Status</th>
                  <th className="text-left p-4 font-medium">Payment Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4 text-sm">
                      {order.userId?.firstName && order.userId?.lastName 
                        ? `${order.userId.firstName} ${order.userId.lastName}`
                        : order.userId?.email || 'Unknown Customer'
                      }
                    </td>
                    <td className="p-4">{order.items.length} items</td>
                    <td className="p-4 font-medium">
                      ${order.totalAmount ? order.totalAmount.toFixed(2) : order.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {getPaymentStatusIcon(order.paymentStatus)}
                        <span className="ml-1 capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewOrderDetails(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOrderStatusUpdate(order.id, 'fulfilled')}
                              disabled={loadingStates[order.id]}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              {loadingStates[order.id] ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Truck className="h-4 w-4" />
                              )}
                              <span className="ml-1">Fulfill</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}
                              disabled={loadingStates[order.id]}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              {loadingStates[order.id] ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              <span className="ml-1">Cancel</span>
                            </Button>
                          </>
                        )}
                        {order.status === 'fulfilled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                            disabled={loadingStates[order.id]}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {loadingStates[order.id] ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span className="ml-1">Complete</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Order ID</h4>
                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Order Date</h4>
                  <p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Customer</h4>
                  <p className="text-sm">
                    {selectedOrder.userId?.firstName && selectedOrder.userId?.lastName 
                      ? `${selectedOrder.userId.firstName} ${selectedOrder.userId.lastName}`
                      : selectedOrder.userId?.email || 'Unknown Customer'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Total Amount</h4>
                  <p className="text-sm font-semibold">
                    ${selectedOrder.totalAmount ? selectedOrder.totalAmount.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Order Status</h4>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Payment Status</h4>
                  <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {getPaymentStatusIcon(selectedOrder.paymentStatus)}
                    <span className="ml-1 capitalize">{selectedOrder.paymentStatus}</span>
                  </Badge>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={`${selectedOrder.id}-item-${index}`} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stripe Session ID */}
              {selectedOrder.stripeSessionId && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Stripe Session ID</h4>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{selectedOrder.stripeSessionId}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
