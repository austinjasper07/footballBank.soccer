"use client";

import { useEffect, useState, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessForm({ params }) {
  const [status, setStatus] = useState('loading');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  // Extract language from params (Next.js 15+ requires React.use())
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  
  useEffect(() => {
    if (sessionId) {
      fetchPaymentStatus(sessionId);
    } else {
      setStatus('error');
      setErrorMessage('No session ID found');
    }
  }, [sessionId]);

  const fetchPaymentStatus = async (sessionId) => {
    try {
      const response = await fetch(`/api/stripe/checkout-session?session_id=${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setCustomerInfo(data.customerInfo);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setStatus('error');
      setErrorMessage('Failed to verify payment');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage || 'There was an issue processing your payment.'}
          </p>
          <div className="space-y-3">
            <Link
              href={`/${lang}/shop`}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
            >
              Try Again
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        {customerInfo && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Order Details
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Customer:</strong> {customerInfo.customerName}</p>
              <p><strong>Email:</strong> {customerInfo.customerEmail}</p>
              <p><strong>Amount:</strong> ${(customerInfo.amountTotal / 100).toFixed(2)}</p>
              <p><strong>Status:</strong> {customerInfo.paymentStatus}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={`/${lang}/profile`}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
          >
            Go to Profile
          </Link>
          <Link
            href={`/${lang}/shop`}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
