"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Loader2, ArrowRight, CreditCard, MapPin, User, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const isLoading = authContext?.isLoading || true;
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [checking, setChecking] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [billingForm, setBillingForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    countryCode: "",
    phone: ""
  });

  const isSuccess = searchParams.get("success");
  const sessionId = searchParams.get("session_id");
  const planId = searchParams.get("plan");

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setBillingForm(prev => ({
        ...prev,
        street: user.billingAddress?.street || "",
        city: user.billingAddress?.city || "",
        state: user.billingAddress?.state || "",
        postalCode: user.billingAddress?.postalCode || "",
        country: user.billingAddress?.country || "",
        countryCode: user.billingAddress?.countryCode || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess && sessionId) {
      verifyPayment();
    } else if (!isSuccess && !sessionId) {
      // If no success/session params, this is a new checkout
      setChecking(false);
    }
  }, [isSuccess, sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError("Failed to verify payment");
    } finally {
      setChecking(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBillingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = async () => {
    if (!planId) {
      setError("No plan selected");
      return;
    }

    setProcessing(true);
    try {
      // Save billing address to user profile
      const saveResponse = await fetch("/api/profile/update-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingAddress: billingForm }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save billing address");
      }

      // Create Stripe checkout session with user data
      const checkoutResponse = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email,
          billingAddress: billingForm
        }),
      });

      const { url } = await checkoutResponse.json();
      
      if (url) {
        window.location.href = url;
      } else {
        setError("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError("Failed to process checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-red mx-auto mb-4" />
          <p className="text-primary-muted">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-2">Authentication Required</h2>
          <p className="text-primary-muted mb-6">Please log in to proceed with checkout.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Payment success/failure page
  if (isSuccess !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="bg-white border border-divider shadow-xl">
            <CardContent className="p-8 text-center">
              {success ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary-text mb-4">
                    Payment Successful!
                  </CardTitle>
                  <p className="text-primary-muted mb-6">
                    Your subscription has been activated. You can now submit player profiles with your new plan.
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-accent-red hover:bg-red-700">
                      <Link href="/submit-profile">
                        Submit Player Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/profile">
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary-text mb-4">
                    Payment Failed
                  </CardTitle>
                  <p className="text-primary-muted mb-6">
                    {error || "There was an issue processing your payment. Please try again."}
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-accent-red hover:bg-red-700">
                      <Link href="/subscriptions">
                        Try Again
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/contact">
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div className="space-y-6">
            <Card className="bg-white border border-divider shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-accent-red" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={user?.firstName || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={user?.lastName || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={billingForm.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-divider shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-red" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={billingForm.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={billingForm.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={billingForm.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State/Province"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={billingForm.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      placeholder="Postal Code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={billingForm.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="ES">Spain</SelectItem>
                        <SelectItem value="IT">Italy</SelectItem>
                        <SelectItem value="BR">Brazil</SelectItem>
                        <SelectItem value="AR">Argentina</SelectItem>
                        <SelectItem value="MX">Mexico</SelectItem>
                        <SelectItem value="NG">Nigeria</SelectItem>
                        <SelectItem value="ZA">South Africa</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="JP">Japan</SelectItem>
                        <SelectItem value="CN">China</SelectItem>
                        <SelectItem value="IN">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white border border-divider shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent-red" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-muted">Plan:</span>
                    <span className="font-semibold capitalize">{planId} Plan</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-primary-muted">Billing:</span>
                    <span className="font-semibold">Monthly</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-accent-red">
                        ${planId === "basic" ? "29" : planId === "premium" ? "79" : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                disabled={processing || !billingForm.street || !billingForm.city || !billingForm.state || !billingForm.postalCode || !billingForm.country}
                className="w-full bg-accent-red hover:bg-red-700 text-white"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Back to Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
