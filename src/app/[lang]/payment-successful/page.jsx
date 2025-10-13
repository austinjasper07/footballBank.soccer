import { Suspense } from 'react';
import PaymentSuccessForm from '@/components/payment/PaymentSuccessForm';

export default function PaymentSuccessfulPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessForm params={params} />
    </Suspense>
  );
}