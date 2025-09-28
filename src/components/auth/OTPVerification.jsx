"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  ArrowLeft,
} from "lucide-react";

export default function OTPVerification({
  email,
  type = "login", // "login", "signup", "reset", "verification"
  onVerify,
  onResend,
  onBack,
  loading = false,
  error = "",
  message = "",
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  const titles = {
    login: "Login Verification",
    signup: "Email Verification",
    reset: "Password Reset",
    verification: "Email Verification"
  };

  const descriptions = {
    login: "Enter the 6-digit code sent to your email to complete login",
    signup: "Enter the 6-digit code sent to your email to verify your account",
    reset: "Enter the 6-digit code sent to your email to reset your password",
    verification: "Enter the 6-digit code sent to your email to verify your email address"
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedDigits = text.replace(/\D/g, "").slice(0, 6);
        if (pastedDigits.length === 6) {
          const newOtp = pastedDigits.split("");
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
          handleSubmit(pastedDigits);
        }
      });
    }
  };

  const handleSubmit = (otpCode) => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setTimeLeft(600); // Reset timer
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend failed:", error);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-accent-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary-text">
          {titles[type]}
        </CardTitle>
        <p className="text-primary-muted mt-2">
          {descriptions[type]}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Messages */}
        {message && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Email Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-primary-muted">
            <Mail className="w-4 h-4" />
            <span className="text-sm">Code sent to</span>
          </div>
          <p className="font-medium text-primary-text">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold border-2 focus:border-accent-red focus:ring-accent-red/20"
                disabled={loading}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-primary-muted">
                <Clock className="w-4 h-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="text-sm text-red-600">
                Code expired. Please request a new one.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => handleSubmit(otp.join(""))}
            className="w-full bg-accent-red hover:bg-red-700"
            disabled={loading || otp.join("").length !== 6 || timeLeft === 0}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {loading ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="flex gap-2">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending || timeLeft > 0}
              className="flex-1"
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-primary-muted">
            For security, this code will expire in 10 minutes and can only be used once.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
