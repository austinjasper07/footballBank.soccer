import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  UserCheck,
  ShoppingBag,
  Crown,
  Settings,
  Home,
  Trophy,
  BarChart3,
  Award,
  Camera,
  MessageCircle,
} from "lucide-react";

export default function ProfileNavigation({ userRole = "user" }) {
  const pathname = usePathname();

  const userNavItems = [
    {
      href: "/profile",
      label: "Overview",
      icon: Home,
      description: "Account overview and quick stats",
    },
    {
      href: "/profile/orders",
      label: "Orders",
      icon: ShoppingBag,
      description: "Order history and management",
    },
    {
      href: "/profile/subscriptions",
      label: "Subscriptions",
      icon: Crown,
      description: "Manage your subscriptions",
    },
    {
      href: "/profile/settings",
      label: "Settings",
      icon: Settings,
      description: "Account and privacy settings",
    },
  ];

  const playerNavItems = [
    {
      href: "/player-profile",
      label: "Overview",
      icon: User,
      description: "Player profile overview",
    },
    {
      href: "/player-profile/stats",
      label: "Statistics",
      icon: BarChart3,
      description: "Performance statistics",
    },
    {
      href: "/player-profile/career",
      label: "Career",
      icon: Trophy,
      description: "Career history and achievements",
    },
    {
      href: "/player-profile/media",
      label: "Media",
      icon: Camera,
      description: "Photos, videos, and documents",
    },
    {
      href: "/player-profile/contact",
      label: "Contact",
      icon: MessageCircle,
      description: "Contact information and inquiries",
    },
  ];

  const navItems = userRole === "player" ? playerNavItems : userNavItems;

  return (
    <nav className="bg-primary-card border border-divider rounded-xl p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-accent-red text-white"
                  : "text-primary-muted hover:bg-primary-bg hover:text-primary-text"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75 truncate">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
