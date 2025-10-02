'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();
  const router = useRouter();

  const updateQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    removeFromCart(id);
    addToCart({ ...item, quantity: newQuantity });
  };

  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const vat = +(subtotal * 0.2).toFixed(2);
  const discount = subtotal > 300 ? 0.2 * subtotal : 0;
  const total = +(subtotal + vat - discount).toFixed(2);

  return (
    <main className="bg-primary-bg font-inter text-primary-text">
      <section className="py-6 border-b border-divider">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center space-x-2 text-sm">
            <span
              className="text-primary-muted hover:text-accent-red cursor-pointer"
              onClick={() => router.push('/shop/products')}
            >
              Shop
            </span>
            <i className="fa-solid fa-chevron-right text-primary-muted text-xs" />
            <span className="text-primary-text">Shopping Cart</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className=" font-bold text-3xl md:text-4xl mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="lg:col-span-2 space-y-6">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-primary-card border border-divider p-6 rounded-xl shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-32 h-32 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="object-cover rounded-lg w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-primary-muted hover:text-accent-red"
                          >
                            <i className="fa-solid fa-trash text-lg" />
                          </button>
                        </div>
                        <p className="text-primary-muted text-sm mb-2">
                          {item.size && <>Size: {item.size} | </>}
                          {item.color && <>Color: {item.color}</>}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-divider rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-1 text-primary-text hover:text-accent-red"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-l border-r border-divider">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-1 text-primary-text hover:text-accent-red"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-xl text-accent-red">
                            ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <div className="flex justify-between items-center pt-6 border-t border-divider">
                  <button
                    onClick={() => router.push('/shop/products')}
                    className="flex items-center gap-2 text-accent-red hover:text-accent-amber cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-left" />
                    Continue Shopping
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-primary-muted hover:text-accent-red"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 space-y-6">
                <p className="text-center py-24">Your cart is empty.</p>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-6">
              <div className="bg-primary-card p-6 rounded-xl border border-divider shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-accent-green">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent-green">
                      <span>Discount (Auto SAVE)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-divider pt-3 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-accent-red">${total}</span>
                  </div>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => router.push('/secure-payment/checkout?type=cart')}
                  className={`w-full mt-6 py-4 bg-accent-red text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition ${
                    cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <i className="fa-solid fa-lock mr-2" />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
