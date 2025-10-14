import React from 'react';

export const LoadingSkeleton = ({ className = "", ...props }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props} />
);

export const CheckoutLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-bg via-blue-50 to-indigo-50 py-8">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Order Details & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details Skeleton */}
          <div className="bg-primary-secondary rounded-2xl border border-divider p-8">
            <LoadingSkeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-5 w-40" />
              </div>
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-5 w-36" />
              </div>
            </div>
          </div>

          {/* Items Skeleton */}
          <div className="bg-primary-secondary rounded-2xl border border-divider p-8">
            <LoadingSkeleton className="h-8 w-24 mb-6" />
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-divider bg-primary-bg">
                  <LoadingSkeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton className="h-5 w-32" />
                    <LoadingSkeleton className="h-4 w-48" />
                    <LoadingSkeleton className="h-3 w-24" />
                  </div>
                  <LoadingSkeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="space-y-6">
          <div className="bg-primary-secondary border border-divider rounded-2xl p-8">
            <LoadingSkeleton className="h-8 w-24 mb-6" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <div className="border-t border-divider pt-4 flex justify-between">
                <LoadingSkeleton className="h-6 w-12" />
                <LoadingSkeleton className="h-6 w-16" />
              </div>
            </div>
            <LoadingSkeleton className="h-12 w-full mt-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const CartLoadingSkeleton = () => (
  <div className="min-h-screen bg-primary-bg py-8">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <LoadingSkeleton className="h-8 w-32" />
          
          {/* Cart Items Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-divider p-6">
                <div className="flex items-center gap-4">
                  <LoadingSkeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <LoadingSkeleton className="h-5 w-48" />
                    <LoadingSkeleton className="h-4 w-32" />
                    <LoadingSkeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSkeleton className="w-8 h-8 rounded" />
                    <LoadingSkeleton className="h-4 w-8" />
                    <LoadingSkeleton className="w-8 h-8 rounded" />
                  </div>
                  <LoadingSkeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-divider rounded-xl p-6">
            <LoadingSkeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <div className="border-t border-divider pt-4 flex justify-between">
                <LoadingSkeleton className="h-6 w-12" />
                <LoadingSkeleton className="h-6 w-16" />
              </div>
            </div>
            <LoadingSkeleton className="h-12 w-full mt-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PayPageLoadingSkeleton = () => (
  <div className="min-h-screen bg-primary-bg py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-12">
        <LoadingSkeleton className="h-12 w-64 mx-auto mb-4" />
        <LoadingSkeleton className="h-6 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Payment Form Skeleton */}
        <div className="bg-white rounded-xl border border-divider p-8">
          <LoadingSkeleton className="h-8 w-48 mb-6" />
          
          {/* Payment Method Selection */}
          <div className="space-y-4 mb-6">
            <LoadingSkeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4 border border-divider rounded-lg">
                  <LoadingSkeleton className="w-5 h-5 rounded" />
                  <LoadingSkeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <LoadingSkeleton className="h-6 w-32" />
            <LoadingSkeleton className="h-12 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <LoadingSkeleton className="h-12 w-full rounded-lg" />
              <LoadingSkeleton className="h-12 w-full rounded-lg" />
            </div>
            <LoadingSkeleton className="h-12 w-full rounded-lg" />
          </div>

          <LoadingSkeleton className="h-12 w-full mt-8 rounded-lg" />
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-white rounded-xl border border-divider p-8">
          <LoadingSkeleton className="h-8 w-32 mb-6" />
          
          <div className="space-y-4 mb-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-divider rounded-lg">
                <LoadingSkeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton className="h-5 w-32" />
                  <LoadingSkeleton className="h-4 w-24" />
                </div>
                <LoadingSkeleton className="h-5 w-16" />
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-divider pt-4">
            <div className="flex justify-between">
              <LoadingSkeleton className="h-4 w-16" />
              <LoadingSkeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between">
              <LoadingSkeleton className="h-4 w-16" />
              <LoadingSkeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between">
              <LoadingSkeleton className="h-4 w-16" />
              <LoadingSkeleton className="h-4 w-12" />
            </div>
            <div className="border-t border-divider pt-4 flex justify-between">
              <LoadingSkeleton className="h-6 w-12" />
              <LoadingSkeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
