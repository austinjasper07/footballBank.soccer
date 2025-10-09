'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaArrowLeft, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@/context/NewAuthContext';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50">
      {/* Hero */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <FaCheckCircle className="text-6xl text-accent-green mx-auto mb-4" />
              <h1 className="font-bold text-4xl md:text-5xl mb-6 text-primary-text">
                Payment Successful!
              </h1>
              <p className="text-primary-muted text-lg mb-8">
                Your payment has been processed successfully. You now have access to premium features.
              </p>
            </div>

            {/* Success Details */}
            <div className="bg-white rounded-xl p-8 border border-divider shadow-sm mb-8">
              <h2 className="font-bold text-2xl mb-6 text-primary-text">Payment Details</h2>
              
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
                  <span className="text-primary-muted">Processing Fee</span>
                  <span className="text-primary-text">£2.99</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-bold text-lg text-primary-text">Total Paid</span>
                  <span className="font-bold text-lg text-accent-green">£72.97</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaShieldAlt className="text-accent-green" />
                  <span className="font-medium text-green-800">Payment Secured</span>
                </div>
                <p className="text-green-700 text-sm">
                  Your payment was processed securely through our encrypted payment system.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-primary-secondary rounded-xl p-8 border border-divider shadow-sm mb-8">
              <h3 className="font-bold text-xl mb-4 text-primary-text">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary-text">Profile Promotion Active</p>
                    <p className="text-primary-muted text-sm">Your profile is now being promoted for 30 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary-text">Priority Review</p>
                    <p className="text-primary-muted text-sm">Your profile will be reviewed with priority status</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary-text">Enhanced Visibility</p>
                    <p className="text-primary-muted text-sm">Your profile will appear higher in search results</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/player-profile')}
                className="bg-accent-red hover:bg-accent-red/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <FaCreditCard className="mr-2" />
                View My Profile
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-primary-secondary hover:bg-primary-secondary/80 text-primary-text px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center border border-divider"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
