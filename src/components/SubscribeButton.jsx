"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/NewAuthContext";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ plan, duration, label }) {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const isMountedRef = useRef(true);

  const handleCheckout = async () => {
    
    setLoading(true);
    
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/pricing");
      return;
    }
    
    if (plan === "free") {
      // Handle free plan activation
      try {
        const res = await fetch("/api/subscriptions/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration: mappedDuration }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            router.push("/profile");
          } else {
            throw new Error(data.error || "Failed to activate free plan");
          }
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to activate free plan");
        }
      } catch (err) {
        console.error("Free plan activation error:", err);
        alert(err.message || "Failed to activate free plan. Please try again.");
      }
      return;
    }

    try {
      // Map duration to expected format
      const durationMap = {
        monthly: "1m",
        quarterly: "3m"
      };
      const mappedDuration = durationMap[duration] || duration;

      const res = await fetch("/api/stripe/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, duration: mappedDuration }),
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
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="px-4 py-2 transition"
    >
      {loading ? "Processing..." : label}
    </Button>
  );
}


// Usage:
// import SubscribeButton from "@/components/SubscribeButton";

// export default function SubscriptionPage() {
//   return (
//     <div className="flex flex-col gap-4">
//       <h2 className="text-2xl font-semibold mb-4">Choose Your Subscription</h2>

//       <SubscribeButton plan="basic" duration="1m" label="Basic Plan (1 Month)" />
//       <SubscribeButton plan="basic" duration="3m" label="Basic Plan (3 Months)" />
//       <SubscribeButton plan="premium" duration="1m" label="Premium Plan (1 Month)" />
//       <SubscribeButton plan="premium" duration="3m" label="Premium Plan (3 Months)" />
//     </div>
//   );
// }


