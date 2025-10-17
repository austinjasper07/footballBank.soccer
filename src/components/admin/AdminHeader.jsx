'use client';

import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "@/context/NewAuthContext";
import { UserHeader } from "../UserHeader";



export function AdminHeader({ title, subtitle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Handle unauthenticated state
    return null;
  }
 
  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : "Editor";
  // const unreadCount = messages.filter(msg => !msg.read).length;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Add filtering/search behavior
  };

  return (
    <header className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-row justify-between md:justify-end gap-4">
        
        {/* Title & Subtitle */}
       

        {/* Controls */}
        <div className="flex items-center justify-end md:justify-start gap-3 md:gap-5 w-full md:w-auto">
       {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition">
            <Bell className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            {/* {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )} */}
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[hsl(var(--accent))] cursor-pointer transition">
            <span className="text-sm font-medium hidden sm:inline">{userDisplayName}</span>
            <UserHeader slug={"Home"} href={"/"} />
          </div>
        </div>
      </div>
      <div className="flex flex-col pl-12 md:pl-0">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">{title}</h1>
          <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))]">
            {subtitle}
          </p>
        </div>
    </header>
  );
}
