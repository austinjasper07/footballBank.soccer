'use client';

import Head from 'next/head';
import React from 'react';

const PaymentSuccess = () => {
  return (
    <>
      <Head>
        <title>Payment Successful - FootballBank</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="bg-primary-bg font-inter text-primary-text min-h-screen">
        {/* Main content starts below */}
        <section className="py-16 md:py-24 min-h-[80vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Success icon */}
              <div className="w-32 h-32 bg-accent-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="w-24 h-24 bg-accent-green rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-check text-white text-3xl"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-green rounded-full flex items-center justify-center animate-pulse">
                  <i className="fa-solid fa-sparkles text-white text-sm"></i>
                </div>
              </div>

              <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-4 text-accent-green">
                Payment Successful!
              </h1>
              <p className="text-primary-muted text-lg md:text-xl">
                Your order has been confirmed and is now being processed.
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-primary-secondary rounded-2xl border border-divider p-8 mb-8 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-divider">
              <h2 className="font-poppins font-semibold text-2xl">
                Payment Confirmation
              </h2>
              <div className="flex items-center gap-2 bg-accent-green bg-opacity-20 px-4 py-2 rounded-full">
                <i className="fa-solid fa-circle-check text-accent-green"></i>
                <span className="text-accent-green font-medium">Paid</span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-primary-muted text-sm font-medium block mb-1">
                      Transaction ID
                    </label>
                    <span className="font-mono text-accent-blue font-medium">
                      #TXN-2024-FB-8847
                    </span>
                  </div>
                  <div>
                    <label className="text-primary-muted text-sm font-medium block mb-1">
                      Date &amp; Time
                    </label>
                    <span className="text-primary-text">
                      December 15, 2024 at 3:42 PM
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-primary-muted text-sm font-medium block mb-1">
                      Payment Method
                    </label>
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-cc-visa text-accent-blue text-lg"></i>
                      <span className="text-primary-text">
                        **** **** **** 4242
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-primary-muted text-sm font-medium block mb-1">
                      Status
                    </label>
                    <span className="text-accent-green font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="mb-8">
              <h3 className="font-poppins font-semibold text-lg mb-4">
                Items Purchased
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-bg rounded-lg border border-divider">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-crown text-accent-blue"></i>
                    </div>
                    <div>
                      <div className="font-medium text-primary-text">
                        Premium Player Submission
                      </div>
                      <div className="text-primary-muted text-sm">
                        Enhanced profile visibility
                      </div>
                    </div>
                  </div>
                  <div className="text-accent-green font-semibold">$49.99</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary-bg rounded-lg border border-divider">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-amber bg-opacity-20 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-chart-line text-accent-amber"></i>
                    </div>
                    <div>
                      <div className="font-medium text-primary-text">
                        Advanced Analytics Package
                      </div>
                      <div className="text-primary-muted text-sm">
                        3-month subscription
                      </div>
                    </div>
                  </div>
                  <div className="text-accent-green font-semibold">$29.99</div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-divider">
              <div className="space-y-3">
                <div className="flex justify-between text-primary-muted">
                  <span>Subtotal:</span>
                  <span>$79.98</span>
                </div>
                <div className="flex justify-between text-primary-muted">
                  <span>Processing Fee:</span>
                  <span>$2.40</span>
                </div>
                <div className="flex justify-between text-primary-muted">
                  <span>Tax:</span>
                  <span>$8.24</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t border-divider">
                  <span className="text-primary-text">Total Paid:</span>
                  <span className="text-accent-green">$90.62</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-accent-blue hover:bg-opacity-80 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 transform hover:scale-105">
              <i className="fa-solid fa-tachometer-alt"></i>
              Go to Dashboard
            </button>
            <button className="bg-primary-secondary hover:bg-opacity-80 text-primary-text border border-divider px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:border-accent-blue">
              <i className="fa-solid fa-home"></i>
              Return to Homepage
            </button>
          </div>

          {/* Support Section */}
          <div className="bg-primary-secondary rounded-xl border border-divider p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <i className="fa-solid fa-headset text-accent-amber text-xl"></i>
              <h3 className="font-poppins font-semibold text-lg">Need Help?</h3>
            </div>
            <p className="text-primary-muted mb-4">
              If you have any questions about your purchase or need assistance,
              our support team is here to help.
            </p>
            <button className="text-accent-blue hover:text-accent-amber font-medium transition-colors flex items-center justify-center gap-2 mx-auto">
              <i className="fa-solid fa-envelope"></i>
              Contact Support
            </button>
          </div>

          {/* Receipt Download */}
          <div className="mt-8 text-center">
            <button className="text-primary-muted hover:text-accent-blue transition-colors flex items-center justify-center gap-2 mx-auto">
              <i className="fa-solid fa-download"></i>
              Download Receipt (PDF)
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default PaymentSuccess;
