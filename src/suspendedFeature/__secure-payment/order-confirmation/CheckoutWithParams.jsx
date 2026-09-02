'use client'

import { AlertCircle } from 'lucide-react'

export default function CheckoutWithParams() {
  return (
    <main className="bg-primary-bg text-primary-text py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4">
        <section className="bg-primary-secondary rounded-2xl border border-divider p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-bold text-2xl mb-2">Checkout Disabled</h2>
          <p className="text-primary-muted">Order confirmation checkout is currently unavailable.</p>
        </section>
      </div>
    </main>
  )
}
