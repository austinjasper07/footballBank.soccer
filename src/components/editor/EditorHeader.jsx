"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { UserHeader } from "@/components/UserHeader";
import { useAuth } from "@/context/NewAuthContext";

export function EditorHeader({ title, subtitle }) {
  const { user } = useAuth();

  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : "Editor";

  return (
    <header className="border-b border-divider bg-primary-card/90 px-4 py-4 backdrop-blur md:px-8 md:py-5">
      <div className="flex items-center justify-between gap-5">
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-action">FootballBank workspace</p><h1 className="mt-1 truncate font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="hidden text-sm text-primary-muted sm:block">{subtitle}</p></div>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
        {/* Notifications */}
          <button className="relative inline-flex size-10 items-center justify-center rounded-full border border-divider text-primary-muted transition hover:border-primary-action hover:text-primary-action" aria-label="Notifications">
            <Bell className="size-4" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 rounded-full border border-divider py-1 pl-3 pr-1">
            <span className="hidden text-sm font-medium sm:inline">{userDisplayName}</span>
            <UserHeader slug={"Home"} href={"/"} />
          </div>
        </div>
      </div>
    </header>
  );
}
