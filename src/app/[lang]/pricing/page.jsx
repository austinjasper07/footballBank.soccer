"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/SubscribeButton";

const PLANS = [
  {
    id: "free",
    name: "Free Plan",
    price: { monthly: 0, quarterly: 0 },
    description: "Get started with essential tools and one profile submission.",
    features: [
      "1 player profile submission",
      "Basic profile visibility",
      "Email support",
    ],
    cta: "Start for Free",
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: { monthly: 3, quarterly: 8 },
    description: "For scouts and agents ready to scale their work.",
    features: [
      "Submit up to 3 player profiles",
      "Enhanced profile visibility",
      "Priority support",
      "Access to analytics dashboard",
    ],
    cta: "Get Basic",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: { monthly: 5, quarterly: 13 },
    description: "For professionals managing multiple players and agencies.",
    features: [
      "Unlimited player profiles",
      "Maximum visibility boost",
      "24/7 premium support",
      "Advanced analytics and insights",
      "Custom templates and API access",
    ],
    cta: "Go Premium",
  },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Header Section */}
      <div className="text-center pt-16 pb-8 bg-gradient-to-b from-red-50 to-white">
        <h1
          className="text-5xl font-extrabold tracking-tight mb-4"
          data-aos="fade-up"
        >
          Grow with <span className="text-red-600">Fewer Fees</span> & More
          Power
        </h1>
        <p
          className="text-gray-600 text-lg max-w-2xl mx-auto mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Choose a plan that fits your goals. Cancel anytime. No hidden fees.
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
              {cycle === "monthly" ? "Monthly" : "Quarterly (Save 10%)"}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pt-8 pb-16">
        {PLANS.map((plan, index) => (
          <div
            key={plan.id}
            className={`border rounded-3xl p-8 flex flex-col justify-between shadow-sm transition duration-300 hover:shadow-xl ${
              plan.id === "premium"
                ? "border-red-600 shadow-red-100"
                : "border-gray-200"
            }`}
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
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

            <SubscribeButton
              plan={plan.id}
              duration={billingCycle}
              label={plan.cta}
            />
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <footer className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">
            Get started with <span className="text-red-500">Your career</span>{" "}
            today
          </h2>
          <p className="text-gray-400 mb-8">
            Try the Free plan or upgrade anytime. No credit card required to
            begin.
          </p>
          <Button
            onClick={() => handleSubscribe("free")}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg"
          >
            Start for Free
          </Button>
        </div>
      </footer>
    </div>
  );
}
