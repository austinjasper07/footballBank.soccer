/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import {
  Users,
  Inbox,
  DollarSign,
  Trophy,
  UserPlus,
  ShoppingCart,
  FileText,
  TrendingUp,
  Package,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow, isSameMonth, parseISO } from "date-fns";
import { getAllUsers, getAllPosts, getAllOrders, getAllPlayers, getAllSubmissions, getAllProducts } from "@/actions/adminActions";
import { formatFullDate } from "@/utils/dateHelper";
import { useToast } from "@/hooks/use-toast";
import LoadingSplash from "@/components/ui/loading-splash";

export function DashboardView() {
  const [users, setUsers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const playersRes = await getAllPlayers();
        const usersRes = await getAllUsers();
        const postsRes = await getAllPosts();
        const ordersRes = await getAllOrders();
        const submissionsRes = await getAllSubmissions();
        const productsRes = await getAllProducts();

        setPlayers(playersRes);
        setUsers(usersRes);
        setPosts(postsRes);
        setOrders(ordersRes);
        setSubmissions(submissionsRes);
        setProducts(productsRes);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong while fetching data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getVariantClasses = (variant) => {
    switch (variant) {
      case "blue":
        return { iconColor: "text-primary-action", iconBg: "bg-primary-action/10" };
      case "green":
        return { iconColor: "text-primary-action", iconBg: "bg-primary-action/10" };
      case "amber":
        return { iconColor: "text-primary-navy", iconBg: "bg-primary-accent" };
      case "red":
        return { iconColor: "text-primary-text-inverse", iconBg: "bg-secondary-bg" };
      default:
        return { iconColor: "text-primary-text-inverse", iconBg: "bg-primary-navy" };
    }
  };

  const getMonthlyCount = (items, monthOffset = 0) => {
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    return items.filter(item => isSameMonth(new Date(item.createdAt), targetMonth)).length;
  };

  const getMonthlyRevenue = (ordersList, monthOffset = 0) => {
    if (!Array.isArray(ordersList)) return 0;
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    return ordersList.reduce((total, order) => {
      if (!isSameMonth(new Date(order.createdAt), targetMonth)) return total;
      const orderTotal = order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
      return total + orderTotal;
    }, 0);
  };

  const currentRevenue = getMonthlyRevenue(orders, 0);
  const lastMonthRevenue = getMonthlyRevenue(orders, 1);
  const revenueGrowth = lastMonthRevenue === 0 ? 0 : ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  const currentPostCount = getMonthlyCount(posts, 0);
  const lastPostCount = getMonthlyCount(posts, 1);
  const postGrowth = lastPostCount === 0 ? 0 : ((currentPostCount - lastPostCount) / lastPostCount) * 100;

  const currentPlayerCount = getMonthlyCount(players, 0);
  const lastPlayerCount = getMonthlyCount(players, 1);
  const playerGrowth = lastPlayerCount === 0 ? 0 : ((currentPlayerCount - lastPlayerCount) / lastPlayerCount) * 100;

  const currentProductCount = getMonthlyCount(products, 0);
  const lastProductCount = getMonthlyCount(products, 1);
  const productGrowth = lastProductCount === 0 ? 0 : ((currentProductCount - lastProductCount) / lastProductCount) * 100;

  const currentUserCount = getMonthlyCount(users, 0);
  const lastUserCount = getMonthlyCount(users, 1);
  const userGrowth = lastUserCount === 0 ? 0 : ((currentUserCount - lastUserCount) / lastUserCount) * 100;

  const dynamicMetrics = [
    {
      title: "Total Users",
      value: users.length.toLocaleString(),
      icon: Users,
      change: `${userGrowth >= 0 ? "+" : ""}${userGrowth.toFixed(1)}% from last month`,
      positive: userGrowth >= 0,
      variant: "blue"
    },
    {
      title: "Total Players",
      value: players.length.toLocaleString(),
      icon: UserPlus,
      change: `${playerGrowth >= 0 ? "+" : ""}${playerGrowth.toFixed(1)}% from last month`,
      positive: playerGrowth >= 0,
      variant: "green"
    },
    {
      title: "Total Products",
      value: products.length.toLocaleString(),
      icon: Package,
      change: `${productGrowth >= 0 ? "+" : ""}${productGrowth.toFixed(1)}% from last month`,
      positive: productGrowth >= 0,
      variant: "amber"
    },
    {
      title: "Monthly Revenue",
      value: `$${currentRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}% from last month`,
      positive: revenueGrowth >= 0,
      variant: "green"
    },
    {
      title: "Total Posts",
      value: posts.length.toString(),
      icon: Trophy,
      change: `${postGrowth >= 0 ? "+" : ""}${postGrowth.toFixed(1)}% from last month`,
      positive: postGrowth >= 0,
      variant: "red"
    }
  ];

  const recentActivity = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Player activities
    const playerActivity = Array.isArray(players)
      ? players
          .filter((player) => new Date(player.createdAt) >= oneWeekAgo)
          .map((player) => ({
            icon: UserPlus,
            variant: "green",
            title: "New player submission",
            description: `${player.firstName} ${player.lastName} – ${player.position}`,
            time: formatDistanceToNow(new Date(player.createdAt), { addSuffix: true }),
            createdAt: new Date(player.createdAt)
          }))
      : [];

    // User activities
    const userActivity = Array.isArray(users)
      ? users
          .filter((user) => new Date(user.createdAt) >= oneWeekAgo)
          .map((user) => ({
            icon: Users,
            variant: "blue",
            title: "New user registered",
            description: `${user.firstName} ${user.lastName} – ${user.role}`,
            time: formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }),
            createdAt: new Date(user.createdAt)
          }))
      : [];

    // Order activities
    const orderActivity = Array.isArray(orders)
      ? orders
          .filter((order) => new Date(order.createdAt) >= oneWeekAgo)
          .map((order) => ({
            icon: ShoppingCart,
            variant: "blue",
            title: "New order placed",
            description: `Order #${order.id} – $${order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}`,
            time: formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }),
            createdAt: new Date(order.createdAt)
          }))
      : [];

    // Post activities
    const postActivity = Array.isArray(posts)
      ? posts
          .filter((post) => new Date(post.createdAt) >= oneWeekAgo)
          .map((post) => ({
            icon: FileText,
            variant: "amber",
            title: "New blog post",
            description: post.title,
            time: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
            createdAt: new Date(post.createdAt)
          }))
      : [];

    // Product activities
    const productActivity = Array.isArray(products)
      ? products
          .filter((product) => new Date(product.createdAt) >= oneWeekAgo)
          .map((product) => ({
            icon: Package,
            variant: "green",
            title: "New product added",
            description: `${product.name} – $${product.price}`,
            time: formatDistanceToNow(new Date(product.createdAt), { addSuffix: true }),
            createdAt: new Date(product.createdAt)
          }))
      : [];

    // Submission activities
    const submissionActivity = Array.isArray(submissions)
      ? submissions
          .filter((submission) => new Date(submission.createdAt) >= oneWeekAgo)
          .map((submission) => ({
            icon: Inbox,
            variant: "red",
            title: "New submission",
            description: `${submission.firstName} ${submission.lastName} – ${submission.status}`,
            time: formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true }),
            createdAt: new Date(submission.createdAt)
          }))
      : [];

    return [
      ...playerActivity, 
      ...userActivity, 
      ...orderActivity, 
      ...postActivity, 
      ...productActivity, 
      ...submissionActivity
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8);
  }, [orders, players, posts, users, products, submissions]);


  return (
    <div className="space-y-8 font-body">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const variantClasses = getVariantClasses(metric.variant);
          return (
            <Card key={`metric-${metric.title}-${index}`} className="overflow-hidden border border-divider bg-primary-card shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-muted">{metric.title}</p>
                    <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">
                      {loading ? "..." : metric.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${variantClasses.iconBg}`}>
                    <Icon className={`h-6 w-6 ${variantClasses.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-4 w-4 ${metric.positive ? "text-accent-green" : "text-accent-red"}`} />
                  <p className={`text-sm font-medium ${metric.positive ? "text-accent-green" : "text-accent-red"}`}>
                    {metric.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                const variantClasses = getVariantClasses(activity.variant);
                return (
                  <div key={`activity-${activity.title}-${index}`} className="flex items-center gap-4 border-b border-divider/70 p-3 last:border-0 hover:bg-primary-bg transition-colors">
                    <div className={`p-2 rounded-lg ${variantClasses.iconBg}`}>
                      <Icon className={`h-4 w-4 ${variantClasses.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-primary-muted">{activity.description}</p>
                    </div>
                    <span className="whitespace-nowrap text-sm text-primary-muted">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
