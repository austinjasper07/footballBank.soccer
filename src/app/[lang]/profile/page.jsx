"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Edit3, LogOut, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { getClientDictionary } from "@/lib/client-dictionaries";

export default function UserProfilePage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [canSubmitProfile, setCanSubmitProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.split("/")[1] || "en";
  const [dict, setDict] = useState(null);
  const t = dict?.accountProfilePage;

  useEffect(() => {
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/${lang}/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Players' profile is the player profile — send them there instead of the default account overview.
    if (!authLoading && isAuthenticated && user?.role === "player") {
      router.replace(`/${lang}/player-profile`);
      return;
    }

    if (isAuthenticated && user) {
      Promise.all([
        fetch("/api/profile/user", { credentials: "include" }).then((response) => {
          if (!response.ok) throw new Error("Profile request failed");
          return response.json();
        }),
        fetch("/api/profile/submission-status", { credentials: "include" }).then((response) => response.ok ? response.json() : { canSubmit: true }),
      ]).then(([data, submissionStatus]) => {
          setCanSubmitProfile(submissionStatus.canSubmit !== false);
          setProfile(data);
        })
        .catch(() => setProfile(user))
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, lang, pathname, router, user]);

  if (authLoading || loading) {
    return <main className="flex min-h-screen items-center justify-center bg-primary-bg px-5"><p className="text-sm text-primary-muted">{t?.loading || "Loading your profile..."}</p></main>;
  }

  if (!isAuthenticated) return null;

  const data = profile || user;
  const fullName = `${data?.firstName || ""} ${data?.lastName || ""}`.trim() || (t?.defaultMemberName || "FootballBank member");
  const initials = fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const address = data?.address || {};

  return (
    <main className="min-h-screen bg-primary-bg text-primary-text">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14 lg:px-12">
        <div className="flex flex-col gap-5 border-b border-divider pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t?.eyebrow || "Account profile"}</p>
            <h1 className="mt-5 max-w-2xl font-heading text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">{t?.welcome || "Welcome"}, {data?.firstName || (t?.defaultName || "there")}.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-muted">{t?.subtitle || "Your FootballBank identity, contact details, and account access in one place."}</p>
          </div>
          <Button variant="outline" asChild><Link href={`/${lang}/profile/settings`}><Edit3 className="size-4" />{t?.editProfile || "Edit profile"}</Link></Button>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-primary-navy p-7 text-primary-text-inverse sm:p-9">
            <div className="flex size-16 items-center justify-center bg-primary-accent font-heading text-2xl font-semibold text-primary-navy">{initials}</div>
            <h2 className="mt-8 font-heading text-3xl font-semibold leading-tight sm:text-4xl">{fullName}</h2>
            <p className="mt-2 text-sm text-primary-text-inverse/65">{data?.role || (t?.registeredMember || "Registered member")}</p>
            <div className="mt-8 border-t border-primary-text-inverse/15 pt-5"><p className="text-xs uppercase tracking-[0.16em] text-primary-accent">{t?.accountStatus || "Account status"}</p><div className="mt-3 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-primary-accent" />{data?.isVerified ? (t?.emailVerified || "Email verified") : (t?.verificationPending || "Verification pending")}</div></div>
          </div>

          <div className="border border-divider bg-primary-card p-6 sm:p-9">
            <div className="flex items-center justify-between gap-4 border-b border-divider pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-action">{t?.personalInformation || "Personal information"}</p><h2 className="mt-2 font-heading text-2xl font-semibold">{t?.yourDetails || "Your details"}</h2></div><UserRound className="size-6 text-primary-accent" aria-hidden="true" /></div>
            <dl className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">{t?.firstName || "First name"}</dt><dd className="mt-2 font-medium">{data?.firstName || (t?.notProvided || "Not provided")}</dd></div><div><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">{t?.lastName || "Last name"}</dt><dd className="mt-2 font-medium">{data?.lastName || (t?.notProvided || "Not provided")}</dd></div><div className="sm:col-span-2"><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">{t?.emailAddress || "Email address"}</dt><dd className="mt-2 flex items-center gap-2 break-all font-medium"><Mail className="size-4 shrink-0 text-primary-action" />{data?.email || (t?.notProvided || "Not provided")}</dd></div><div className="sm:col-span-2"><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">{t?.phoneNumber || "Phone number"}</dt><dd className="mt-2 flex items-center gap-2 font-medium"><Phone className="size-4 shrink-0 text-primary-action" />{data?.phone || (t?.notProvided || "Not provided")}</dd></div></dl>
          </div>
        </section>

        <section className="mt-6 border border-divider bg-primary-card p-6 sm:p-9"><div className="flex items-center gap-3 border-b border-divider pb-5"><MapPin className="size-5 text-primary-action" /><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-action">{t?.contactLocation || "Contact location"}</p><h2 className="mt-2 font-heading text-2xl font-semibold">{t?.registeredAddress || "Registered address"}</h2></div></div><div className="mt-6 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-primary-muted">{t?.street || "Street"}</p><p className="mt-1 font-medium">{address.street || (t?.notProvided || "Not provided")}</p></div><div><p className="text-primary-muted">{t?.city || "City"}</p><p className="mt-1 font-medium">{address.city || (t?.notProvided || "Not provided")}</p></div><div><p className="text-primary-muted">{t?.stateRegion || "State / region"}</p><p className="mt-1 font-medium">{address.state || (t?.notProvided || "Not provided")}</p></div><div><p className="text-primary-muted">{t?.country || "Country"}</p><p className="mt-1 font-medium">{address.country || (t?.notProvided || "Not provided")}</p></div></div></section>

        <section className="mt-6 flex flex-col gap-5 border-t border-divider pt-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-heading text-2xl font-semibold">{t?.keepProfileCurrentTitle || "Keep your football profile current."}</p><p className="mt-2 text-sm text-primary-muted">{t?.keepProfileCurrentSubtitle || "Update your account details or submit your player profile when you are ready."}</p></div><div className="flex flex-wrap gap-3">{canSubmitProfile && <Button variant="action" asChild><Link href={`/${lang}/submit-profile`}>{t?.submitPlayerProfile || "Submit player profile"}<ArrowUpRight className="size-4" /></Link></Button>}<Button variant="outline" onClick={() => logout(true)}><LogOut className="size-4" />{t?.signOut || "Sign out"}</Button></div></section>
      </div>
    </main>
  );
}
