import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  Plus,
  ExternalLink,
  Film,
  Video,
  Play,
  Check,
  X,
  Trash2,
  Eye,
  Link2,
  FolderOpen,
  Image as ImageIcon,
  Sparkles,
  Heart,
  Radio,
  Edit2,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { ContentItem, ReelItem, Product } from '../api/types';
import { formatDate } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import DataTable, { Column } from '../components/common/DataTable';
import ImageUploadField from '../components/common/ImageUploadField';

export default function Content() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'reels' | 'pages'>('reels');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<ReelItem | null>(null);
  const [activePreviewReel, setActivePreviewReel] = useState<ReelItem | null>(null);

  // Form State for Adding / Uploading Reel
  const [reelForm, setReelForm] = useState({
    title: '',
    videoUrl: '',
    poster: '',
    category: 'AI Reels',
    bundleSlug: '',
    bundleTitle: '',
    bundlePrice: 59,
    bundleOriginalPrice: 499,
    reelCount: 1000,
    isActive: true,
    likes: 0,
    views: 15,
  });

  // Query: Pages & Content
  const { data: contentList = [], isLoading: isPagesLoading } = useQuery({
    queryKey: ['content'],
    queryFn: () => portalApi.getContent(),
  });

  // Query: Store Reels
  const { data: reelsList = [], isLoading: isReelsLoading } = useQuery({
    queryKey: ['reels'],
    queryFn: () => portalApi.getReels(),
  });

  // Query: Products (for linking bundle to reel)
  const { data: productsList = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => portalApi.getProducts(),
  });

  // Parse video URL to detect YouTube vs Direct
  const parsedVideo = portalApi.parseVideoUrl(reelForm.videoUrl);

  // Auto-fill poster from YouTube if available
  const handleVideoUrlChange = (url: string) => {
    const parsed = portalApi.parseVideoUrl(url);
    setReelForm((prev) => {
      let nextPoster = prev.poster;
      if (!nextPoster && parsed.youtubeId) {
        nextPoster = `https://img.youtube.com/vi/${parsed.youtubeId}/hqdefault.jpg`;
      }
      return {
        ...prev,
        videoUrl: url,
        poster: nextPoster,
      };
    });
  };

  // Direct video file upload from local machine
  const handleDirectVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await portalApi.uploadMedia(file);
      setReelForm((prev) => ({
        ...prev,
        videoUrl: res.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      success('Video File Loaded', `${file.name} ready to publish.`);
    } catch {
      error('Upload Failed', 'Could not load video file.');
    }
  };

  // Create Reel Mutation
  const createReelMutation = useMutation({
    mutationFn: (reel: Partial<ReelItem>) => portalApi.createReel(reel),
    onSuccess: (created) => {
      queryClient.setQueryData(['reels'], (old: ReelItem[] = []) => [created, ...old]);
      success('Reel Published', `"${created.title}" is now active in your store's Reels feed!`);
      setIsModalOpen(false);
      setReelForm({
        title: '',
        videoUrl: '',
        poster: '',
        category: 'AI Reels',
        bundleSlug: '',
        bundleTitle: '',
        bundlePrice: 59,
        bundleOriginalPrice: 499,
        reelCount: 1000,
        isActive: true,
        likes: 0,
        views: 15,
      });
    },
    onError: (err: any) => error('Creation Failed', err.message || 'Could not save reel.'),
  });

  // Delete Reel Mutation
  const deleteReelMutation = useMutation({
    mutationFn: (id: string) => portalApi.deleteReel(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['reels'], (old: ReelItem[] = []) =>
        old.filter((r) => r.id !== deletedId)
      );
      success('Reel Removed', 'Reel removed from storefront.');
    },
    onError: (err: any) => error('Delete Failed', err.message || 'Could not delete reel.'),
  });

  // Toggle Active Status Mutation
  const toggleReelMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      portalApi.updateReel(id, { isActive }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['reels'], (old: ReelItem[] = []) =>
        old.map((r) => (r.id === updated.id ? { ...r, isActive: updated.isActive } : r))
      );
      success(
        updated.isActive ? 'Reel Enabled' : 'Reel Hidden',
        `Reel is now ${updated.isActive ? 'live' : 'hidden'} on store.`
      );
    },
  });

  // Update Reel Mutation
  const updateReelMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ReelItem> }) =>
      portalApi.updateReel(id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(['reels'], (old: ReelItem[] = []) =>
        old.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
      );
      success('Reel Updated', `"${updated.title}" changes saved successfully.`);
      setIsModalOpen(false);
      setEditingReel(null);
    },
    onError: (err: any) => error('Update Failed', err.message || 'Could not update reel details.'),
  });

  const handleSubmitReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.title.trim() || !reelForm.videoUrl.trim()) {
      error('Missing Details', 'Title and Video URL are required.');
      return;
    }

    const payload = {
      title: reelForm.title.trim(),
      videoUrl: reelForm.videoUrl.trim(),
      poster: reelForm.poster.trim(),
      category: reelForm.category,
      bundleSlug: reelForm.bundleSlug || undefined,
      bundleTitle: reelForm.bundleTitle || undefined,
      bundlePrice: Number(reelForm.bundlePrice || 59),
      bundleOriginalPrice: Number(reelForm.bundleOriginalPrice || 499),
      reelCount: Number(reelForm.reelCount || 1000),
      isActive: reelForm.isActive,
      likes: Number(reelForm.likes || 0),
      views: Number(reelForm.views || 15),
    };

    if (editingReel) {
      updateReelMutation.mutate({ id: editingReel.id, updates: payload });
    } else {
      createReelMutation.mutate(payload);
    }
  };

  const handleSelectProduct = (slug: string) => {
    const prod = productsList.find((p) => p.slug === slug);
    if (prod) {
      setReelForm((prev) => ({
        ...prev,
        bundleSlug: prod.slug,
        bundleTitle: prod.name,
        bundlePrice: prod.price,
        bundleOriginalPrice: prod.regular_price || prod.price * 5,
        reelCount: prod.reel_count || 1000,
        category: prod.categories?.[0] || prev.category,
      }));
    } else {
      setReelForm((prev) => ({
        ...prev,
        bundleSlug: '',
        bundleTitle: '',
      }));
    }
  };

  const pageColumns: Column<ContentItem>[] = [
    {
      header: 'Title & Slug',
      accessorKey: 'title',
      cell: (item) => (
        <div>
          <div className="font-bold text-white text-xs">{item.title}</div>
          <div className="text-[11px] text-slate-400 font-mono">/{item.slug}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      cell: (item) => (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700">
          {item.type}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
            item.status === 'publish'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: 'Last Modified',
      cell: (item) => <span className="text-slate-400 text-xs">{formatDate(item.date_modified)}</span>,
    },
    {
      header: 'View on Store',
      cell: (item) => (
        <a
          href={`/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors inline-block"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Content & Video Reels</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              Live Feed
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Manage your store's video reels feed (YouTube Shorts, YouTube videos & hosted MP4 streams), plus legal pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add Reel Button */}
          <button
            onClick={() => {
              setEditingReel(null);
              setReelForm({
                title: '',
                videoUrl: '',
                poster: '',
                category: 'AI Reels',
                bundleSlug: '',
                bundleTitle: '',
                bundlePrice: 59,
                bundleOriginalPrice: 499,
                reelCount: 1000,
                isActive: true,
                likes: 0,
                views: 15,
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add / Upload Reel</span>
          </button>

          {/* View Live Store Reels Feed */}
          <a
            href="/reels"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Live Feed</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
          </a>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reels'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels Feed & Video Previews ({reelsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pages'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Legal Pages & Policies ({contentList.length})</span>
        </button>
      </div>

      {/* TAB 1: REELS MANAGEMENT */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          
          {/* Quick Info Alert */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Universal Video Player Active</h4>
                <p className="text-[11px] text-slate-400">
                  You can input <strong>YouTube Shorts</strong>, standard <strong>YouTube links</strong>, or direct <strong>hosted MP4 URLs</strong>. They play smoothly on the homepage and at <code className="text-purple-300">/reels</code>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 self-start sm:self-auto"
            >
              Add Video Now
            </button>
          </div>

          {/* Reels Cards Grid */}
          {isReelsLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading reels from Firestore...</div>
          ) : reelsList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Video Reels Added Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add your first YouTube Short or hosted video reel to show in your store's vertical video feed.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
              >
                + Add First Reel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {reelsList.map((reel) => {
                const isYt = reel.videoType === 'youtube' || reel.youtubeId;
                const embedPreviewUrl = isYt && reel.youtubeId
                  ? `https://www.youtube-nocookie.com/embed/${reel.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${reel.youtubeId}&controls=1`
                  : null;

                return (
                  <div
                    key={reel.id}
                    className={`rounded-3xl bg-slate-900/90 border transition-all overflow-hidden flex flex-col justify-between group ${
                      reel.isActive ? 'border-slate-800 hover:border-purple-500/50' : 'border-rose-900/40 opacity-70'
                    }`}
                  >
                    {/* Video / Poster Frame (9:16 vertical ratio) */}
                    <div className="relative aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
                      {activePreviewReel?.id === reel.id ? (
                        isYt && embedPreviewUrl ? (
                          <iframe
                            src={embedPreviewUrl}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={reel.videoUrl}
                            autoPlay
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <>
                          <img
                            src={
                              reel.poster ||
                              (reel.youtubeId
                                ? `https://img.youtube.com/vi/${reel.youtubeId}/hqdefault.jpg`
                                : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600')
                            }
                            alt={reel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
                            }}
                          />
                          {/* Play Overlay */}
                          <div
                            onClick={() => setActivePreviewReel(reel)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Badges on Top */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
                            isYt
                              ? 'bg-red-600/80 text-white border border-red-500/30'
                              : 'bg-purple-600/80 text-white border border-purple-500/30'
                          }`}
                        >
                          {isYt ? 'YouTube' : 'Direct Video'}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/70 text-slate-200 backdrop-blur-md">
                          {reel.category || 'Reel'}
                        </span>
                      </div>

                      {/* Close player button if playing */}
                      {activePreviewReel?.id === reel.id && (
                        <button
                          onClick={() => setActivePreviewReel(null)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 text-white hover:bg-black z-30"
                          title="Close Player"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Card Content & Actions */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-xs line-clamp-1">{reel.title}</h3>
                        {reel.bundleTitle && (
                          <p className="text-[11px] text-purple-400 font-medium truncate mt-0.5">
                            Linked: {reel.bundleTitle} (₹{reel.bundlePrice})
                          </p>
                        )}
                      </div>

                      {/* Status & Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>{reel.likes || 1200}</span>
                        </div>

                        {/* Status Toggle */}
                        <button
                          onClick={() =>
                            toggleReelMutation.mutate({ id: reel.id, isActive: !reel.isActive })
                          }
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase transition-colors ${
                            reel.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          }`}
                        >
                          {reel.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <a
                          href="/reels"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Test on Feed</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingReel(reel);
                              setReelForm({
                                title: reel.title,
                                videoUrl: reel.videoUrl,
                                poster: reel.poster || '',
                                category: reel.category || 'AI Reels',
                                bundleSlug: reel.bundleSlug || '',
                                bundleTitle: reel.bundleTitle || '',
                                bundlePrice: reel.bundlePrice || 59,
                                bundleOriginalPrice: reel.bundleOriginalPrice || 499,
                                reelCount: reel.reelCount || 1000,
                                isActive: reel.isActive,
                                likes: reel.likes || 0,
                                views: reel.views || 15,
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                            title="Edit Reel"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete reel "${reel.title}"?`)) {
                                deleteReelMutation.mutate(reel.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Reel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: LEGAL PAGES & CONTENT */}
      {activeTab === 'pages' && (
        <DataTable
          columns={pageColumns}
          data={contentList}
          searchKey="title"
          searchPlaceholder="Search legal pages or articles..."
          isLoading={isPagesLoading}
        />
      )}

      {/* MODAL: ADD / UPLOAD NEW REEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-900/30 my-8">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingReel(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {editingReel ? `Edit Reel: "${editingReel.title}"` : 'Add Video Reel to Store Feed'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingReel
                    ? 'Update video streaming URL, poster, category, or linked bundle pricing'
                    : 'Input YouTube Shorts, YouTube URL or direct MP4 video link to stream in Reels section'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitReel} className="space-y-5">
              
              {/* 1. Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Reel Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1000+ Ulti Dunia Twisted World Viral Reel"
                  value={reelForm.title}
                  onChange={(e) => setReelForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-white focus:outline-none"
                />
              </div>

              {/* 2. Video Link (YouTube Shorts / Hosted Video URL) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Video URL (YouTube or Hosted Video) *
                  </label>
                  <label className="cursor-pointer text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Or Pick Local Video File</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/*"
                      onChange={handleDirectVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                  <Link2 className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/shorts/... OR https://.../video.mp4"
                    value={reelForm.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Video Type Detection Indicator */}
                {reelForm.videoUrl && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                        parsedVideo.videoType === 'youtube'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {parsedVideo.videoType === 'youtube'
                        ? `YouTube Detected (${parsedVideo.youtubeId})`
                        : 'Direct Hosted Video Stream'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Plays natively in 9:16 vertical feed
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Live Video Preview Inside Modal */}
              {reelForm.videoUrl && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400">Live Video Preview:</div>
                  <div className="w-44 aspect-[9/16] mx-auto rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-md">
                    {parsedVideo.videoType === 'youtube' && parsedVideo.embedUrl ? (
                      <iframe
                        src={parsedVideo.embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={reelForm.videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* 4. Thumbnail / Poster Image URL with ImgBB Gallery Upload */}
              <ImageUploadField
                label="Poster / Thumbnail Image"
                value={reelForm.poster}
                onChange={(url) => setReelForm((prev) => ({ ...prev, poster: url }))}
                placeholder="Auto-detected from YouTube or custom image URL"
                helperText="Upload custom reel cover poster from device gallery (.PNG, .JPG, .JPEG) or let it auto-detect from YouTube."
              />

              {/* 5. Category & Linked Bundle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={reelForm.category}
                    onChange={(e) => setReelForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="AI Reels">AI Reels</option>
                    <option value="Luxury & Motivation">Luxury & Motivation</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="Comedy Reels">Comedy Reels</option>
                    <option value="Story Reels">Story Reels</option>
                    <option value="Street Food">Street Food</option>
                    <option value="Animals Reels">Animals Reels</option>
                    <option value="Sanatan & Spiritual">Sanatan & Spiritual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Attach to Product Bundle (For Direct "Buy Now")
                  </label>
                  <select
                    value={reelForm.bundleSlug}
                    onChange={(e) => handleSelectProduct(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="">-- No Attached Bundle --</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. Visibility Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Reel Feed Visibility</h4>
                  <p className="text-[11px] text-slate-400">Stream this reel on store homepage and /reels feed</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReelForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    reelForm.isActive
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {reelForm.isActive ? 'Active (Live)' : 'Draft (Hidden)'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReel(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createReelMutation.isPending || updateReelMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {createReelMutation.isPending || updateReelMutation.isPending ? (
                    <span>Saving Reel...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingReel ? 'Save Reel Changes' : 'Publish Reel to Store'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
