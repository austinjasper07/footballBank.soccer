"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/NewAuthContext";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ plan, duration, label }) {
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const isMountedRef = useRef(true);

  // Check current subscription status
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
      router.push("/auth/login?redirect=/pricing");
      return;
    }

    // Check if user already has an active subscription
    if (currentSubscription && currentSubscription.isActive) {
      const currentPlan = currentSubscription.plan || currentSubscription.planName;
      if (currentPlan === plan) {
        alert(`You already have an active ${plan} subscription. You can upgrade or downgrade from your profile.`);
        setLoading(false);
        return;
      }
      
      // If user has a different plan, handle upgrade/downgrade
      if (currentPlan !== plan) {
        try {
          const res = await fetch("/api/subscriptions/change", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan, duration }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              if (data.redirect && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
              } else {
                alert(data.message || "Subscription changed successfully!");
                router.push("/profile");
              }
            } else {
              throw new Error(data.error || "Failed to change subscription");
            }
          } else {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to change subscription");
          }
        } catch (err) {
          console.error("Subscription change error:", err);
          alert(err.message || "Failed to change subscription. Please try again.");
        } finally {
          setLoading(false);
        }
        return;
      }
    }
    
    if (plan === "free") {
      // Handle free plan activation
      try {
        // Map duration to expected format
        const durationMap = {
          monthly: "1m",
          quarterly: "3m"
        };
        const mappedDuration = durationMap[duration] || duration;

        const res = await fetch("/api/subscriptions/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration: mappedDuration }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            alert("Free plan activated successfully!");
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
      } finally {
        setLoading(false);
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

  // Determine button state and text
  const getButtonState = () => {
    if (checkingSubscription) {
      return { disabled: true, text: "Checking..." };
    }
    
    if (currentSubscription && currentSubscription.isActive) {
      const currentPlan = currentSubscription.plan || currentSubscription.planName;
      if (currentPlan === plan) {
        return { disabled: true, text: "Current Plan" };
      } else if (currentPlan === "free" && plan !== "free") {
        return { disabled: false, text: `Upgrade to ${plan}` };
      } else if (plan === "free" && currentPlan !== "free") {
        return { disabled: false, text: "Downgrade to Free" };
      } else {
        return { disabled: false, text: `Switch to ${plan}` };
      }
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


