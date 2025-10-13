import { Suspense } from 'react';
import PaymentCancelForm from '@/components/payment/PaymentCancelForm';

export default function PaymentCancelPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelForm />
    </Suspense>
  );
}
