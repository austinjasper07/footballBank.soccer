"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Settings } from "lucide-react";
import CookieSettings from "@/components/CookieSettings";
import { 
  getCookieConsent, 
  setCookieConsent, 
  initializeAnalytics,
  initializeFunctionalCookies
} from "@/lib/cookies";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = getCookieConsent();
    if (!hasConsented) {
      // Show consent banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      functional: true,
    };
    setCookieConsent("accepted", allEnabled);
    setIsVisible(false);
    
    // Initialize all services
    initializeAnalytics();
    initializeFunctionalCookies();
    
    // Hide completely after animation
    setTimeout(() => setShowConsent(false), 300);
  };

  const declineCookies = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
    };
    setCookieConsent("declined", essentialOnly);
    setIsVisible(false);
    // Hide completely after animation
    setTimeout(() => setShowConsent(false), 300);
  };

  if (!showConsent) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-gray-200 border-t border-gray-300 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Cookie Icon and Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="w-5 h-5 text-accent-red" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This website uses cookies to improve functionality, analyze traffic, and provide personalized content. 
                  By continuing to use our site, you consent to our use of cookies. 
                  <a 
                    href="/privacy-policy" 
                    className="text-accent-red hover:underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more in our Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={declineCookies}
                className="border-gray-300 text-gray-700"
              >
                Decline
              </Button>
              <CookieSettings 
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Customize
                  </Button>
                }
              />
              <Button
                size="sm"
                onClick={acceptCookies}
                className="bg-accent-red hover:bg-red-700 text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to check cookie consent status
export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setHasConsented(consent === "accepted");
  }, []);

  return hasConsented;
}
