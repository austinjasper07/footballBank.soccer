"use client";

import { AlertCircle } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function SubscriptionsPageDisabled() {
  return (
    <ProfileLayout title="Subscriptions" userRole="user">
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary-text mb-2">Subscriptions Disabled</h2>
        <p className="text-primary-muted">Subscription management is currently unavailable.</p>
      </div>
    </ProfileLayout>
  );
}
