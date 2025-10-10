// app/success/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';


export default function SuccessPage() {
  const [status, setStatus] = useState('loading');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    console.log("Session ID from URL:", sessionId);
    
    if (!sessionId) {
      setErrorMessage('No session ID found in URL');
      setStatus('error');
      return;
    }
    
    fetch(`/api/stripe/checkout/subscription-success/${sessionId}`)
      .then((res) => {
        console.log("API Response status:", res.status);
        if (!res.ok) {
          throw new Error(`API returned status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response data:", data);
        // Ensure data is an object before setting it
        if (data && typeof data === 'object') {
          setCustomerInfo(data);
          setStatus('success');
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch((err) => {
        console.error('Error fetching session:', err);
        setErrorMessage(err.message || "Unknown error occurred");
        setStatus('error');
      });
  }, [sessionId]);
  
  if (status === 'loading') {
    return <div className="text-center p-12">Loading your order information...</div>;
  }
  
  if (status === 'error') {
    return (
      <div className="text-center p-12">
        <p>Something went wrong. Please contact support.</p>
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      </div>
    );
  }
  



  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="mt-2">Thank you for your purchase, {customerInfo?.customer_name || 'Valued Customer'}!</p>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Total:</span>
          <span>{customerInfo?.amount_total_formatted || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Email:</span>
          <span>{customerInfo?.customer_email || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Status:</span>
          <span className="text-green-600 font-semibold">{customerInfo?.payment_status || 'Completed'}</span>
        </div>
      </div>
    </div>
  );
}