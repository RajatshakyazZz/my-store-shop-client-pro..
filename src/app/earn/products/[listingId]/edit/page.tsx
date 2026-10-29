'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { getResellerListingById } from '@/lib/resellerService';
import { ResellerListing } from '@/types/reseller';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import ResellerLandingBuilder from '@/components/reseller/ResellerLandingBuilder';

interface EditListingPageProps {
  params: Promise<{ listingId: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const { listingId } = use(params);
  const { user, isLoading: authLoading } = useResellerAuth();

  const [listing, setListing] = useState<ResellerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError('Please sign in to edit this listing.');
      setLoading(false);
      return;
    }
    loadListing();
  }, [listingId, user, authLoading]);

  const loadListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResellerListingById(listingId);
      if (!data) {
        setError('Reseller listing not found.');
        return;
      }
      if (user && data.resellerId !== user.uid) {
        setError('Unauthorized: You can only edit your own listings.');
        return;
      }
      setListing(data);
    } catch (err: any) {
      setError(err?.message || 'Error loading listing.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-red-100">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
        <p className="text-xs text-slate-500 font-bold">Loading listing editor...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-red-100 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-black text-red-600">{error || 'Listing Not Found'}</h2>
        <Link
          href="/earn/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-red-100 text-[#dc2626] text-xs font-bold"
        >
          Return to My Products
        </Link>
      </div>
    );
  }

  const originalProduct = BUNDLE_PRODUCTS.find(
    (p) => p.id === listing.originalProductId || p.slug === listing.originalProductSlug
  );

  if (!originalProduct) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-red-100 text-center space-y-4">
        <h2 className="text-base font-black text-red-600">Original Product Missing</h2>
        <p className="text-xs text-slate-500">The wholesale product tied to this listing is no longer available.</p>
        <Link
          href="/earn/products"
          className="inline-block px-4 py-2 rounded-xl bg-red-100 text-[#dc2626] text-xs font-bold"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <ResellerLandingBuilder
      originalProduct={originalProduct}
      initialListing={listing}
      mode="edit"
    />
  );
}
