'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'

export default function CheckoutWithParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const type = searchParams.get('type')
  const plan = searchParams.get('plan')

  const [items, setItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === 'subscription' && plan) {
          const { data: planData } = await axios.get(`/api/subscriptions/${plan}`)

          const subscriptionItem = {
            id: planData.id,
            name: `${planData.id.charAt(0).toUpperCase() + planData.id.slice(1)} Plan`,
            description: planData.features.join(', '),
            quantity: 1,
            price: planData.price,
            type: 'subscription',
            imageUrl: '/images/subscription-placeholder.png',
          }

          setItems([subscriptionItem])
        } else {
          const data = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { items: [] }
          setItems(data)
        }
      } catch (error) {
        console.error('Fetch error:', error?.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type, plan])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + shipping + tax).toFixed(2)

  const handlePayment = async () => {
    if (!paymentMethod) {
      router.push('/secure-payment/pay')
      return
    }

    try {
      const res = await axios.post('/api/checkout', { items, paymentMethod })
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl
      } else {
        alert('Unable to create payment session.')
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      alert('Failed to initiate payment. Please try again.')
    }
  }

  if (loading) return <div className="text-center py-20">Loading Order Summary...</div>

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
                <p className="font-mono text-accent-red">#FB-{Math.floor(Math.random() * 90000 + 10000)}</p>
              </div>
              <div>
                <p className="text-primary-muted">Shipping</p>
                <p>Standard Delivery (5–7 Days)</p>
              </div>
              <div>
                <p className="text-primary-muted">Email</p>
                <p>player@footballbank.soccer</p>
              </div>
              <div>
                <p className="text-primary-muted">Billing</p>
                <p>123 Football St, Soccer City</p>
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
                      src={item.imageUrl || '/images/product-placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-primary-muted">{item.description}</p>
                    <p className="text-xs mt-1">
                      Qty: {item.quantity} • {item.type === 'subscription' ? 'Subscription' : 'Product'}
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
              <div className="flex justify-between"><span>Tax</span><span>£{tax.toFixed(2)}</span></div>
              <div className="border-t border-divider pt-4 flex justify-between font-bold text-xl">
                <span>Total</span><span>£{total.toFixed(2)}</span>
              </div>
            </div>

            {paymentMethod ? (
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
            )}

            <button
              onClick={handlePayment}
              disabled={items.length === 0}
              className="mt-6 w-full bg-accent-red hover:bg-accent-red/90 text-white py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50"
            >
              <i className="fa-solid fa-credit-card mr-2" />
              Confirm & Pay
            </button>

            <button
              onClick={() => router.push('/cart')}
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
