"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  User,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  Users,
  ExternalLink,
  MapPin,
  Home,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { sendSignupOTP, verifySignupOTP } from "@/actions/authActions";
import {
  countryList,
  countryListAllIsoData,
} from "@/lib/variousCountryListFormats";

import "aos/dist/aos.css";

function SignupPageContent() {
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [signupMethod, setSignupMethod] = useState("otp"); // "otp" or "password"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      countryCode: "",
    },
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      countryCode: "",
      isSameAsBilling: true,
    },
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/profile");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get redirect URL from query parameters
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  // Helper function to copy address to shipping address
  const copyAddressToShipping = () => {
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.address,
        isSameAsBilling: true,
      },
    });
  };

  // Auto-copy address to shipping when address changes and checkbox is checked
  useEffect(() => {
    if (sameAsBilling) {
      copyAddressToShipping();
    }
  }, [formData.address, sameAsBilling]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Basic validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Password validation for password signup method
    if (signupMethod === "password") {
      if (!formData.password.trim()) {
        setError("Please enter a password");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
    }

    // Address validation
    const { address } = formData;
    if (
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.postalCode.trim() ||
      !address.country.trim()
    ) {
      setError("Please fill in all address fields");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the Terms of Service to continue");
      setLoading(false);
      return;
    }

    try {
      const result = await sendSignupOTP(
        formData.email,
        formData.firstName,
        formData.lastName
      );

      if (result.success) {
        setMessage(result.message);
        setStep("otp");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await verifySignupOTP(
        formData.email,
        otp,
        formData.firstName,
        formData.lastName,
        formData.address,
        formData.shippingAddress,
        signupMethod === "password" ? formData.password : ""
      );

      if (result.success) {
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          let dashboardUrl = redirectUrl;

          if (!dashboardUrl) {
            dashboardUrl = "/profile";
          }

          window.location.href = dashboardUrl;
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await sendSignupOTP(
        formData.email,
        formData.firstName,
        formData.lastName
      );

      if (result.success) {
        setMessage("New code sent to your email");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:px-12 lg:py-12">
      <div className="hidden min-h-screen flex-col justify-between bg-primary-navy p-10 text-primary-text-inverse lg:flex">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-accent">FootballBank International</p><h2 className="mt-8 max-w-sm font-heading text-5xl font-semibold leading-[1.02]">Build your place in the football network.</h2><p className="mt-6 max-w-sm text-sm leading-7 text-primary-text-inverse/70">Create a verified account to access player opportunities, submit profiles, and communicate with FootballBank.</p></div>
        <p className="text-sm text-primary-text-inverse/50">Secure email verification · International football access</p>
      </div>
      <div className="mx-auto w-full max-w-2xl lg:py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-muted hover:text-primary-text transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center bg-primary-navy">
            <Users className="size-7 text-primary-accent" />
          </div>
          <h1 className="text-3xl font-bold text-primary-text mb-2">
            Join FootballBank.soccer
          </h1>
          <p className="text-primary-muted">
            {step === "form"
              ? "Create your account to get started"
              : "Verify your email to complete registration"}
          </p>
        </div>

        <Card className="border border-divider bg-primary-card shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {step === "form" ? "Create Account" : "Verify Email"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Messages */}
            {message && (
              <Alert className="border-primary-action/30 bg-primary-action/5">
                <CheckCircle className="w-4 h-4 text-primary-action" />
                <AlertDescription className="text-primary-text">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-accent-red/30 bg-accent-red/5">
                <AlertCircle className="w-4 h-4 text-accent-red" />
                <AlertDescription className="text-primary-text">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Form Step */}
            {step === "form" && (
              <div className="space-y-4">
                {/* Signup Method Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Choose Signup Method
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setSignupMethod("otp")}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        signupMethod === "otp"
                          ? "border-primary-action bg-primary-action/10 text-primary-action"
                          : "border-divider hover:border-primary-action"
                      }`}
                    >
                      <div className="text-center">
                        <Mail className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">Email Code</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupMethod("password")}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        signupMethod === "password"
                          ? "border-primary-action bg-primary-action/10 text-primary-action"
                          : "border-divider hover:border-primary-action"
                      }`}
                    >
                      <div className="text-center">
                        <Lock className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">Password</div>
                      </div>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Fields - Only show for password signup method */}
                  {signupMethod === "password" && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-muted hover:text-primary-text"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-muted hover:text-primary-text"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Address Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="size-5 text-primary-action" />
                      <h3 className="text-lg font-semibold text-primary-text">
                        Address
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-sm font-medium">
                        Street Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                        <Input
                          id="street"
                          type="text"
                          placeholder="123 Main Street"
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                street: e.target.value,
                              },
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="New York"
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                city: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State
                        </Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="NY"
                          value={formData.address.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                state: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="postalCode"
                          className="text-sm font-medium"
                        >
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          type="text"
                          placeholder="10001"
                          value={formData.address.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                postalCode: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="country"
                          className="text-sm font-medium"
                        >
                          Country
                        </Label>
                        <Select
                          value={formData.address.country}
                          onValueChange={(value) => {
                            const countryData = countryListAllIsoData.find(
                              (c) => c.name === value
                            );
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                country: value,
                                countryCode: countryData?.code3 || "",
                              },
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryListAllIsoData.map((country) => (
                              <SelectItem
                                key={country.code3}
                                value={country.name}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={setAcceptTerms}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms-of-service"
                          className="text-primary-action hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-primary-action hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-action hover:bg-primary-action-hover"
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Create Account
                  </Button>
                </form>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-muted" />
                    <Input
                      id="otp"
                      type="text"
                      autoFocus
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 text-center text-2xl tracking-[0.45em]"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                    className="w-full bg-primary-action hover:bg-primary-action-hover"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Verify & Create Account
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-primary-action hover:text-primary-action-hover disabled:opacity-50"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </form>
            )}

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-divider">
              <p className="text-sm text-primary-muted">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary-action hover:text-primary-action-hover"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-primary-bg px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center bg-primary-navy">
                <Users className="size-7 text-primary-accent" />
              </div>
              <h1 className="text-3xl font-bold text-primary-text mb-2">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
