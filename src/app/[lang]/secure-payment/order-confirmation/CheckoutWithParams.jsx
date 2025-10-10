'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/NewAuthContext'
import { useCart } from '@/context/CartContext'
import { CheckoutLoadingSkeleton } from '@/components/ui/loading-skeleton'
import Image from 'next/image'
import BuyNowButton from '@/components/BuyNowButton'

export default function CheckoutWithParams() {
  const router = useRouter()
  const { user, loading: isLoading} = useAuth()
  const { cart } = useCart()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderId] = useState(() => `#FB-${Math.floor(Math.random() * 90000 + 10000)}`)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load items from cart context
        if (cart && cart.length > 0) {
          setItems(cart)
        } else {
          setItems([])
        }
      } catch (error) {
        console.error('Fetch error:', error?.message)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [cart])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  
  // Tax calculation for physical products: 20% VAT
  const taxRate = 0.2
  const tax = +(subtotal * taxRate).toFixed(2)
  const total = +(subtotal + shipping + tax).toFixed(2);


  if (loading || isLoading) return <CheckoutLoadingSkeleton />

  return (
    <main className="bg-primary-bg text-primary-text py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-primary-secondary rounded-2xl border border-divider p-8">
            <h2 className="font-bold text-2xl mb-6">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-primary-muted">Order ID</p>
                <p className="font-mono text-accent-red">{orderId}</p>
              </div>
              <div>
                <p className="text-primary-muted">Shipping</p>
                <p>Standard Delivery (5–7 Days)</p>
              </div>
              <div>
                <p className="text-primary-muted">Email</p>
                <p>{user?.email || 'Loading...'}</p>
              </div>
              <div>
                <p className="text-primary-muted">Billing</p>
                <p>
                  {user?.billingAddress && user.billingAddress.street ? 
                    `${user.billingAddress.street}, ${user.billingAddress.city}, ${user.billingAddress.state} ${user.billingAddress.postalCode}` :
                    'Address will be collected during checkout'
                  }
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary-secondary rounded-2xl border border-divider p-8">
            <h2 className="font-bold text-2xl mb-6">Items</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-divider bg-primary-bg">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.imageUrl || item.image || '/images/product-placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/product-placeholder.png'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-primary-muted">{item.description}</p>
                    <p className="text-xs mt-1">
                      Qty: {item.quantity} • Product
                    </p>
                  </div>
                  <p className="text-right font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 sticky top-24">
          <section className="bg-primary-secondary border border-divider rounded-2xl p-8">
            <h2 className="font-bold text-2xl mb-6">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `£${shipping.toFixed(2)}` : 'FREE'}</span></div>
              <div className="flex justify-between">
                <span>VAT (20%)</span>
                <span>£{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-divider pt-4 flex justify-between font-bold text-xl">
                <span>Total</span><span>£{total.toFixed(2)}</span>
              </div>
            </div>

            {/* {paymentMethod ? (
              <div className="mt-6 bg-primary-bg p-4 rounded-lg border border-divider">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Card ending in {paymentMethod.last4}</p>
                    <p className="text-xs text-primary-muted">Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}</p>
                  </div>
                  <button onClick={() => router.push('/secure-payment')} className="text-accent-red text-sm font-medium">
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push('/secure-payment')}
                className="text-sm text-accent-red mt-4 underline"
              >
                Select payment method
              </button>
            )} */}
            <BuyNowButton cartItems={items} />
            {/* <button
              onClick={handlePayment}
              disabled={items.length === 0}
              className="mt-6 w-full bg-accent-red hover:bg-accent-red/90 text-white py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50"
            >
              <i className="fa-solid fa-credit-card mr-2" />
              Confirm & Pay
            </button> */}

            <button
              onClick={() => router.push('/shop/cart')}
              className="mt-4 w-full border border-divider text-primary-text hover:text-accent-red hover:border-accent-red py-3 rounded-lg font-semibold"
            >
              Return to Cart
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
