"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Shield, 
  Lock, 
  Check, 
  ArrowLeft, 
  Loader2,
  Star,
  Crown,
  Zap
} from "lucide-react";
import Link from "next/link";

const planDetails = {
  basic: {
    name: "Basic Plan",
    price: 29,
    period: "per month",
    features: [
      "Submit up to 5 player profiles",
      "Enhanced profile visibility",
      "Priority support",
      "Advanced analytics",
    ],
    color: "bg-blue-500",
    icon: Crown,
  },
  premium: {
    name: "Premium Plan", 
    price: 79,
    period: "per month",
    features: [
      "Unlimited player profiles",
      "Maximum profile visibility",
      "24/7 priority support",
      "Advanced analytics & insights",
      "Custom profile templates",
      "Bulk upload capabilities",
    ],
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Star,
  },
};

export default function SecurePaymentPage() {
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const isLoading = authContext?.isLoading || true;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  });

  const planId = searchParams.get("plan");
  const plan = planDetails[planId];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/secure-payment");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (!plan) {
      console.error("Invalid plan selected");
      return;
    }

    setProcessing(true);
    try {
      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email,
          billingAddress: {
            street: formData.street || "",
            city: formData.city || "",
            state: formData.state || "",
            postalCode: formData.postalCode || "",
            country: formData.country || "",
            countryCode: formData.countryCode || ""
          }
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-red mx-auto mb-4" />
          <p className="text-primary-muted">Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-2">Authentication Required</h2>
          <p className="text-primary-muted mb-6">Please log in to continue with payment.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-2">Invalid Plan</h2>
          <p className="text-primary-muted mb-6">The selected plan is not available.</p>
          <Button asChild>
            <Link href="/subscriptions">Back to Plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = plan.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-primary-card border-b border-divider">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/subscriptions" className="inline-flex items-center gap-2 text-primary-muted hover:text-primary-text transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Plans
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-text mb-4">
              Secure Payment
            </h1>
            <p className="text-primary-muted">
              Complete your subscription with our secure payment system
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card className="bg-white border border-divider">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-primary-text">{plan.name}</div>
                  <div className="text-primary-muted">Subscription Plan</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary-bg rounded-xl">
                <div className="text-4xl font-bold text-primary-text mb-2">
                  ${plan.price}
                </div>
                <div className="text-primary-muted">{plan.period}</div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-primary-text">What's included:</h3>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-primary-text">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-primary-muted">
                <Shield className="w-4 h-4" />
                <span>Secured by Stripe</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-white border border-divider">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent-red" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-sm font-medium text-primary-text mb-3 block">
                  Payment Method
                </Label>
                <div className="flex gap-4">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Credit Card
                  </Button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Secure Payment</h4>
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and processed securely by Stripe. 
                      We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-accent-red hover:bg-red-700 text-white py-3"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${plan.price}/month
                  </>
                )}
              </Button>

              {/* Terms */}
              <p className="text-xs text-primary-muted text-center">
                By proceeding, you agree to our{" "}
                <Link href="/terms-of-service" className="text-accent-red hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-accent-red hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
