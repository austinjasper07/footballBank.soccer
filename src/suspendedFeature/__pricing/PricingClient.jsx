"use client";

import { AlertCircle } from "lucide-react";

export default function PricingClient({ lang, dict }) {
  return (
    <div className="bg-primary-bg min-h-screen text-primary-text">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pricing Disabled</h1>
        <p className="text-primary-muted">Subscription pricing is currently unavailable.</p>
      </div>
    </div>
  );
}
