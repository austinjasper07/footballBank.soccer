"use client";

import { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Check, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/SubscribeButton";
import { useAuth } from "@/context/NewAuthContext";

export default function PricingClient({ lang, dict }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscription, setSubscription] = useState(null);
  const [checking, setChecking] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // ✅ Fetch active subscription on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setChecking(true);
        const res = await fetch("/api/subscriptions/check");
        const data = await res.json();
        if (res.ok && data.subscription) {
          setSubscription(data.subscription);
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setChecking(false);
      }
    };

    if (isAuthenticated) fetchSubscription();
  }, [isAuthenticated]);

  const PLANS = [
    {
      id: "free",
      name: dict.pricing.plans.free.name,
      price: { monthly: 0, quarterly: 0 },
      description: dict.pricing.plans.free.description,
      features: dict.pricing.plans.free.features,
      cta: dict.pricing.plans.free.cta,
    },
    {
      id: "basic",
      name: dict.pricing.plans.basic.name,
      price: { monthly: 3, quarterly: 8 },
      description: dict.pricing.plans.basic.description,
      features: dict.pricing.plans.basic.features,
      cta: dict.pricing.plans.basic.cta,
    },
    {
      id: "premium",
      name: dict.pricing.plans.premium.name,
      price: { monthly: 5, quarterly: 13 },
      description: dict.pricing.plans.premium.description,
      features: dict.pricing.plans.premium.features,
      cta: dict.pricing.plans.premium.cta,
    },
  ];

  // ✅ Utility: check expiration for free plan
  const isFreeExpired = (sub) => {
    if (!sub || sub.plan !== "free" || !sub.expiresAt) return false;
    const expiry = new Date(sub.expiresAt);
    return expiry < new Date();
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Header Section */}
      <div className="text-center pt-16 pb-8 bg-gradient-to-b from-red-50 to-white">
        <h1
          className="text-5xl font-extrabold tracking-tight mb-4"
          data-aos="fade-up"
          dangerouslySetInnerHTML={{ __html: dict.pricing.hero.title }}
        />
        <p
          className="text-gray-600 text-lg max-w-2xl mx-auto mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {dict.pricing.hero.subtitle}
        </p>

        {/* Billing Toggle */}
        <div
          className="inline-flex bg-gray-100 rounded-full p-1"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {["monthly", "quarterly"].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billingCycle === cycle
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {cycle === "monthly"
                ? dict.pricing.billing.monthly
                : dict.pricing.billing.quarterly}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pt-8 pb-16">
        {PLANS.map((plan, index) => {
          const isActive = subscription?.plan === plan.id && !isFreeExpired(subscription);
          const isExpired = subscription?.plan === plan.id && isFreeExpired(subscription);
          const isDisabled = isActive || isExpired;

          return (
            <div
              key={plan.id}
              className={`relative border rounded-3xl p-8 flex flex-col justify-between shadow-sm transition duration-300 hover:shadow-xl ${
                plan.id === "premium"
                  ? "border-red-600 shadow-red-100"
                  : "border-gray-200"
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Status Badge */}
              {isActive && (
                <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Active
                </span>
              )}
              {isExpired && (
                <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Expired
                </span>
              )}

              <div>
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-gray-500 mb-6">{plan.description}</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price[billingCycle]}
                  </span>
                  <span className="ml-2 text-gray-500 text-sm">
                    /{billingCycle === "monthly" ? "mo" : "3 mo"}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {isDisabled ? (
                <Button
                  disabled
                  className={`w-full mt-4 ${
                    isActive
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-yellow-100 text-yellow-700 cursor-default"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Active Plan
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-2" /> Expired
                    </>
                  )}
                </Button>
              ) : (
                <Suspense fallback={<Button disabled className="w-full mt-4">Loading...</Button>}>
                  <SubscribeButton
                    plan={plan.id}
                    duration={billingCycle}
                    label={plan.cta}
                  />
                </Suspense>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <footer className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto" data-aos="fade-up">
          <h2
            className="text-3xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: dict.pricing.footer.title }}
          />
          <p className="text-gray-400 mb-8">{dict.pricing.footer.subtitle}</p>
          <Suspense fallback={<Button disabled className="w-full">Loading...</Button>}>
            <SubscribeButton
              plan="basic"
              duration={billingCycle}
              label={dict.pricing.footer.cta}
            />
          </Suspense>
        </div>
      </footer>
    </div>
  );
}
