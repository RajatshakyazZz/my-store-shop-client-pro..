import React from 'react';
import { Metadata } from 'next';
import RefundPolicyPage from '@/app/refund-policy/page';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://creatormint-store.vercel.app').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Cancellations and Refunds Policy | CreatorMint',
  description: 'Official Cancellations and Refunds Policy of CreatorMint. Details our transparent refund guidelines, cancellation policy, and 5-7 day payment gateway reversal timelines.',
  alternates: {
    canonical: `${siteUrl}/cancellations-and-refunds`,
  },
};

export default function CancellationsAndRefundsPage() {
  return <RefundPolicyPage />;
}
