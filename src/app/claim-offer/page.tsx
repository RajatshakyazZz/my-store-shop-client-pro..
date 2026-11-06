import { Metadata } from 'next';
import { Suspense } from 'react';
import ClaimOfferClient from './ClaimOfferClient';

export const metadata: Metadata = {
  title: 'Special Offer: Get 2 Free Bundles on ₹149 Order | CreatorMint',
  description:
    'Add minimum ₹149 value in cart to claim 2 extra reels bundles for 100% free. Browse eligible store bundles and unlock your bonus today!',
};

export default function ClaimOfferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F8EF] p-8 text-center text-ink-400">Loading offer details...</div>}>
      <ClaimOfferClient />
    </Suspense>
  );
}
