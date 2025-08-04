'use client'

import { Suspense } from 'react'
import CheckoutWithParams from './CheckoutWithParams'

export default function CheckOutPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Order Summary...</div>}>
      <CheckoutWithParams />
    </Suspense>
  )
}
