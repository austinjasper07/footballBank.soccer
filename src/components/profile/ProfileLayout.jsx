import React, { useState } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Crown,
  LogOut,
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <div className="bg-primary-card border-b border-divider">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {showNavigation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSidebar}
                      className="flex-shrink-0"
                    >
                      <Menu className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold text-primary-text truncate">
                      {title || "Profile"}
                    </h1>
                    {subtitle && (
                      <p className="text-sm text-primary-muted truncate">{subtitle}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Mobile badges and actions */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-accent-red/10 text-accent-red border-accent-red/20 text-xs"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    {userRole?.toUpperCase()}
                  </Badge>
                  {user?.email && (
                    <Badge variant="outline" className="text-primary-muted text-xs truncate max-w-[200px]">
                      {user.email}
                    </Badge>
                  )}
                </div>
                
                {/* Mobile action buttons */}
                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action, index) => (
                      <Button
                        key={`action-${index}-${action.label || action.href || 'button'}`}
                        variant={action.variant || "outline"}
                        size="sm"
                        onClick={action.onClick}
                        asChild={action.href ? true : false}
                        className={`${action.className} text-xs`}
                      >
                        {action.href ? (
                          <Link href={action.href}>
                            {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                            <span className="hidden xs:inline">{action.label}</span>
                            <span className="xs:hidden">{action.label?.split(' ')[0]}</span>
                          </Link>
                        ) : (
                          <>
                            {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                            <span className="hidden xs:inline">{action.label}</span>
                            <span className="xs:hidden">{action.label?.split(' ')[0]}</span>
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary-text leading-tight">
                      {title || "Profile"}
                    </h1>
                    {subtitle && (
                      <p className="text-base lg:text-lg text-primary-muted mt-1 truncate max-w-md">
                        {subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant="outline"
                        className="bg-accent-red/10 text-accent-red border-accent-red/20 text-sm"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        {userRole?.toUpperCase()}
                      </Badge>
                      {user?.email && (
                        <Badge variant="outline" className="text-primary-muted text-sm">
                          {user.email}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Desktop action buttons */}
                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                  {actions.map((action, index) => (
                    <Button
                      key={`action-${index}-${action.label || action.href || 'button'}`}
                      variant={action.variant || "outline"}
                      size={action.size || "default"}
                      onClick={action.onClick}
                      asChild={action.href ? true : false}
                      className={`${action.className} hidden sm:flex`}
                    >
                      {action.href ? (
                        <Link href={action.href}>
                          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                          <span className="hidden lg:inline">{action.label}</span>
                          <span className="lg:hidden">{action.label?.split(' ')[0]}</span>
                        </Link>
                      ) : (
                        <>
                          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                          <span className="hidden lg:inline">{action.label}</span>
                          <span className="lg:hidden">{action.label?.split(' ')[0]}</span>
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
                    <span className="hidden lg:inline">Logout</span>
                    <span className="lg:hidden">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="relative">
          {/* Mobile Sidebar Overlay */}
          {showNavigation && (
            <>
              {/* Overlay */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
                  onClick={toggleSidebar}
                />
              )}
              
              {/* Mobile Sidebar */}
              <div className={`fixed top-0 left-0 h-screen w-64 bg-primary-card border-r border-divider transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}>
                <div className="flex items-center justify-between p-4 border-b border-divider">
                  <h2 className="text-lg font-semibold text-primary-text">Navigation</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSidebar}
                    className="text-primary-muted hover:text-primary-text"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <ProfileNavigation userRole={userRole} onItemClick={toggleSidebar} />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Desktop Navigation Sidebar */}
            {showNavigation && (
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-primary-card border border-divider rounded-xl p-4">
                  <ProfileNavigation userRole={userRole} />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={`${showNavigation ? "lg:col-span-3" : "lg:col-span-4"}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
