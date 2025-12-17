"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/NewAuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubscribeButton({ plan, duration, label }) {
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMountedRef = useRef(true);

  const redirect = searchParams.get("redirect"); // 🧭 capture redirect param (e.g. /player-submission)
  

  // ✅ Check current subscription
  useEffect(() => {
    if (isAuthenticated && user) {
      checkCurrentSubscription();
    }
  }, [isAuthenticated, user]);

  

  const checkCurrentSubscription = async () => {
    setCheckingSubscription(true);
    try {
      const res = await fetch("/api/subscriptions/check");
      if (res.ok) {
        const data = await res.json();
        setCurrentSubscription(data.subscription);
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    
    if (!isAuthenticated) {
      const lang = window.location.pathname.split("/")[1] || "en";
      router.push(`/${lang}/auth/login?redirect=/${lang}/pricing${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`);
      return;
    }

    if (currentSubscription?.isActive) {
      const currentPlan = currentSubscription.plan || currentSubscription.planName;
      if (currentPlan === plan) {
        alert(`You already have an active ${plan} subscription.`);
        setLoading(false);
        return;
      }
    }

    try {
      const durationMap = { monthly: "1m", quarterly: "3m" };
      const mappedDuration = durationMap[duration] || duration;

      // 🧾 Send redirect to backend
      const res = await fetch("/api/stripe/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, duration: mappedDuration, redirect }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const getButtonState = () => {
    if (checkingSubscription) return { disabled: true, text: "Checking..." };
    if (currentSubscription?.isActive) {
      const currentPlan = currentSubscription.plan || currentSubscription.planName;
      if (currentPlan === plan) return { disabled: true, text: "Current Plan" };
      return { disabled: false, text: `Switch to ${plan}` };
    }
    return { disabled: false, text: label };
  };

  const buttonState = getButtonState();

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || buttonState.disabled}
      className="px-4 py-2 transition"
    >
      {loading ? "Processing..." : buttonState.text}
    </Button>
  );
}
