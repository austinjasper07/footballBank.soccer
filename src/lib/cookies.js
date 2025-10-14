// Cookie consent management utilities

export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_PREFERENCES_KEY = "cookie-preferences";

export const defaultPreferences = {
  essential: true,
  analytics: false,
  functional: false,
};

// Get cookie consent status
export function getCookieConsent() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY);
}

// Get cookie preferences
export function getCookiePreferences() {
  if (typeof window === "undefined") return defaultPreferences;
  
  try {
    const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (saved) {
      return { ...defaultPreferences, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error("Error parsing cookie preferences:", error);
  }
  
  return defaultPreferences;
}

// Set cookie consent and preferences
export function setCookieConsent(status, preferences = null) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(COOKIE_CONSENT_KEY, status);
  
  if (preferences) {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
  }
}

// Check if specific cookie category is allowed
export function isCookieAllowed(category) {
  const preferences = getCookiePreferences();
  return preferences[category] === true;
}

// Initialize analytics based on cookie preferences
export function initializeAnalytics() {
  if (typeof window === "undefined") return;
  
  const preferences = getCookiePreferences();
  
  if (preferences.analytics) {
    // Initialize Google Analytics or other analytics services
    console.log("Analytics initialized");
    
    // Example: Initialize Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID');
  } else {
    console.log("Analytics disabled by user preference");
  }
}

// Initialize functional cookies
export function initializeFunctionalCookies() {
  if (typeof window === "undefined") return;
  
  const preferences = getCookiePreferences();
  
  if (preferences.functional) {
    // Initialize functional features like theme persistence, language settings, etc.
    console.log("Functional cookies initialized");
  } else {
    console.log("Functional cookies disabled by user preference");
  }
}

// Reset all cookie preferences
export function resetCookiePreferences() {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  localStorage.removeItem(COOKIE_PREFERENCES_KEY);
}
