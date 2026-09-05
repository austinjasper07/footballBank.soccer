"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { useAuth } from "@/context/NewAuthContext";
import { createResumeRequest } from "@/actions/resumeRequestActions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ResumeRequestForm({ playerId, lang, requestType = "PROFILE" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      router.push(`/${lang}/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setIsSubmitting(true);
      await createResumeRequest(playerId, lang, reason, requestType);
      setRequested(true);
      toast({ title: "Request received", description: "We have received your resume request and will respond by email." });
    } catch (error) {
      toast({ title: "Request not submitted", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (requested) {
    return <div className="border border-primary-action/30 bg-primary-action/5 p-6"><p className="font-heading text-2xl font-semibold">Request received.</p><p className="mt-2 text-sm leading-6 text-primary-muted">Our team has received your request and will respond to your registered email address.</p></div>;
  }

  const isCvRequest = requestType === "CV";
  return <form onSubmit={handleSubmit} className="border border-divider bg-primary-card p-6 sm:p-8"><div className="flex items-start gap-4"><LockKeyhole className="mt-1 size-5 shrink-0 text-primary-action" aria-hidden="true" /><div><h2 className="font-heading text-2xl font-semibold">{isCvRequest ? "Request professional resume" : "Request player information"}</h2><p className="mt-2 text-sm leading-6 text-primary-muted">{isCvRequest ? "Tell us why you need the player's professional resume. If approved, it will be sent to your registered email." : "Full player information is shared only with registered users after FootballBank approval."}</p></div></div><label className="mt-6 block text-sm font-semibold" htmlFor="request-reason">Reason for request<textarea id="request-reason" required minLength={10} maxLength={2000} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-md border border-divider bg-primary-surface p-3 text-sm outline-none focus:border-primary-action focus:ring-2 focus:ring-primary-action/20" placeholder="Please explain how you intend to use this information." /></label><Button type="submit" variant="action" size="lg" className="mt-6" disabled={loading || isSubmitting}>{loading ? "Checking account..." : isSubmitting ? "Sending request..." : isAuthenticated ? "Submit request" : "Sign in to request"}<ArrowUpRight /></Button></form>;
}
