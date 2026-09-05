"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Edit3, LogOut, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";

export default function UserProfilePage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.split("/")[1] || "en";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/${lang}/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isAuthenticated && user) {
      fetch("/api/profile/user", { credentials: "include" })
        .then((response) => {
          if (!response.ok) throw new Error("Profile request failed");
          return response.json();
        })
        .then(setProfile)
        .catch(() => setProfile(user))
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, lang, pathname, router, user]);

  if (authLoading || loading) {
    return <main className="flex min-h-screen items-center justify-center bg-primary-bg px-5"><p className="text-sm text-primary-muted">Loading your profile...</p></main>;
  }

  if (!isAuthenticated) return null;

  const data = profile || user;
  const fullName = `${data?.firstName || ""} ${data?.lastName || ""}`.trim() || "FootballBank member";
  const initials = fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const address = data?.address || {};

  return (
    <main className="min-h-screen bg-primary-bg text-primary-text">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14 lg:px-12">
        <div className="flex flex-col gap-5 border-b border-divider pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Account profile</p>
            <h1 className="mt-5 max-w-2xl font-heading text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">Welcome, {data?.firstName || "there"}.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-muted">Your FootballBank identity, contact details, and account access in one place.</p>
          </div>
          <Button variant="outline" asChild><Link href={`/${lang}/profile/settings`}><Edit3 className="size-4" />Edit profile</Link></Button>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-primary-navy p-7 text-primary-text-inverse sm:p-9">
            <div className="flex size-16 items-center justify-center bg-primary-accent font-heading text-2xl font-semibold text-primary-navy">{initials}</div>
            <h2 className="mt-8 font-heading text-3xl font-semibold leading-tight sm:text-4xl">{fullName}</h2>
            <p className="mt-2 text-sm text-primary-text-inverse/65">{data?.role || "Registered member"}</p>
            <div className="mt-8 border-t border-primary-text-inverse/15 pt-5"><p className="text-xs uppercase tracking-[0.16em] text-primary-accent">Account status</p><div className="mt-3 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-primary-accent" />{data?.isVerified ? "Email verified" : "Verification pending"}</div></div>
          </div>

          <div className="border border-divider bg-primary-card p-6 sm:p-9">
            <div className="flex items-center justify-between gap-4 border-b border-divider pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-action">Personal information</p><h2 className="mt-2 font-heading text-2xl font-semibold">Your details</h2></div><UserRound className="size-6 text-primary-accent" aria-hidden="true" /></div>
            <dl className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">First name</dt><dd className="mt-2 font-medium">{data?.firstName || "Not provided"}</dd></div><div><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">Last name</dt><dd className="mt-2 font-medium">{data?.lastName || "Not provided"}</dd></div><div className="sm:col-span-2"><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">Email address</dt><dd className="mt-2 flex items-center gap-2 break-all font-medium"><Mail className="size-4 shrink-0 text-primary-action" />{data?.email || "Not provided"}</dd></div></dl>
          </div>
        </section>

        <section className="mt-6 border border-divider bg-primary-card p-6 sm:p-9"><div className="flex items-center gap-3 border-b border-divider pb-5"><MapPin className="size-5 text-primary-action" /><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-action">Contact location</p><h2 className="mt-2 font-heading text-2xl font-semibold">Registered address</h2></div></div><div className="mt-6 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-primary-muted">Street</p><p className="mt-1 font-medium">{address.street || "Not provided"}</p></div><div><p className="text-primary-muted">City</p><p className="mt-1 font-medium">{address.city || "Not provided"}</p></div><div><p className="text-primary-muted">State / region</p><p className="mt-1 font-medium">{address.state || "Not provided"}</p></div><div><p className="text-primary-muted">Country</p><p className="mt-1 font-medium">{address.country || "Not provided"}</p></div></div></section>

        <section className="mt-6 flex flex-col gap-5 border-t border-divider pt-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-heading text-2xl font-semibold">Keep your football profile current.</p><p className="mt-2 text-sm text-primary-muted">Update your account details or submit your player profile when you are ready.</p></div><div className="flex flex-wrap gap-3"><Button variant="action" asChild><Link href={`/${lang}/submit-profile`}>Submit player profile<ArrowUpRight className="size-4" /></Link></Button><Button variant="outline" onClick={() => logout(true)}><LogOut className="size-4" />Sign out</Button></div></section>
      </div>
    </main>
  );
}
