"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const isLoading = authContext?.isLoading || true;
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isSuccess = searchParams.get("success");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (isSuccess && sessionId) {
      verifyPayment();
    } else {
      setChecking(false);
      setError("No payment session found");
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
          <p className="text-primary-muted mb-6">Please log in to view your payment status.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

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
