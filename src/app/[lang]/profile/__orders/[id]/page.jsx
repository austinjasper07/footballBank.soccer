"use client";

import { AlertCircle } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function OrderDetailDisabledPage() {
  return (
    <ProfileLayout title="Order Details" userRole="user">
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary-text mb-2">Order Details Disabled</h2>
        <p className="text-primary-muted">Order detail view is currently unavailable.</p>
      </div>
    </ProfileLayout>
  );
}
