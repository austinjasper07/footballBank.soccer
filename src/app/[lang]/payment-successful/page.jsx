// app/success/page.tsx
'use client';
import { useEffect, useState, use, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getClientDictionary } from '@/lib/client-dictionaries';

function SuccessPageContent({ params }) {
  const [status, setStatus] = useState('loading');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dict, setDict] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  // Extract language from params (Next.js 15+ requires React.use())
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  
  useEffect(() => {
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  useEffect(() => {
    console.log("Session ID from URL:", sessionId);
    
    if (!sessionId) {
      setErrorMessage('No session ID found in URL');
      setStatus('error');
      return;
    }
    
    fetch(`/api/stripe/checkout/success/${sessionId}`)
      .then((res) => {
        console.log("API Response status:", res.status);
        return res.json().then(data => ({ status: res.status, data }));
      })
      .then(({ status, data }) => {
        console.log("API Response data:", data);
        
        if (status >= 400) {
          // Handle API errors with more specific messages
          const errorMsg = data?.error || `Server error (${status})`;
          const details = data?.details ? ` - ${data.details}` : '';
          throw new Error(`${errorMsg}${details}`);
        }
        
        // Ensure data is an object before setting it
        if (data && typeof data === 'object' && !data.error) {
          setCustomerInfo(data);
          setStatus('success');
        } else {
          throw new Error(data?.error || 'Invalid response format');
        }
      })
      .catch((err) => {
        console.error('Error fetching session:', err);
        setErrorMessage(err.message || "Unknown error occurred");
        setStatus('error');
      });
  }, [sessionId]);
  
  if (!dict) {
    return <div className="text-center p-12">{lang === 'es' ? 'Cargando...' : 'Loading...'}</div>;
  }

  if (status === 'loading') {
    return <div className="text-center p-12">{dict.payment.success.loadingOrder}</div>;
  }
  
  if (status === 'error') {
    return (
      <div className="text-center p-12">
        <p>Something went wrong. Please contact support.</p>
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      </div>
    );
  }
  
  // Determine redirect options based on payment mode
  const isSubscription = customerInfo?.mode === 'subscription';
  const isProductPurchase = customerInfo?.mode === 'payment';

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-green-600">{dict.payment.success.title}</h1>
        <p className="mt-2">{dict.payment.success.thankYou}, {customerInfo?.customer_name || dict.payment.success.valuedCustomer}!</p>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h2 className="font-semibold mb-2">{dict.payment.success.orderSummary}</h2>
        <div className="flex justify-between mb-2">
          <span>{dict.payment.success.total}:</span>
          <span>{customerInfo?.amount_total_formatted || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{dict.payment.success.email}:</span>
          <span>{customerInfo?.customer_email || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{dict.payment.success.status}:</span>
          <span className="text-green-600 font-semibold">{customerInfo?.payment_status || dict.payment.success.completed}</span>
        </div>
      </div>

      {/* Dynamic Action Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isSubscription && (
            <>
              <Link 
                href={`/${lang}/profile`}
                className="bg-accent-red text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-user mr-2"></i>
                {dict.payment.success.goToProfile}
              </Link>
              <Link 
                href={`/${lang}/pricing`}
                className="border border-accent-red text-accent-red px-6 py-3 rounded-lg font-semibold text-center hover:bg-accent-red hover:text-white transition-colors"
              >
                <i className="fa-solid fa-crown mr-2"></i>
                {dict.payment.success.viewPlans}
              </Link>
            </>
          )}
          
          {isProductPurchase && (
            <>
              <Link 
                href={`/${lang}/shop/products`}
                className="bg-accent-red text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                {dict.payment.success.continueShopping}
              </Link>
              <Link 
                href={`/${lang}`}
                className="border border-accent-red text-accent-red px-6 py-3 rounded-lg font-semibold text-center hover:bg-accent-red hover:text-white transition-colors"
              >
                <i className="fa-solid fa-box mr-2"></i>
                {dict.payment.success.backToHomepage}
              </Link>
            </>
          )}
          
          {/* Fallback for unknown payment types */}
          {!isSubscription && !isProductPurchase && (
            <>
              <Link 
                href={`/${lang}`}
                className="bg-accent-red text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-home mr-2"></i>
                {dict.payment.success.goToHome}
              </Link>
              <Link 
                href={`/${lang}/shop`}
                className="border border-accent-red text-accent-red px-6 py-3 rounded-lg font-semibold text-center hover:bg-accent-red hover:text-white transition-colors"
              >
                <i className="fa-solid fa-shopping-bag mr-2"></i>
                {dict.payment.success.visitShop}
              </Link>
            </>
          )}
        </div>
        
        {/* Additional helpful links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">{dict.payment.success.needHelp}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
            <Link 
              href={`/${lang}/contact`}
              className="text-accent-red hover:underline"
            >
              {dict.payment.success.contactSupport}
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link 
              href={`/${lang}/profile/orders`}
              className="text-accent-red hover:underline"
            >
              {dict.payment.success.viewOrderHistory}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage({ params }) {
  return (
    <Suspense fallback={<div className="text-center p-12">Loading your order information...</div>}>
      <SuccessPageContent params={params} />
    </Suspense>
  );
}
