"use client";

import { useState } from "react";
import { Search, Bell, User } from "lucide-react";
import { UserHeader } from "@/components/UserHeader";
import { useAuth } from "@/context/NewAuthContext";

export function EditorHeader({ title, subtitle }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : "Editor";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-row justify-between md:justify-end gap-4">
       
        {/* Controls */}
        <div className="flex items-center justify-end md:justify-start gap-3 md:gap-5 w-full md:w-auto">
        {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition">
            <Bell className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[hsl(var(--accent))] cursor-pointer transition">
            <span className="text-sm font-medium hidden sm:inline">{userDisplayName}</span>
            <UserHeader slug={"Home"} href={"/"} />
          </div>
        </div>
      </div>
       {/* Title Section */}
       <div className="flex flex-col pl-12 md:pl-0">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-[hsl(var(--foreground))]">
            {title}
          </h1>
          <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">
            {subtitle}
          </p>
        </div>
    </header>
  );
}
