"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  Lock,
  Key,
} from "lucide-react";
import Link from "next/link";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/profile/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage("Password updated successfully!");
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update password");
      }
    } catch (error) {
      setError("Failed to update password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProfileLayout title="Settings" userRole={user?.role}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red" />
          <p className="ml-2 text-primary-muted">Loading settings...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProfileLayout title="Settings" userRole="user">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">Authentication Required</h2>
          <p className="text-primary-muted mb-6">Please log in to access your settings.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Settings" userRole={user?.role}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary-text">Account Settings</h1>
          <p className="text-primary-muted">Manage your account preferences and security</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Personal Information */}
        <Card className="bg-primary-card border border-divider">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-accent-red" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-primary-muted mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-primary-card border border-divider">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-red" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-primary-muted" />
                    ) : (
                      <Eye className="w-4 h-4 text-primary-muted" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-primary-muted" />
                    ) : (
                      <Eye className="w-4 h-4 text-primary-muted" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Key className="w-4 h-4 mr-2" />
                )}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-primary-card border border-divider">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent-red" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-text">Email Notifications</div>
                <div className="text-sm text-primary-muted">
                  Receive updates about your orders and account
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={() => handleNotificationChange('email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-text">SMS Notifications</div>
                <div className="text-sm text-primary-muted">
                  Get text messages for important updates
                </div>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={() => handleNotificationChange('sms')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-text">Push Notifications</div>
                <div className="text-sm text-primary-muted">
                  Receive browser notifications
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={() => handleNotificationChange('push')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-text">Marketing Emails</div>
                <div className="text-sm text-primary-muted">
                  Receive promotional content and offers
                </div>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={() => handleNotificationChange('marketing')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="bg-primary-card border border-divider">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent-red" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-text">Email Verification</div>
                <div className="text-sm text-primary-muted">
                  Your email address verification status
                </div>
              </div>
              <Badge className={user?.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {user?.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-primary-text">Account Type</div>
                <div className="text-sm text-primary-muted">
                  Your current account role
                </div>
              </div>
              <Badge className="bg-accent-red/10 text-accent-red">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  );
}
