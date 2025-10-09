"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Crown, Zap, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const subscriptionPlans = [
  {
    id: "free",
    name: "Free Trial",
    price: 0,
    period: "60 days free",
    description: "Perfect for getting started",
    features: [
      "Submit 1 player profile",
      "Basic profile visibility",
      "Email support",
      "Standard processing time",
    ],
    limitations: [
      "Limited to 1 submission",
      "Basic analytics",
    ],
    popular: false,
    color: "bg-gray-500",
    buttonText: "Start Free Trial",
    buttonVariant: "outline",
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: 29,
    period: "per month",
    description: "For individual agents and scouts",
    features: [
      "Submit up to 5 player profiles",
      "Enhanced profile visibility",
      "Priority support",
      "Advanced analytics",
      "Profile optimization tips",
      "Email notifications",
    ],
    limitations: [],
    popular: true,
    color: "bg-blue-500",
    buttonText: "Choose Basic",
    buttonVariant: "default",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 79,
    period: "per month",
    description: "For professional agencies",
    features: [
      "Unlimited player profiles",
      "Maximum profile visibility",
      "24/7 priority support",
      "Advanced analytics & insights",
      "Custom profile templates",
      "Bulk upload capabilities",
      "API access",
      "White-label options",
    ],
    limitations: [],
    popular: false,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    buttonText: "Choose Premium",
    buttonVariant: "default",
  },
];

export default function SubscriptionsPage() {
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const isLoading = authContext?.isLoading || true;
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/subscriptions");
    }
  }, [isLoading, isAuthenticated, router]);

  // Handle query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const required = urlParams.get("required");
    const limitReached = urlParams.get("limit_reached");
    const error = urlParams.get("error");

    if (required) {
      setMessage("A subscription is required to submit player profiles. Choose a plan below to get started.");
    } else if (limitReached) {
      setMessage("You've reached your submission limit. Upgrade your plan to submit more profiles.");
    } else if (error) {
      setMessage("There was an error checking your subscription. Please choose a plan below.");
    }
  }, []);

  const handlePlanSelection = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (planId) => {
    if (planId === "free") {
      // Handle free trial
      setProcessing(true);
      try {
        const response = await fetch("/api/subscriptions/free-trial", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          router.push("/submit-profile?trial=true");
        } else {
          console.error("Failed to start free trial");
        }
      } catch (error) {
        console.error("Error starting free trial:", error);
      } finally {
        setProcessing(false);
      }
    } else {
      // Redirect to checkout page for paid plans using the existing pattern
      router.push(`/secure-payment/checkout?type=subscription&plan=${planId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-red mx-auto mb-4" />
          <p className="text-primary-muted">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-2">Authentication Required</h2>
          <p className="text-primary-muted mb-6">Please log in to view subscription plans.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-primary-card border-b border-divider">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-primary-muted hover:text-primary-text transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent-red/10 text-accent-red rounded-full px-4 py-2 mb-6">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Player Profile Submissions</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-text mb-6">
              Choose Your <span className="text-accent-red">Subscription Plan</span>
            </h1>
            <p className="text-xl text-primary-muted mb-8 max-w-3xl mx-auto">
              Unlock the power of professional player profile submissions. Start with our free trial or choose a plan that fits your needs.
            </p>
            {message && (
              <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-accent-red font-medium">{message}</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-6 text-sm text-primary-muted">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>60-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Secure payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-accent-red shadow-lg scale-105"
                  : "border-divider hover:border-accent-red/50"
              } ${selectedPlan === plan.id ? "ring-2 ring-accent-red" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent-red text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {plan.id === "free" && <Zap className="w-8 h-8 text-white" />}
                  {plan.id === "basic" && <Crown className="w-8 h-8 text-white" />}
                  {plan.id === "premium" && <Star className="w-8 h-8 text-white" />}
                </div>
                <CardTitle className="text-2xl font-bold text-primary-text mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-text">
                    ${plan.price}
                  </span>
                  <span className="text-primary-muted ml-2">{plan.period}</span>
                </div>
                <p className="text-primary-muted">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-primary-text">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-divider">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-primary-muted">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-6">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processing}
                    variant={plan.buttonVariant}
                    className={`w-full ${
                      plan.popular
                        ? "bg-accent-red hover:bg-red-700 text-white"
                        : plan.id === "free"
                        ? "border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                        : "bg-primary-text hover:bg-primary-text/90 text-white"
                    }`}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary-text mb-2">
                  What's included in the free trial?
                </h3>
                <p className="text-primary-muted">
                  You get 60 days to submit 1 player profile with basic features. No payment required.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-text mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-primary-muted">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary-text mb-2">
                  How does payment work?
                </h3>
                <p className="text-primary-muted">
                  We use Stripe for secure payments. Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-text mb-2">
                  What happens after the free trial?
                </h3>
                <p className="text-primary-muted">
                  You can choose to upgrade to a paid plan or continue with limited features. No automatic charges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-primary-card border border-divider rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-primary-text mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-primary-muted mb-6">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" asChild>
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
              <Button asChild>
                <Link href="/faq">
                  View FAQ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
