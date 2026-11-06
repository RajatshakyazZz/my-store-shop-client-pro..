import React from 'react';
import { Metadata } from 'next';
import ShippingPolicyPage from '@/app/shipping-policy/page';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://creatormint-store.vercel.app').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Shipping Policy | CreatorMint',
  description: 'Official Shipping Policy of CreatorMint. Instant digital electronic delivery with zero shipping charges.',
  alternates: {
    canonical: `${siteUrl}/shipping`,
  },
};

export default function ShippingAliasPage() {
  return <ShippingPolicyPage />;
}
