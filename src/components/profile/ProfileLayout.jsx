import React from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Crown,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import ProfileNavigation from "./ProfileNavigation";

export default function ProfileLayout({ 
  children, 
  title, 
  subtitle, 
  userRole = "user",
  showNavigation = true,
  actions = []
}) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <div className="bg-primary-card border-b border-divider">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-text">
                  {title || "Profile"}
                </h1>
                {subtitle && (
                  <p className="text-primary-muted">{subtitle}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-accent-red/10 text-accent-red border-accent-red/20"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    {userRole?.toUpperCase()}
                  </Badge>
                  {user?.email && (
                    <Badge variant="outline" className="text-primary-muted">
                      {user.email}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {actions.map((action, index) => (
                <Button
                  key={`action-${index}-${action.label || action.href || 'button'}`}
                  variant={action.variant || "outline"}
                  size={action.size || "default"}
                  onClick={action.onClick}
                  asChild={action.href ? true : false}
                  className={action.className}
                >
                  {action.href ? (
                    <Link href={action.href}>
                      {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                      {action.label}
                    </Link>
                  ) : (
                    <>
                      {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                      {action.label}
                    </>
                  )}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          {showNavigation && (
            <div className="lg:col-span-1">
              <ProfileNavigation userRole={userRole} />
            </div>
          )}

          {/* Main Content */}
          <div className={showNavigation ? "lg:col-span-3" : "lg:col-span-4"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
