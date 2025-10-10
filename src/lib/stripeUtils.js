/**
 * Centralized Stripe utility functions
 */

/**
 * Maps Stripe plan names to our database enum values
 * @param {string} stripePlanName - The plan name from Stripe
 * @returns {string} - Mapped plan name (free, basic, premium)
 */
export function mapPlanName(stripePlanName) {
  if (!stripePlanName) return "free";
  
  const planName = stripePlanName.toLowerCase();
  
  if (planName.includes("premium")) {
    return "premium";
  } else if (planName.includes("basic")) {
    return "basic";
  } else if (planName.includes("free")) {
    return "free";
  } else {
    return "free";
  }
}

/**
 * Maps plan and duration to Stripe price ID
 * @param {string} plan - The plan name (free, basic, premium)
 * @param {string} duration - The duration (1m, 3m)
 * @returns {string|null} - Stripe price ID or null for free plan
 */
export function getPriceId(plan, duration) {
  // Free plan doesn't have a Stripe price ID
  if (plan === "free") {
    return null;
  }
  
  const PRICE_MAP = {
    basic_1m: "price_1SGKRkRvu0fa63vjPN1kzJKb",
    basic_3m: "price_1SGKRkRvu0fa63vjiGJeqMUu",
    premium_1m: "price_1SGKUIRvu0fa63vjHHHGu3Va",
    premium_3m: "price_1SGKUIRvu0fa63vjlPXuCTZS",
  };
  
  const key = `${plan}_${duration}`;
  return PRICE_MAP[key];
}

/**
 * Validates if a plan and duration combination is valid
 * @param {string} plan - The plan name
 * @param {string} duration - The duration
 * @returns {boolean} - Whether the combination is valid
 */
export function isValidPlanDuration(plan, duration) {
  const validCombinations = [
    'free_1m', 'free_3m', // Free plan can have duration but no payment
    'basic_1m', 'basic_3m',
    'premium_1m', 'premium_3m'
  ];
  
  const key = `${plan}_${duration}`;
  return validCombinations.includes(key);
}
