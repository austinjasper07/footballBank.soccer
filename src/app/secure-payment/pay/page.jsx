'use client';

import { useState } from 'react';
import { FaCreditCard, FaCheckCircle, FaPaypal, FaCcVisa, FaCcMastercard, FaLock, FaShieldAlt, FaUndo } from 'react-icons/fa';

export default function Payment() {
  const [saveCard, setSaveCard] = useState(false);

  return (
    <>
      {/* Hero */}
      <section id="payment-hero" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className=" font-bold text-4xl md:text-5xl mb-6 text-primary-text">Secure Payment</h1>
          <p className="text-primary-muted text-lg max-w-2xl mx-auto mb-8">
            Complete your payment securely to unlock premium features and boost your football career.
          </p>
        </div>
      </section>

      {/* Payment Content */}
      <section id="payment-content" className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Payment Form */}
            <div id="payment-form-container">
              <div className="bg-primary-secondary rounded-xl p-8 border border-divider shadow-sm">
                <h2 className=" font-bold text-2xl mb-6 text-primary-text">Payment Details</h2>

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 text-primary-text">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-accent-red bg-accent-red/10 rounded-lg p-4 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaCreditCard className="text-accent-red text-xl" />
                          <span className="font-medium text-white">Credit/Debit Card</span>
                        </div>
                        <FaCheckCircle className="text-accent-red" />
                      </div>
                    </div>
                    <div className="border border-divider rounded-lg p-4 cursor-pointer hover:border-accent-amber transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaPaypal className="text-accent-amber text-xl" />
                          <span className="font-medium text-primary-text">PayPal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary-text">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                      />
                      <div className="absolute right-3 top-3 flex space-x-2">
                        <FaCcVisa className="text-accent-red text-xl" />
                        <FaCcMastercard className="text-accent-red text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary-text">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary-text">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary-text">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary-text">Billing Address</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full mb-3 bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="save-card"
                      type="checkbox"
                      checked={saveCard}
                      onChange={() => setSaveCard(!saveCard)}
                      className="w-4 h-4 text-accent-red bg-primary-secondary border border-divider rounded focus:ring-accent-red focus:ring-2"
                    />
                    <label htmlFor="save-card" className="text-sm text-primary-muted">
                      Save card for future payments
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent-red hover:bg-accent-red/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                  >
                    <FaLock className="inline-block mr-2" />
                    Complete Payment
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div id="order-summary-container">
              <div className="bg-primary-secondary rounded-xl p-8 border border-divider shadow-sm mb-8">
                <h2 className=" font-bold text-2xl mb-6 text-primary-text">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-divider">
                    <div>
                      <p className="font-medium text-primary-text">Premium Profile Promotion</p>
                      <p className="text-primary-muted text-sm">30-day featured listing</p>
                    </div>
                    <span className="font-semibold text-primary-text">£49.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-divider">
                    <div>
                      <p className="font-medium text-primary-text">Priority Submission</p>
                      <p className="text-primary-muted text-sm">Fast-track profile review</p>
                    </div>
                    <span className="font-semibold text-primary-text">£19.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-divider">
                    <span className="text-primary-muted">Subtotal</span>
                    <span className="text-primary-text">£69.98</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-divider">
                    <span className="text-primary-muted">Processing Fee</span>
                    <span className="text-primary-text">£2.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-bold text-lg text-primary-text">Total</span>
                    <span className="font-bold text-lg text-accent-green">£72.97</span>
                  </div>
                </div>
              </div>

              {/* Secure Info */}
              <div id="security-features" className="bg-primary-secondary rounded-xl p-6 border border-divider shadow-sm">
                <h3 className=" font-semibold text-lg mb-4 text-primary-text">Secure Payment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-accent-green" />
                    <span className="text-sm text-primary-muted">256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaLock className="text-accent-green" />
                    <span className="text-sm text-primary-muted">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCreditCard className="text-accent-green" />
                    <span className="text-sm text-primary-muted">Secure card processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUndo className="text-accent-green" />
                    <span className="text-sm text-primary-muted">30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
