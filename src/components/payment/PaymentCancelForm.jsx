"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft, ShoppingCart, CreditCard, RefreshCw } from 'lucide-react';

export default function PaymentCancelForm() {
  const [sessionId, setSessionId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get session ID from URL parameters
    const session = searchParams.get('session_id');
    if (session) {
      setSessionId(session);
    }

    // Get cancellation reason if available
    const cancelReason = searchParams.get('reason') || 'Payment was cancelled by user';
    setReason(cancelReason);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Redirect to shop or cart to retry payment
    router.push('/shop');
  };

  const handleGoToCart = () => {
    router.push('/shop/cart');
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center text-orange-600">
              Payment Cancellation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sessionId && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Session Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Session ID:</span> {sessionId}
                </p>
              </div>
            )}

            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reason:</strong> {reason}
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• No charges have been made to your payment method</li>
                <li>• Your cart items are still saved and available</li>
                <li>• You can retry your purchase at any time</li>
                <li>• Your account and profile remain unchanged</li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Payment Again
              </Button>
              
              <Button 
                onClick={handleGoToCart}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Go to Cart
              </Button>
              
              <Button 
                onClick={handleContactSupport}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Our support team is here to assist you with any payment issues.
          </p>
        </div>
      </div>
    </div>
  );
}
