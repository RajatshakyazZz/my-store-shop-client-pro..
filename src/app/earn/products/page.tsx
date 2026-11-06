'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  Eye,
  TrendingUp,
  Share2,
  Trash2,
  X,
  MessageCircle,
  Sparkles,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import {
  getResellerListingsByUser,
  updateResellerListing,
  deleteResellerListing,
  generateShareText,
  getWhatsAppShareUrl,
} from '@/lib/resellerService';
import { ResellerListing } from '@/types/reseller';

export default function ResellerProductsPage() {
  const { user, profile } = useResellerAuth();
  const [listings, setListings] = useState<ResellerListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingListing, setEditingListing] = useState<ResellerListing | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Modal State
  const [deletingListing, setDeletingListing] = useState<ResellerListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Social Share Modal State
  const [shareListing, setShareListing] = useState<ResellerListing | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadListings();
  }, [user, profile?.resellerUid]);

  const loadListings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getResellerListingsByUser(user.uid, profile?.resellerUid);
      setListings(data);
    } catch (e) {
      console.warn('Error loading listings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleToggleStatus = async (listing: ResellerListing) => {
    if (!user) return;
    const nextStatus = listing.status === 'active' ? 'paused' : 'active';
    try {
      await updateResellerListing(listing.id, user.uid, { status: nextStatus });
      await loadListings();
    } catch (e) {
      console.warn('Error toggling status:', e);
    }
  };

  const openEditModal = (listing: ResellerListing) => {
    setEditingListing(listing);
    setEditTitle(listing.customTitle);
    setEditPrice(listing.resalePrice);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingListing) return;
    setEditError(null);

    const priceNum = Number(editPrice);
    if (priceNum <= editingListing.basePrice) {
      setEditError(`Selling price must be greater than base price of ₹${editingListing.basePrice}`);
      return;
    }

    setIsUpdating(true);
    try {
      await updateResellerListing(editingListing.id, user.uid, {
        customTitle: editTitle.trim(),
        resalePrice: priceNum,
      });
      setEditingListing(null);
      await loadListings();
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update listing');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!user || !deletingListing) return;
    setIsDeleting(true);
    try {
      await deleteResellerListing(deletingListing.id, user.uid);
      setDeletingListing(null);
      await loadListings();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyCaption = (listing: ResellerListing) => {
    const text = generateShareText(listing, window.location.origin);
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleNativeShare = async (listing: ResellerListing) => {
    const url = `${window.location.origin}/r/${listing.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.customTitle,
          text: listing.customHeadline || listing.customTitle,
          url,
        });
        return;
      } catch {}
    }
    copyToClipboard(listing.slug);
  };

  const filteredListings = listings.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.customTitle?.toLowerCase().includes(q) ||
      l.slug?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Header */}
      <div className="p-5 sm:p-8 rounded-3xl bg-white border border-leaf-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1019]">My Reseller Products</h1>
            {profile?.resellerUid && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 font-bold">
                🆔 {profile.resellerUid}
              </span>
            )}
          </div>
          <p className="text-xs text-ink-400 mt-1 font-medium">
            Manage your custom links, adjust selling prices, and track individual sales performance.
          </p>
        </div>

        <Link
          href="/earn/create"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#467600] to-[#9AE600] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Product Link</span>
        </Link>
      </div>

      {/* Search Bar if listings exist */}
      {listings.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-ink-300" />
          <input
            type="text"
            placeholder="Search your links by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-leaf-100 text-xs font-medium text-[#0B1019] focus:outline-none focus:border-[#467600] focus:ring-2 focus:ring-leaf-100 shadow-xs"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="rounded-3xl bg-white border border-leaf-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-ink-300 font-bold">
            Loading your reseller products...
          </div>
        ) : listings.length === 0 ? (
          <div className="p-10 sm:p-14 text-center space-y-3">
            <Package className="w-12 h-12 text-leaf-200 mx-auto" />
            <h3 className="text-sm font-black text-[#0B1019]">No Reseller Products Found</h3>
            <p className="text-xs text-ink-400 max-w-sm mx-auto font-medium">
              You haven&apos;t created any reseller listings yet. Choose a product and start sharing your link!
            </p>
            <div className="pt-2">
              <Link
                href="/earn/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#467600] text-white text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create First Link</span>
              </Link>
            </div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-400 font-medium">
            No products match &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          <div>
            {/* ------------------------------------------------------------- */}
            {/* MOBILE VIEW: RESPONSIVE CARDS (Clean, Touch-Friendly, No Clip) */}
            {/* ------------------------------------------------------------- */}
            <div className="block md:hidden divide-y divide-leaf-50">
              {filteredListings.map((l) => {
                const views = l.viewsCount || 0;
                const sales = l.salesCount || 0;
                const isCopied = copiedSlug === l.slug;

                return (
                  <div key={l.id} className="p-4 space-y-3.5">
                    {/* Top Row: Thumbnail + Title + Status */}
                    <div className="flex items-start gap-3">
                      {l.coverImage ? (
                        <img
                          src={l.coverImage}
                          alt={l.customTitle}
                          className="w-14 h-14 rounded-2xl object-cover bg-ink border border-leaf-100 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-leaf-100 text-[#467600] flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs text-[#0B1019] line-clamp-1">{l.customTitle}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${
                              l.status === 'active'
                                ? 'bg-mint-50 text-leaf-700 border border-mint-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {l.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-leaf-600 font-mono font-bold block mt-0.5 truncate select-all">
                          /r/{l.slug}
                        </span>

                        {/* Price & Margin Pill */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] font-black text-[#0B1019]">₹{l.resalePrice}</span>
                          <span className="text-[10px] text-ink-300">(Base ₹{l.basePrice})</span>
                          <span className="text-[10px] font-black text-leaf-700 px-2 py-0.5 rounded-md bg-mint-50 border border-mint-200">
                            +₹{l.grossMargin} Profit
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 p-2.5 rounded-2xl bg-leaf-50/50 border border-leaf-100 text-center text-[10px]">
                      <div>
                        <span className="text-ink-300 block font-bold">Views</span>
                        <span className="font-black text-[#0B1019]">{views}</span>
                      </div>
                      <div className="border-x border-leaf-100">
                        <span className="text-ink-300 block font-bold">Clicks</span>
                        <span className="font-black text-[#0B1019]">{l.ctaClicksCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-ink-300 block font-bold">Sales</span>
                        <span className="font-black text-leaf-600 font-bold">{sales}</span>
                      </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Copy Link Button */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(l.slug)}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          isCopied
                            ? 'bg-mint-500 text-ink'
                            : 'bg-[#467600] hover:bg-[#3A6300] text-white active:scale-95'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                      </button>

                      {/* WhatsApp Share Button */}
                      <a
                        href={typeof window !== 'undefined' ? getWhatsAppShareUrl(l, window.location.origin) : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#9AE600] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Secondary Action Toolbar */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        {/* Quick Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(l)}
                          className="px-3 py-1.5 rounded-lg border border-leaf-200 text-[#467600] bg-leaf-50/50 hover:bg-leaf-100 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* Pause / Resume */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(l)}
                          className="px-3 py-1.5 rounded-lg border border-canvas-200 text-ink-600 hover:bg-canvas-50 text-xs font-bold flex items-center gap-1"
                        >
                          {l.status === 'active' ? (
                            <>
                              <PauseCircle className="w-3 h-3 text-amber-600" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3 h-3 text-leaf-600" />
                              <span>Resume</span>
                            </>
                          )}
                        </button>

                        {/* More Share */}
                        <button
                          type="button"
                          onClick={() => setShareListing(l)}
                          title="Share Options"
                          className="p-2 rounded-lg border border-canvas-200 text-ink-500 hover:bg-canvas-50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Live Page */}
                        <Link
                          href={`/r/${l.slug}`}
                          target="_blank"
                          title="Open Live Page"
                          className="p-2 rounded-lg border border-canvas-200 text-ink-500 hover:bg-canvas-50"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingListing(l)}
                          title="Delete Link"
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* DESKTOP VIEW: CLEAN EXPANDED TABLE */}
            {/* ------------------------------------------------------------- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-leaf-100 text-ink-300 font-extrabold uppercase text-[10px] bg-leaf-50/30">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-3">Base</th>
                    <th className="py-3.5 px-3">Price</th>
                    <th className="py-3.5 px-3">Margin</th>
                    <th className="py-3.5 px-3 text-center">Views</th>
                    <th className="py-3.5 px-3 text-center">Clicks</th>
                    <th className="py-3.5 px-3 text-center">Sales</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-50">
                  {filteredListings.map((l) => {
                    const views = l.viewsCount || 0;
                    const sales = l.salesCount || 0;
                    const isCopied = copiedSlug === l.slug;

                    return (
                      <tr key={l.id} className="hover:bg-leaf-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {l.coverImage ? (
                              <img
                                src={l.coverImage}
                                alt={l.customTitle}
                                className="w-12 h-12 rounded-xl object-cover bg-ink border border-leaf-100 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-leaf-100 text-[#467600] flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0 max-w-xs">
                              <h4 className="font-bold text-[#0B1019] line-clamp-1">{l.customTitle}</h4>
                              <span className="text-[10px] text-leaf-600 font-mono font-bold">/r/{l.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-bold text-ink-400">₹{l.basePrice}</td>
                        <td className="py-3.5 px-3 font-black text-[#0B1019]">₹{l.resalePrice}</td>
                        <td className="py-3.5 px-3 font-black text-leaf-600">+₹{l.grossMargin}</td>
                        <td className="py-3.5 px-3 text-center font-medium text-ink-500">{views}</td>
                        <td className="py-3.5 px-3 text-center font-medium text-ink-500">{l.ctaClicksCount || 0}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-leaf-600">{sales}</td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                              l.status === 'active'
                                ? 'bg-mint-50 text-leaf-700 border border-mint-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copy Link */}
                            <button
                              type="button"
                              onClick={() => copyToClipboard(l.slug)}
                              title="Copy Shareable Link"
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                                isCopied
                                  ? 'bg-mint-100 text-leaf-700'
                                  : 'bg-leaf-50 hover:bg-leaf-100 text-[#467600]'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-leaf-600" />
                                  <span className="text-leaf-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {/* WhatsApp Share */}
                            <a
                              href={typeof window !== 'undefined' ? getWhatsAppShareUrl(l, window.location.origin) : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Share on WhatsApp"
                              className="p-1.5 rounded-lg text-[#25D366] hover:bg-mint-50 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Share Modal */}
                            <button
                              type="button"
                              onClick={() => setShareListing(l)}
                              title="All Share Options"
                              className="p-1.5 rounded-lg text-ink-300 hover:text-ink-600 hover:bg-canvas transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            {/* Open Public Page */}
                            <Link
                              href={`/r/${l.slug}`}
                              target="_blank"
                              title="Open Live Product Landing Page"
                              className="p-1.5 rounded-lg text-ink-300 hover:text-ink-600 hover:bg-canvas transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Quick Edit */}
                            <button
                              type="button"
                              onClick={() => openEditModal(l)}
                              title="Quick Edit Title & Price"
                              className="p-1.5 rounded-lg text-ink-300 hover:text-[#467600] hover:bg-leaf-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Pause / Resume */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(l)}
                              title={l.status === 'active' ? 'Pause Listing' : 'Resume Listing'}
                              className="p-1.5 rounded-lg text-ink-300 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              {l.status === 'active' ? (
                                <PauseCircle className="w-4 h-4" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-leaf-600" />
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeletingListing(l)}
                              title="Delete Reseller Link"
                              className="p-1.5 rounded-lg text-ink-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* QUICK EDIT MODAL (Pehle jaisa simple and responsive popup) */}
      {/* ------------------------------------------------------------- */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-leaf-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-leaf-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-leaf-100 text-[#467600] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#0B1019]">Quick Edit Listing</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                className="w-8 h-8 rounded-xl bg-canvas hover:bg-canvas-200 text-ink-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-ink-600 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-200 text-xs font-bold text-[#0B1019] focus:outline-none focus:border-[#467600]"
                />
              </div>

              <div>
                <label className="block font-bold text-ink-600 mb-1">Your Selling Price (₹)</label>
                <input
                  type="number"
                  min={editingListing.basePrice + 1}
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-200 text-sm font-black text-[#0B1019] focus:outline-none focus:border-[#467600]"
                />
                <div className="mt-1.5 p-2 rounded-xl bg-leaf-50/70 border border-leaf-100 flex items-center justify-between text-[11px]">
                  <span className="text-ink-400 font-medium">Wholesale Base: ₹{editingListing.basePrice}</span>
                  <span className="font-black text-leaf-600">
                    Your Margin: +₹{Math.max(0, editPrice - editingListing.basePrice)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2.5 rounded-xl border border-canvas-200 text-xs font-bold text-ink-500 hover:bg-canvas-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#467600] to-[#9AE600] text-white text-xs font-black shadow-md hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL (Requested feature!) */}
      {/* ------------------------------------------------------------- */}
      {deletingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-leaf-100 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-leaf-100 text-leaf-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#0B1019]">Delete Reseller Link?</h3>
              <p className="text-xs text-ink-400 font-medium">
                Are you sure you want to permanently delete &ldquo;{deletingListing.customTitle}&rdquo;?
              </p>
              <p className="text-[11px] text-red-600 font-mono mt-1">
                /r/{deletingListing.slug} will stop accepting orders.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingListing(null)}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl border border-canvas-200 text-xs font-bold text-ink-500 hover:bg-canvas-50 transition-colors"
              >
                Keep Link
              </button>
              <button
                type="button"
                onClick={handleDeleteListing}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SOCIAL SHARE MODAL */}
      {/* ------------------------------------------------------------- */}
      {shareListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-leaf-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-leaf-100 text-[#467600] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#0B1019]">Share Reseller Listing</h3>
              </div>
              <button
                onClick={() => setShareListing(null)}
                className="w-8 h-8 rounded-xl bg-canvas hover:bg-canvas-200 text-ink-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-leaf-50/60 border border-leaf-100 flex items-center gap-3">
              {shareListing.coverImage && (
                <img
                  src={shareListing.coverImage}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-[#0B1019] truncate">{shareListing.customTitle}</h4>
                <p className="text-[11px] text-leaf-600 font-black">
                  Price: ₹{shareListing.resalePrice} (Your Margin: +₹{shareListing.grossMargin})
                </p>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={typeof window !== 'undefined' ? getWhatsAppShareUrl(shareListing, window.location.origin) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#9AE600] text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Share</span>
              </a>

              <button
                type="button"
                onClick={() => handleNativeShare(shareListing)}
                className="py-3 px-4 rounded-xl bg-ink hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Device Share</span>
              </button>
            </div>

            {/* Copy Promotional Caption */}
            <div className="space-y-2 pt-2 border-t border-leaf-100">
              <label className="text-[11px] font-black uppercase tracking-wider text-ink-400 block">
                Ready-to-Post Promotional Caption
              </label>
              <div className="p-3 rounded-xl bg-canvas-50 border border-canvas-200 text-[11px] text-ink-600 whitespace-pre-line font-mono max-h-36 overflow-y-auto">
                {typeof window !== 'undefined' ? generateShareText(shareListing, window.location.origin) : ''}
              </div>
              <button
                onClick={() => handleCopyCaption(shareListing)}
                className="w-full py-2.5 rounded-xl bg-leaf-100 hover:bg-leaf-200 text-[#467600] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-leaf-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption & Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
