'use client';
import { use } from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getClientDictionary } from '@/lib/client-dictionaries';

export default function PaymentFailedPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const [dict, setDict] = useState(null);

  useEffect(() => {
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  if (!dict) {
    return <div className="text-center p-12">{lang === 'es' ? 'Cargando...' : 'Loading...'}</div>;
  }

  return (
    <>
      <Head>
        <title>{dict.payment.failed.title} - FootballBank</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="bg-primary-bg text-primary-text">
        <section className="py-16 md:py-24 min-h-[80vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Error Icon */}
              <div className="mb-12">
                <div className="w-32 h-32 bg-accent-red bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <div className="w-24 h-24 bg-accent-red rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-times text-white text-3xl"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-red rounded-full flex items-center justify-center animate-pulse">
                    <i className="fa-solid fa-exclamation text-white text-sm"></i>
                  </div>
                </div>
                <h1 className=" font-bold text-4xl md:text-5xl mb-4 text-accent-red">
                  {dict.payment.failed.title}
                </h1>
                <p className="text-primary-muted text-lg md:text-xl">
                  {dict.payment.failed.subtitle}
                </p>
              </div>

              {/* Details Card */}
              <div className="bg-primary-secondary rounded-2xl border border-divider p-8 mb-8 text-left shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-divider">
                  <h2 className=" font-semibold text-2xl">{dict.payment.failed.transactionDetails}</h2>
                  <div className="flex items-center gap-2 bg-accent-red bg-opacity-20 px-4 py-2 rounded-full">
                    <i className="fa-solid fa-circle-xmark text-accent-red"></i>
                    <span className="text-accent-red font-medium">{dict.payment.failed.failed}</span>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-primary-muted text-sm font-medium block mb-1">
                          {dict.payment.failed.transactionId}
                        </label>
                        <span className="font-mono text-accent-red font-medium">
                          #TXN-2024-FB-8848
                        </span>
                      </div>
                      <div>
                        <label className="text-primary-muted text-sm font-medium block mb-1">
                          {dict.payment.failed.dateTime}
                        </label>
                        <span className="text-primary-text">December 15, 2024 at 3:45 PM</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-primary-muted text-sm font-medium block mb-1">
                          {dict.payment.failed.paymentMethod}
                        </label>
                        <div className="flex items-center gap-2">
                          <i className="fa-brands fa-cc-visa text-accent-blue text-lg"></i>
                          <span className="text-primary-text">**** **** **** 4242</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-primary-muted text-sm font-medium block mb-1">
                          {dict.payment.failed.status}
                        </label>
                        <span className="text-accent-red font-medium">{dict.payment.failed.declined}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Reason */}
                <div className="bg-accent-red bg-opacity-10 border border-accent-red border-opacity-30 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <i className="fa-solid fa-circle-exclamation text-accent-red text-xl mt-1"></i>
                    <div>
                      <h3 className=" font-semibold text-lg mb-2 text-accent-red">
                        {dict.payment.failed.paymentDeclined}
                      </h3>
                      <p className="text-primary-text mb-3">
                        {dict.payment.failed.cardDeclinedMessage}
                      </p>
                      <ul className="text-primary-muted space-y-2">
                        {[
                          dict.payment.failed.reasons.insufficientFunds,
                          dict.payment.failed.reasons.securityRestrictions,
                          dict.payment.failed.reasons.expiredCard,
                        ].map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <i className="fa-solid fa-circle text-accent-red text-xs"></i>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Purchase Summary */}
                <div className="mb-8">
                  <h3 className=" font-semibold text-lg mb-4">{dict.payment.failed.attemptedPurchase}</h3>
                  <div className="space-y-4">
                    <PurchaseItem
                      icon="fa-crown"
                      label="Premium Player Submission"
                      sub="Enhanced profile visibility"
                      amount="$49.99"
                      color="blue"
                    />
                    <PurchaseItem
                      icon="fa-chart-line"
                      label="Advanced Analytics Package"
                      sub="3-month subscription"
                      amount="$29.99"
                      color="amber"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-divider flex justify-between text-2xl font-bold text-primary-muted">
                  <span>{dict.payment.failed.totalAmount}</span>
                  <span>$90.62</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button className="bg-accent-blue hover:bg-opacity-80 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 transform hover:scale-105">
                  <i className="fa-solid fa-redo"></i> {dict.payment.failed.tryAgain}
                </button>
                <button className="bg-primary-secondary hover:bg-opacity-80 text-primary-text border border-divider px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:border-accent-blue">
                  <i className="fa-solid fa-shopping-cart"></i> {dict.payment.failed.goBackToCart}
                </button>
              </div>

              {/* Support */}
              <div className="bg-primary-secondary rounded-xl border border-divider p-6 mb-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <i className="fa-solid fa-headset text-accent-amber text-xl"></i>
                  <h3 className=" font-semibold text-lg">{dict.payment.failed.stillHavingIssues}</h3>
                </div>
                <p className="text-primary-muted mb-4">
                  {dict.payment.failed.supportMessage}
                </p>
                <button className="text-accent-blue hover:text-accent-amber font-medium transition-colors flex items-center justify-center gap-2 mx-auto">
                  <i className="fa-solid fa-envelope"></i> {dict.payment.failed.contactSupport}
                </button>
              </div>

              {/* Alt Payments */}
              <div className="bg-primary-secondary rounded-xl border border-divider p-6 mt-6 text-center">
                <h3 className=" font-semibold text-lg mb-4">{dict.payment.failed.alternativePayments}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    ['fa-paypal', dict.payment.failed.paypal, 'text-accent-blue'],
                    ['fa-apple-pay', dict.payment.failed.applePay, 'text-primary-text'],
                    ['fa-google-pay', dict.payment.failed.googlePay, 'text-accent-green'],
                  ].map(([icon, label, text], i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary-bg px-4 py-2 rounded-lg border border-divider"
                    >
                      <i className={`fa-brands ${icon} ${text} text-lg`}></i>
                      <span className="text-primary-text">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Reusable Component
const PurchaseItem = ({ icon, label, sub, amount, color }) => (
  <div className="flex items-center justify-between p-4 bg-primary-bg rounded-lg border border-divider opacity-60">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 bg-accent-${color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
        <i className={`fa-solid ${icon} text-accent-${color}`}></i>
      </div>
      <div>
        <div className="font-medium text-primary-text">{label}</div>
        <div className="text-primary-muted text-sm">{sub}</div>
      </div>
    </div>
    <div className="text-primary-muted font-semibold">{amount}</div>
  </div>
);
