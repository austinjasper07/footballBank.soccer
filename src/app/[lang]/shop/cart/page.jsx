'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CartLoadingSkeleton } from '@/components/ui/loading-skeleton';

const CartPage = () => {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const [savedItems, setSavedItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    removeFromCart(id);
    addToCart({ ...item, quantity: newQuantity });
  };

  const saveForLater = (item) => {
    setSavedItems([...savedItems, item]);
    removeFromCart(item.id);
  };

  const moveToCart = (item) => {
    addToCart(item);
    setSavedItems(savedItems.filter(i => i.id !== item.id));
  };

  const removeSavedItem = (id) => {
    setSavedItems(savedItems.filter(i => i.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setAppliedPromo({ code: promoCode, discount: 0.2 });
    } else if (promoCode.toLowerCase() === 'welcome10') {
      setAppliedPromo({ code: promoCode, discount: 0.1 });
    }
  };

  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  
  // No tax calculation in cart - tax will be calculated in checkout
  const promoDiscount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const bulkDiscount = subtotal > 300 ? 0.1 * subtotal : 0;
  const totalDiscount = promoDiscount + bulkDiscount;
  const total = +(subtotal - totalDiscount).toFixed(2);

  if (loading) {
    return <CartLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => router.push(`/${lang}/shop/products`)}
                className="hover:text-orange-500 transition-colors cursor-pointer"
              >
                Shop
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </div>
            <div className="text-sm text-gray-600">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Cart Section */}
          <div className="lg:col-span-2">
            {cart.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Cart Items */}
                {cart.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-4 ${index < cart.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.size && <>Size: {item.size} | </>}
                              {item.color && <>Color: {item.color}</>}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="px-2 py-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-sm border-x border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="px-2 py-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <div className="text-lg font-semibold text-orange-600">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ${item.price.toFixed(2)} each
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => saveForLater(item)}
                              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              Save for later
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cart Actions */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                  <button
                    onClick={() => router.push(`/${lang}/shop/products`)}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-gray-600 hover:text-gray-800 text-sm cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => router.push(`/${lang}/shop/products`)}
                    className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                  >
                    Start Shopping
                  </Button>
                </div>
              </div>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Saved for Later</h3>
                <div className="space-y-4">
                  {savedItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-orange-600 font-semibold">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveToCart(item)}
                              className="cursor-pointer"
                            >
                              Move to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeSavedItem(item.id)}
                              className="cursor-pointer"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={applyPromoCode}
                    disabled={!promoCode}
                    className="cursor-pointer"
                  >
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {appliedPromo.code} applied ({Math.round(appliedPromo.discount * 100)}% off)
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                  </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount (10%)</span>
                    <span>-${bulkDiscount.toFixed(2)}</span>
                    </div>
                  )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">${total}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                disabled={cart.length === 0}
                onClick={() => router.push(`/${lang}/secure-payment/checkout?type=cart`)}
                className="w-full mt-6 bg-accent-red hover:bg-red-700 text-white font-medium py-3 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceed to Checkout
              </Button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
