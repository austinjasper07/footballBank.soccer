/**
 * Shipping calculation utilities
 * Based on the shipping methods provided:
 * - U.S. Domestic: Standard Shipping (3-5 days) - $5.99
 * - International: Economy Shipping (7-14 days) - Unavailable
 * - Orders above $50: Free Shipping
 */

export const SHIPPING_METHODS = {
  DOMESTIC_STANDARD: {
    name: 'Standard Shipping',
    description: '3-5 days',
    price: 5.99,
    available: true
  },
  INTERNATIONAL_ECONOMY: {
    name: 'Economy Shipping',
    description: '7-14 days',
    price: 0,
    available: false // Unavailable as per requirements
  },
  FREE_SHIPPING: {
    name: 'Free Shipping',
    description: 'Orders above $50',
    price: 0,
    available: true,
    minOrderValue: 50
  }
};

/**
 * Get available shipping methods for a given address
 * @param {Object} address - Shipping address object
 * @param {number} orderTotal - Total order value
 * @returns {Array} Available shipping methods
 */
export function getAvailableShippingMethods(address, orderTotal = 0) {
  const methods = [];
  
  // Check if address is domestic (US)
  const isDomestic = address && (
    address.country === 'United States' || 
    address.country === 'USA' || 
    address.countryCode === 'US'
  );
  
  // Free shipping for orders above $50
  if (orderTotal >= 50) {
    methods.push(SHIPPING_METHODS.FREE_SHIPPING);
  }
  
  // Domestic shipping
  if (isDomestic) {
    methods.push(SHIPPING_METHODS.DOMESTIC_STANDARD);
  }
  
  // International shipping is unavailable
  // No international methods are added
  
  return methods;
}

/**
 * Calculate shipping cost for a given method and order total
 * @param {string} methodName - Name of the shipping method
 * @param {number} orderTotal - Total order value
 * @returns {number} Shipping cost
 */
export function calculateShippingCost(methodName, orderTotal = 0) {
  // Free shipping for orders above $50
  if (orderTotal >= 50) {
    return 0;
  }
  
  // Domestic standard shipping
  if (methodName === SHIPPING_METHODS.DOMESTIC_STANDARD.name) {
    return SHIPPING_METHODS.DOMESTIC_STANDARD.price;
  }
  
  // International shipping is unavailable
  if (methodName === SHIPPING_METHODS.INTERNATIONAL_ECONOMY.name) {
    throw new Error('International shipping is not available');
  }
  
  return 0;
}

/**
 * Get the default shipping method for an address
 * @param {Object} address - Shipping address object
 * @param {number} orderTotal - Total order value
 * @returns {Object|null} Default shipping method
 */
export function getDefaultShippingMethod(address, orderTotal = 0) {
  const methods = getAvailableShippingMethods(address, orderTotal);
  
  if (methods.length === 0) {
    return null;
  }
  
  // Prefer free shipping if available, otherwise use the first available method
  const freeShipping = methods.find(method => method.name === SHIPPING_METHODS.FREE_SHIPPING.name);
  if (freeShipping) {
    return freeShipping;
  }
  
  return methods[0];
}

/**
 * Validate if shipping is available for an address
 * @param {Object} address - Shipping address object
 * @returns {Object} Validation result
 */
export function validateShippingAvailability(address) {
  if (!address) {
    return {
      available: false,
      error: 'No shipping address provided'
    };
  }
  
  const isDomestic = address.country === 'United States' || 
                    address.country === 'USA' || 
                    address.countryCode === 'US';
  
  if (!isDomestic) {
    return {
      available: false,
      error: 'International shipping is not available. We only ship to the United States.'
    };
  }
  
  return {
    available: true,
    error: null
  };
}
