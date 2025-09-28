"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardView } from "@/components/admin/views/DashboardView";
import PlayersView from "@/components/admin/views/PlayersView";
import SubmissionsView from "@/components/admin/views/SubmissionsView";
import ShopView from "@/components/admin/views/ShopView";
import OrdersView from "@/components/admin/views/OrdersView";
import BlogView from "@/components/admin/views/BlogView";
import { SettingsView } from "@/components/admin/views/SettingsView";
import { AffiliateView } from "@/components/admin/views/AffiliateView";
import UsersView from "@/components/admin/views/UsersView";
import { useAuth } from "@/context/NewAuthContext";
import { useToast } from "@/hooks/use-toast";
import SplashScreen from "@/components/SplashScreen";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
  if (!isLoading && pathname) {
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${pathname}`);
    } else if (role ) {
      const isAdminUser = role === "admin";
      if (!isAdminUser) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this page.",
          variant: "destructive",
        });
        router.replace("/");
      } else {
        setCheckedAuth(true);
      }
    }
  }
}, [isAuthenticated, isLoading, role, pathname, router, toast]);


  if (isLoading || !checkedAuth) {
    return <SplashScreen />; // or return null
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "players":
        return <PlayersView />;
      case "users":
        return <UsersView />;
      case "submissions":
        return <SubmissionsView />;
      case "shop":
        return <ShopView />;
      case "orders":
        return <OrdersView />;
      case "blog":
        return <BlogView />;
      case "affiliate":
        return <AffiliateView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const getViewTitle = () => {
    const titles = {
      dashboard: {
        title: "Dashboard",
        subtitle: "Overview of your platform metrics",
      },
      players: {
        title: "Players",
        subtitle: "Manage football players and profiles",
      },
      users: { title: "Users", subtitle: "Manage users and profiles" },
      submissions: {
        title: "Submissions",
        subtitle: "Review and moderate player submissions",
      },
      shop: { title: "Shop", subtitle: "Manage products and inventory" },
      orders: { title: "Orders", subtitle: "View and process customer orders" },
      blog: { title: "Blog", subtitle: "Create and manage blog content" },
      affiliate: {
        title: "Affiliate Marketing",
        subtitle: "Manage affiliates and track commissions",
      },
      settings: { title: "Settings", subtitle: "Configure system preferences" },
    };
    return titles[activeView];
  };

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] overflow-x-scroll">
      <AdminSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Desktop */}
      <div
        className={`
          hidden md:flex flex-col flex-1 transition-all duration-300 ease-in-out 
          ${collapsed ? "ml-16" : "ml-64"}
        `}
      >
        <AdminHeader
          title={getViewTitle().title}
          subtitle={getViewTitle().subtitle}
        />
        <main className="flex-1 overflow-auto p-6">{renderView()}</main>
      </div>

      {/* Mobile */}
      <div className="block md:hidden w-full">
        <AdminHeader
          title={getViewTitle().title}
          subtitle={getViewTitle().subtitle}
        />
        <main className="p-6">{renderView()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
