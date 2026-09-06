"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
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
    const consent = getCookieConsent();
    if (consent) {
      initializeAnalytics();
      initializeFunctionalCookies();
    } else {
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
      <div className="border-t border-primary-text-inverse/15 bg-primary-navy shadow-[0_-12px_35px_rgba(0,0,0,0.18)]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-accent">
                Privacy choices
              </p>
              <h3 className="mt-2 font-heading text-xl font-semibold text-primary-text-inverse sm:text-2xl">
                Cookies, on your terms
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-text-inverse/65">
                We use essential cookies to keep FootballBank secure and optional cookies to understand usage and improve the experience. You can accept all, reject optional cookies, or choose what works for you.
                <a
                  href="/privacy-policy"
                  className="ml-1 text-primary-accent underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={declineCookies}
                className="border-primary-text-inverse/30 bg-transparent text-primary-text-inverse hover:bg-primary-text-inverse/10 hover:text-primary-text-inverse"
              >
                Reject optional
              </Button>
              <CookieSettings
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary-text-inverse/30 bg-transparent text-primary-text-inverse hover:bg-primary-text-inverse/10 hover:text-primary-text-inverse"
                  >
                    <Settings className="size-3.5" />
                    Customize
                  </Button>
                }
              />
              <Button
                size="sm"
                onClick={acceptCookies}
                className="bg-primary-action text-primary-text-inverse hover:bg-primary-action-hover"
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
    setHasConsented(Boolean(getCookieConsent()));
  }, []);

  return hasConsented;
}
