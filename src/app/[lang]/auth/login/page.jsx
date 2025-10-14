"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Mail,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function LoginPage({ params }) {
  const [step, setStep] = useState("email"); // "email" or "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/profile");
  const [lang, setLang] = useState("en");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Unwrap params Promise
  const resolvedParams = use(params);

  useEffect(() => {
    // Get language from params
    if (resolvedParams?.lang) {
      setLang(resolvedParams.lang);
    }
  }, [resolvedParams]);

  useEffect(() => {
    // Get redirect URL from query parameters
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            console.log('User already authenticated, redirecting...', { user: data.user, redirectUrl });
            // User is already authenticated, redirect to appropriate dashboard
            const userRole = data.user.role;
            let redirectPath;
            
            // if (userRole === 'admin') {
            //   redirectPath = `/${lang}/admin`;
            // } else if (userRole === 'editor') {
            //   redirectPath = `/${lang}/editor`;
            // } else {
              // Ensure redirect URL has proper language prefix
              redirectPath = redirectUrl.startsWith('/') ? redirectUrl : `/${lang}${redirectUrl}`;
            // }
            
            console.log('Redirecting to:', redirectPath);
            router.replace(redirectPath); // Use replace instead of push to avoid back button issues
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [router, redirectUrl, lang]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is ok and content type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();

      if (data.success) {
        setStep("otp");
        setMessage("OTP sent to your email. Please check your inbox.");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      // Check if response is ok and content type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();

      if (data.success) {
        setMessage("Login successful! Redirecting...");
        
        // Redirect based on user role
        setTimeout(() => {
          let redirectPath;
          
          if (data.user.role === 'admin') {
            redirectPath = `/${lang}/admin`;
          } else if (data.user.role === 'editor') {
            redirectPath = `/${lang}/editor`;
          } else {
            // Ensure redirect URL has proper language prefix
            redirectPath = redirectUrl.startsWith('/') ? redirectUrl : `/${lang}${redirectUrl}`;
          }
          
          console.log('Login successful, redirecting to:', redirectPath);
          router.replace(redirectPath); // Use replace instead of push
        }, 1000);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your FootballBank account
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === "email" ? "Sign In" : "Verify OTP"}
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {step === "email" 
                ? "Enter your email address to receive a verification code"
                : "Enter the 6-digit code sent to your email"
              }
            </p>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {message && (
                  <div className="text-sm text-green-600 text-center">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Code sent to: <span className="font-medium">{email}</span>
                  </p>
                </div>

                {message && (
                  <div className="text-sm text-green-600 text-center">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleBackToEmail}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Email
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}