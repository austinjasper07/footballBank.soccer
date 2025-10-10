'use client';

import {
  BarChart3,
  Users,
  Inbox,
  Store,
  ShoppingCart,
  FileText,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Crown,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const navigationItems = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'players', icon: Users, label: 'Players' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'subscriptions', icon: Crown, label: 'Subscriptions' },
  { id: 'submissions', icon: Inbox, label: 'Submissions', badge: 0 },
  
  { id: 'shop', icon: Store, label: 'Shop' },
  { id: 'affiliate', icon: Store, label: 'Affiliate' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders' },
  { id: 'blog', icon: FileText, label: 'Blog' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar({ activeView, onViewChange, collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 md:z-10
          bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] 
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
          <div
            className={`flex items-center gap-2 transition-opacity ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <p className="text-muted-foreground text-base font-semibold">Admin Console</p>
          </div>

          {/* Collapse toggle */}
          <button
            className="hidden md:block text-muted-foreground ml-auto"
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;

              return (
                <li key={item.id} >
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-accent-red text-[hsl(var(--primary-foreground))]'
                        : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {item.badge !== undefined && item.badge > 0 && !collapsed && (
                      <span className="ml-auto bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
