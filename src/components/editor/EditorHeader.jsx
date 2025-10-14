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
    <header className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {title}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {subtitle}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
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
    </header>
  );
}
