"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cookie, Settings, Shield, BarChart3, Zap } from "lucide-react";
import { 
  getCookiePreferences, 
  setCookieConsent, 
  defaultPreferences,
  initializeAnalytics,
  initializeFunctionalCookies
} from "@/lib/cookies";

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    description: "Required for basic site functionality and security. These cannot be disabled.",
    icon: Shield,
    required: true,
    examples: ["Authentication", "Security", "Site functionality"]
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website to improve user experience.",
    icon: BarChart3,
    required: false,
    examples: ["Google Analytics", "Page views", "User behavior"]
  },
  {
    id: "functional",
    name: "Functional Cookies",
    description: "Remember your preferences and provide enhanced, personalized features.",
    icon: Zap,
    required: false,
    examples: ["Language preferences", "Theme settings", "Form data"]
  },
];

export default function CookieSettings({ trigger }) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedPreferences = getCookiePreferences();
    setPreferences(savedPreferences);
  }, []);

  const handleToggle = (categoryId, enabled) => {
    if (categoryId === "essential") return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [categoryId]: enabled
    }));
  };

  const savePreferences = () => {
    setCookieConsent("customized", preferences);
    setIsOpen(false);
    
    // Initialize services based on preferences
    initializeAnalytics();
    initializeFunctionalCookies();
  };

  const acceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allEnabled);
    setCookieConsent("accepted", allEnabled);
    setIsOpen(false);
    
    // Initialize all services
    initializeAnalytics();
    initializeFunctionalCookies();
  };

  const rejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
    };
    setPreferences(essentialOnly);
    setCookieConsent("declined", essentialOnly);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Cookie Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-accent-red" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Customize your cookie preferences. You can change these settings at any time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-accent-red" />
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                    <Switch
                      checked={preferences[category.id]}
                      onCheckedChange={(checked) => handleToggle(category.id, checked)}
                      disabled={category.required}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-2">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((example, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                  {category.required && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Required for website functionality
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={rejectAll}
            className="flex-1"
          >
            Reject All
          </Button>
          <Button
            variant="outline"
            onClick={savePreferences}
            className="flex-1"
          >
            Save Preferences
          </Button>
          <Button
            onClick={acceptAll}
            className="flex-1 bg-accent-red hover:bg-red-700"
          >
            Accept All
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Learn more in our{" "}
          <a href="/privacy-policy" className="text-accent-red hover:underline">
            Privacy Policy
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
