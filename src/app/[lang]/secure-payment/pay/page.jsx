'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaCheckCircle, FaPaypal, FaCcVisa, FaCcMastercard, FaLock, FaShieldAlt, FaUndo, FaSpinner } from 'react-icons/fa';
import { PayPageLoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useAuth } from '@/context/NewAuthContext';

export default function Payment() {
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    street: '',
    city: '',
    postalCode: ''
  });

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const router = useRouter();

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login?redirect=/secure-payment/pay');
    }
  }, [authLoading, isAuthenticated]);
  

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        cardholderName: `${user.firstName} ${user.lastName}`,
      }));
    }
  }, [user]);

  // Simulate loading for payment page
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || authLoading) {
    return <PayPageLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Form validation
  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      return false;
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    if (!formData.cardholderName.trim()) {
      setError('Please enter the cardholder name');
      return false;
    }
    if (!formData.street.trim()) {
      setError('Please enter your street address');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!formData.postalCode.trim()) {
      setError('Please enter your postal code');
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (paymentMethod === 'card' && !validateForm()) {
      return;
    }

    setProcessing(true);
    
    try {
      if (paymentMethod === 'card') {
        // Create payment intent for card payment
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 7297, // £72.97 in pence
            currency: 'gbp',
            userId: user.id,
            userEmail: user.email,
            billingAddress: {
              street: formData.street,
              city: formData.city,
              postalCode: formData.postalCode,
              country: 'GB'
            },
            saveCard: saveCard
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }

        // For now, simulate successful payment
        setSuccess(true);
        setTimeout(() => {
          router.push('/secure-payment/success');
        }, 2000);

      } else if (paymentMethod === 'paypal') {
        // Create PayPal checkout session
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 7297,
            currency: 'gbp',
            userId: user.id,
            userEmail: user.email,
            paymentMethod: 'paypal'
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.url) {
          // Redirect to PayPal checkout
          window.location.href = data.url;
        } else {
          setError('Failed to create PayPal checkout session');
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section id="payment-hero" className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className=" font-bold text-4xl md:text-5xl mb-6 text-primary-text">Secure Payment</h1>
          <p className="text-primary-muted text-lg max-w-2xl mx-auto mb-4">
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
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'card' 
                          ? 'border-accent-red bg-accent-red/10' 
                          : 'border-divider hover:border-accent-amber'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaCreditCard className={`text-xl ${paymentMethod === 'card' ? 'text-accent-red' : 'text-primary-text'}`} />
                          <span className={`font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-primary-text'}`}>
                            Credit/Debit Card
                          </span>
                        </div>
                        {paymentMethod === 'card' && <FaCheckCircle className="text-accent-red" />}
                      </div>
                    </div>
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'paypal' 
                          ? 'border-accent-amber bg-accent-amber/10' 
                          : 'border-divider hover:border-accent-amber'
                      }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaPaypal className={`text-xl ${paymentMethod === 'paypal' ? 'text-accent-amber' : 'text-accent-amber'}`} />
                          <span className={`font-medium ${paymentMethod === 'paypal' ? 'text-white' : 'text-primary-text'}`}>
                            PayPal
                          </span>
                        </div>
                        {paymentMethod === 'paypal' && <FaCheckCircle className="text-accent-amber" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">Payment successful! Redirecting...</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handlePayment} className="space-y-6">
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary-text">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              handleInputChange({ target: { name: 'cardNumber', value: formatted } });
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                            required
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
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => {
                              const formatted = formatExpiryDate(e.target.value);
                              handleInputChange({ target: { name: 'expiryDate', value: formatted } });
                            }}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-primary-text">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                            className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary-text">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                          required
                        />
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
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary-text">Billing Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="w-full mb-3 bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                        required
                      />
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                        className="w-full bg-primary-secondary border border-divider rounded-lg px-4 py-3 text-primary-text placeholder-primary-muted focus:border-accent-amber focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing || success}
                    className="w-full bg-accent-red hover:bg-accent-red/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {processing ? (
                      <>
                        <FaSpinner className="inline-block mr-2 animate-spin" />
                        {paymentMethod === 'paypal' ? 'Redirecting to PayPal...' : 'Processing Payment...'}
                      </>
                    ) : success ? (
                      <>
                        <FaCheckCircle className="inline-block mr-2" />
                        Payment Successful!
                      </>
                    ) : (
                      <>
                        <FaLock className="inline-block mr-2" />
                        {paymentMethod === 'paypal' ? 'Pay with PayPal' : 'Complete Payment'}
                      </>
                    )}
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
