import React from 'react';
import { Metadata } from 'next';
import RefundPolicyPage from '@/app/refund-policy/page';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://creatormint-store.vercel.app').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | CreatorMint',
  description: 'Official Cancellation & Refund Policy of CreatorMint. Explains order cancellation rules and refund processing timelines.',
  alternates: {
    canonical: `${siteUrl}/cancellation-policy`,
  },
};

export default function CancellationPolicyPage() {
  return <RefundPolicyPage />;
}
