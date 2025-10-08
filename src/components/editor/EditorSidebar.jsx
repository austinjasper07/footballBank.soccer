"use client";

import { useState } from "react";
import { 
  BarChart3,
  FileText, 
  Edit,
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";

export function EditorSidebar({ activeView, onViewChange, collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', href: '/editor' },
    { id: 'posts', icon: FileText, label: 'Posts', href: '/editor' },
    { id: 'editor', icon: Edit, label: 'Editor', href: '/editor' },
  ];

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`
          hidden md:flex flex-col bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] 
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Editor Dashboard
            </h2>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-[hsl(var(--accent))] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => onViewChange(item.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" 
                        : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[hsl(var(--border))]">
          {!collapsed && (
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Editor Dashboard v1.0
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobile} />
        <div className="fixed left-0 top-0 h-full w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))]">
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Editor Dashboard
            </h2>
            <button onClick={toggleMobile} className="p-1 rounded-md hover:bg-[hsl(var(--accent))]">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        onViewChange(item.id);
                        toggleMobile();
                      }}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive 
                          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" 
                          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
        <button onClick={toggleMobile} className="p-2 rounded-md hover:bg-[hsl(var(--accent))]">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Editor Dashboard
        </h1>
        <div className="w-9" />
      </div>
    </>
  );
}
