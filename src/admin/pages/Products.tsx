import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  FileCode,
  Edit2,
  Check,
  X,
  ExternalLink,
  Key,
  Download,
  HardDrive,
  Film,
  Plus,
  Trash2,
  FolderOpen,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Tag,
  Layers,
  Search,
  Star,
  Flame,
  ShieldCheck,
  HelpCircle,
  Video,
  Copy,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { Product, CategoryItem } from '../api/types';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import DataTable, { Column } from '../components/common/DataTable';

export default function Products() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'digital' | 'categories'>('all');
  const [generatedTokens, setGeneratedTokens] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [categorySearch, setCategorySearch] = useState<string>('');

  // ==========================================
  // 1. DATA QUERIES
  // ==========================================
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => portalApi.getProducts(),
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => portalApi.getCategories(),
  });

  // ==========================================
  // 2. CREATE PRODUCT MODAL STATE
  // ==========================================
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [addTab, setAddTab] = useState<'basic' | 'media' | 'details' | 'files'>('basic');
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    price: 99,
    regular_price: 999,
    reseller_price: 199,
    reseller_regular_price: 1999,
    status: 'publish' as Product['status'],
    stock_status: 'instock' as Product['stock_status'],
    category: 'Trending Reels',
    reel_count: 1000,
    format: 'MP4',
    resolution: '1080P Full HD (9:16)',
    featured_image: '',
    preview_video_url: '',
    gallery_images_text: '',
    short_description: '',
    description: '',
    features_text: '',
    google_drive_link: '',
    file_name: '',
    drive_files: [
      {
        id: 'file-1',
        name: '',
        file_url: '',
      },
    ] as Array<{ id: string; name: string; file_url: string }>,
    is_hot: false,
    is_trending: false,
    rating: 5,
    review_count: 443,
  });

  // ==========================================
  // 3. FULL PRODUCT EDIT MODAL STATE
  // ==========================================
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTab, setEditTab] = useState<'basic' | 'media' | 'details' | 'files'>('basic');
  const [editForm, setEditForm] = useState<{
    name: string;
    slug: string;
    price: number;
    regular_price: number;
    reseller_price: number;
    reseller_regular_price: number;
    status: Product['status'];
    stock_status: Product['stock_status'];
    category: string;
    reel_count: number;
    format: string;
    resolution: string;
    featured_image: string;
    preview_video_url: string;
    gallery_images_text: string;
    short_description: string;
    description: string;
    features_text: string;
    google_drive_link: string;
    file_name: string;
    drive_files: Array<{ id: string; name: string; file_url: string }>;
    is_hot: boolean;
    is_trending: boolean;
    rating: number;
    review_count: number;
  }>({
    name: '',
    slug: '',
    price: 99,
    regular_price: 999,
    reseller_price: 199,
    reseller_regular_price: 1999,
    status: 'publish',
    stock_status: 'instock',
    category: 'Trending Reels',
    reel_count: 1000,
    format: 'MP4',
    resolution: '1080P Full HD',
    featured_image: '',
    preview_video_url: '',
    gallery_images_text: '',
    short_description: '',
    description: '',
    features_text: '',
    google_drive_link: '',
    file_name: '',
    drive_files: [{ id: 'file-1', name: '', file_url: '' }],
    is_hot: false,
    is_trending: false,
    rating: 4.9,
    review_count: 350,
  });

  // ==========================================
  // 4. CATEGORY MODALS STATE
  // ==========================================
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    count: 0,
    icon: '✨',
  });

  // ==========================================
  // 5. MUTATIONS
  // ==========================================
  const createMutation = useMutation({
    mutationFn: (newProd: Partial<Product>) => portalApi.createProduct(newProd),
    onSuccess: (created) => {
      queryClient.setQueryData(['products'], (old: Product[] = []) => [created, ...old]);
      success('Product Published', `"${created.name}" is now live in store.`);
      setIsCreateModalOpen(false);
      setAddTab('basic');
      setCreateForm({
        name: '',
        slug: '',
        price: 99,
        regular_price: 999,
        reseller_price: 199,
        reseller_regular_price: 1999,
        status: 'publish',
        stock_status: 'instock',
        category: categories[0]?.name || 'Trending Reels',
        reel_count: 1000,
        format: 'MP4',
        resolution: '1080P Full HD (9:16)',
        featured_image: '',
        preview_video_url: '',
        gallery_images_text: '',
        short_description: '',
        description: '',
        features_text: '',
        google_drive_link: '',
        file_name: '',
        drive_files: [{ id: 'file-1', name: '', file_url: '' }],
        is_hot: false,
        is_trending: false,
        rating: 5,
        review_count: 443,
      });
    },
    onError: (err: any) => error('Creation Failed', err.message || 'Could not save product.'),
  });

  const updateMutation = useMutation({
    mutationFn: (updated: Partial<Product> & { id: string | number }) =>
      portalApi.updateProduct(updated),
    onSuccess: (updated) => {
      queryClient.setQueryData(['products'], (old: Product[] = []) =>
        old.map((p) => (String(p.id) === String(updated.id) ? { ...p, ...updated } : p))
      );
      success('Product Updated', `All details saved successfully for "${updated.name || updated.id}"`);
      setEditingProduct(null);
    },
    onError: (err: any) => {
      error('Update Failed', err.message || 'Could not update product details.');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id, slug }: { id: string | number; slug?: string }) =>
      portalApi.deleteProduct(id, slug),
    onSuccess: (_, { id, slug }) => {
      queryClient.setQueryData(['products'], (old: Product[] = []) =>
        old.filter(
          (p) =>
            String(p.id) !== String(id) &&
            (!slug || p.slug?.toLowerCase() !== String(slug).toLowerCase())
        )
      );
      success('Product Deleted', 'Bundle permanently removed from catalog.');
    },
    onError: (err: any) => error('Delete Failed', err.message || 'Could not delete product.'),
  });

  const createCategoryMutation = useMutation({
    mutationFn: (newCat: Partial<CategoryItem>) => portalApi.createCategory(newCat),
    onSuccess: (created) => {
      queryClient.setQueryData(['categories'], (old: CategoryItem[] = []) => [created, ...old]);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      success('Category Created', `"${created.name}" is now available for bundles.`);
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', slug: '', description: '', count: 0, icon: '✨' });
    },
    onError: (err: any) => error('Category Failed', err.message || 'Could not save category.'),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (cat: Partial<CategoryItem> & { id?: string; slug?: string }) =>
      portalApi.updateCategory(cat),
    onSuccess: (updated) => {
      queryClient.setQueryData(['categories'], (old: CategoryItem[] = []) =>
        old.map((c) => (c.slug === updated.slug || c.id === updated.id ? { ...c, ...updated } : c))
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      success('Category Updated', `Updated details for "${updated.name || updated.slug}".`);
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    },
    onError: (err: any) => error('Update Failed', err.message || 'Could not update category.'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (slugOrId: string) => portalApi.deleteCategory(slugOrId),
    onSuccess: (_, deletedKey) => {
      const lowKey = String(deletedKey || '').toLowerCase();
      queryClient.setQueryData(['categories'], (old: CategoryItem[] = []) =>
        old.filter(
          (c) =>
            (c.slug || '').toLowerCase() !== lowKey &&
            (c.id || '').toLowerCase() !== lowKey
        )
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      success('Category Deleted', 'Category permanently removed from store and admin panel.');
    },
    onError: (err: any) => error('Delete Failed', err.message || 'Could not delete category.'),
  });

  // ==========================================
  // 6. HANDLERS
  // ==========================================
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditTab('basic');

    // Initialize drive files from prod.files, or fallback to prod.google_drive_link
    let initialDriveFiles: Array<{ id: string; name: string; file_url: string }> = [];
    if (prod.files && Array.isArray(prod.files) && prod.files.length > 0) {
      initialDriveFiles = prod.files
        .filter((f) => Boolean(f && (f.file_url || f.name)))
        .map((f, idx) => ({
          id: f.id || `file-${idx + 1}-${Date.now()}`,
          name: f.name || `${prod.name} Part ${idx + 1}`,
          file_url: f.file_url || '',
        }));
    }
    if (initialDriveFiles.length === 0) {
      const fallbackUrl = prod.google_drive_link || '';
      initialDriveFiles = [
        {
          id: `file-1-${Date.now()}`,
          name: `${prod.name} Google Drive Access`,
          file_url: fallbackUrl,
        },
      ];
    }

    const primaryFile = initialDriveFiles[0];
    const driveLink = primaryFile?.file_url || prod.google_drive_link || '';
    const fileName = primaryFile?.name || `${prod.name} Google Drive Access`;

    setEditForm({
      name: prod.name || '',
      slug: prod.slug || '',
      price: prod.price || 99,
      regular_price: prod.regular_price || 999,
      reseller_price: prod.reseller_price || 199,
      reseller_regular_price: prod.reseller_regular_price || 1999,
      status: prod.status || 'publish',
      stock_status: prod.stock_status || 'instock',
      category: prod.categories?.[0] || 'Trending Reels',
      reel_count: prod.reel_count || 1000,
      format: prod.format || 'MP4',
      resolution: prod.resolution || '1080P Full HD (9:16)',
      featured_image: prod.featured_image || '',
      preview_video_url: prod.preview_video_url || '',
      gallery_images_text: (prod.gallery_images || []).join('\n'),
      short_description: prod.short_description || '',
      description: prod.description || '',
      features_text: (prod.features || []).join('\n'),
      google_drive_link: driveLink,
      file_name: fileName,
      drive_files: initialDriveFiles,
      is_hot: Boolean(prod.is_hot),
      is_trending: Boolean(prod.is_trending),
      rating: prod.rating || 4.9,
      review_count: prod.review_count || 350,
    });
  };

  const handleAddEditDriveFile = () => {
    setEditForm((prev) => ({
      ...prev,
      drive_files: [
        ...prev.drive_files,
        {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `Part ${prev.drive_files.length + 1}`,
          file_url: '',
        },
      ],
    }));
  };

  const handleRemoveEditDriveFile = (index: number) => {
    setEditForm((prev) => {
      if (prev.drive_files.length <= 1) return prev;
      const updated = prev.drive_files.filter((_, i) => i !== index);
      return {
        ...prev,
        drive_files: updated,
        google_drive_link: updated[0]?.file_url || '',
        file_name: updated[0]?.name || '',
      };
    });
  };

  const handleUpdateEditDriveFile = (index: number, field: 'name' | 'file_url', val: string) => {
    setEditForm((prev) => {
      const updated = [...prev.drive_files];
      updated[index] = { ...updated[index], [field]: val };
      return {
        ...prev,
        drive_files: updated,
        google_drive_link: updated[0]?.file_url || '',
        file_name: updated[0]?.name || '',
      };
    });
  };

  const handleAddCreateDriveFile = () => {
    setCreateForm((prev) => ({
      ...prev,
      drive_files: [
        ...prev.drive_files,
        {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `Part ${prev.drive_files.length + 1}`,
          file_url: '',
        },
      ],
    }));
  };

  const handleRemoveCreateDriveFile = (index: number) => {
    setCreateForm((prev) => {
      if (prev.drive_files.length <= 1) return prev;
      const updated = prev.drive_files.filter((_, i) => i !== index);
      return {
        ...prev,
        drive_files: updated,
        google_drive_link: updated[0]?.file_url || '',
        file_name: updated[0]?.name || '',
      };
    });
  };

  const handleUpdateCreateDriveFile = (index: number, field: 'name' | 'file_url', val: string) => {
    setCreateForm((prev) => {
      const updated = [...prev.drive_files];
      updated[index] = { ...updated[index], [field]: val };
      return {
        ...prev,
        drive_files: updated,
        google_drive_link: updated[0]?.file_url || '',
        file_name: updated[0]?.name || '',
      };
    });
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const galleryImages = editForm.gallery_images_text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const features = editForm.features_text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const validDriveFiles = editForm.drive_files
      .map((f, idx) => ({
        id: f.id || `file-${idx + 1}-${Date.now()}`,
        name: f.name.trim() || `${editForm.name.trim()} Part ${idx + 1}`,
        file_url: f.file_url.trim(),
      }))
      .filter((f) => Boolean(f.file_url));

    if (validDriveFiles.length === 0 && editForm.google_drive_link.trim()) {
      validDriveFiles.push({
        id: editingProduct.files?.[0]?.id || `file-${Date.now()}`,
        name: editForm.file_name.trim() || `${editForm.name.trim()} Google Drive Access`,
        file_url: editForm.google_drive_link.trim(),
      });
    }

    const primaryDriveLink = validDriveFiles[0]?.file_url || editForm.google_drive_link.trim();

    updateMutation.mutate({
      id: editingProduct.id,
      name: editForm.name.trim(),
      slug: editForm.slug.trim(),
      price: Number(editForm.price),
      regular_price: Number(editForm.regular_price),
      reseller_price: Number(editForm.reseller_price),
      reseller_regular_price: Number(editForm.reseller_regular_price),
      sale_price: Number(editForm.price),
      status: editForm.status,
      stock_status: editForm.stock_status,
      categories: [editForm.category.trim()],
      reel_count: Number(editForm.reel_count),
      format: editForm.format.trim(),
      resolution: editForm.resolution.trim(),
      featured_image: editForm.featured_image.trim(),
      preview_video_url: editForm.preview_video_url.trim(),
      gallery_images: galleryImages,
      short_description: editForm.short_description.trim(),
      description: editForm.description.trim(),
      features: features.length > 0 ? features : undefined,
      google_drive_link: primaryDriveLink,
      files: validDriveFiles,
      is_hot: editForm.is_hot,
      is_trending: editForm.is_trending,
      rating: Number(editForm.rating),
      review_count: Number(editForm.review_count),
    });
  };

  const handleDeleteProduct = (prod: Product) => {
    if (confirm(`Permanently delete bundle "${prod.name}"? This cannot be undone.`)) {
      deleteProductMutation.mutate({ id: prod.id, slug: prod.slug });
    }
  };

  const handleGenerateToken = async (fileId: string) => {
    try {
      const res = await portalApi.generateFileToken(fileId);
      setGeneratedTokens((prev) => ({ ...prev, [fileId]: res.download_url }));
      success('Stream Token Issued', 'Valid for 60 minutes for high-speed streaming.');
    } catch {
      error('Token Failed', 'Unable to generate secure download token.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    success('Copied!', 'Link copied to clipboard.');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '', description: '', count: 0, icon: '✨' });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      count: cat.count || 0,
      icon: cat.icon || '✨',
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setCategoryForm((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : autoSlug,
    }));
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      error('Missing Name', 'Category name is required.');
      return;
    }

    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id || editingCategory.slug,
        slug: categoryForm.slug.trim(),
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        icon: categoryForm.icon?.trim() || '✨',
        count: Number(categoryForm.count || 0),
      });
    } else {
      createCategoryMutation.mutate({
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim(),
        description: categoryForm.description.trim(),
        icon: categoryForm.icon?.trim() || '✨',
        count: Number(categoryForm.count || 0),
      });
    }
  };

  const handleDeleteCategory = (cat: CategoryItem) => {
    const key = cat.slug || cat.id || '';
    if (!key) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete category "${cat.name}" (/category/${cat.slug}) from your store?\n\nThis will remove it from both the Storefront and the Admin Panel.`
      )
    ) {
      deleteCategoryMutation.mutate(key);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.price) {
      setAddTab('basic');
      error('Missing Details', 'Bundle name and price are required.');
      return;
    }

    const autoSlug =
      createForm.slug.trim() ||
      createForm.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const galleryImages = createForm.gallery_images_text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const features = createForm.features_text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const validDriveFiles = createForm.drive_files
      .map((f, idx) => ({
        id: f.id || `file-${idx + 1}-${Date.now()}`,
        name: f.name.trim() || `${createForm.name.trim()} Part ${idx + 1}`,
        file_url: f.file_url.trim(),
      }))
      .filter((f) => Boolean(f.file_url));

    if (validDriveFiles.length === 0 && createForm.google_drive_link.trim()) {
      validDriveFiles.push({
        id: `file-${Date.now()}`,
        name: createForm.file_name.trim() || `${createForm.name.trim()} Google Drive Access`,
        file_url: createForm.google_drive_link.trim(),
      });
    }

    const primaryDriveLink = validDriveFiles[0]?.file_url || createForm.google_drive_link.trim();

    createMutation.mutate({
      name: createForm.name.trim(),
      slug: autoSlug,
      price: Number(createForm.price),
      regular_price: Number(createForm.regular_price || createForm.price * 5),
      reseller_price: Number(createForm.reseller_price || createForm.price * 2),
      reseller_regular_price: Number(createForm.reseller_regular_price || createForm.price * 10),
      sale_price: Number(createForm.price),
      status: createForm.status,
      stock_status: createForm.stock_status,
      categories: [createForm.category.trim() || 'Trending Reels'],
      reel_count: Number(createForm.reel_count || 1000),
      format: createForm.format.trim() || 'MP4',
      resolution: createForm.resolution.trim() || '1080P Full HD (9:16)',
      featured_image:
        createForm.featured_image.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      preview_video_url: createForm.preview_video_url.trim(),
      gallery_images: galleryImages,
      short_description: createForm.short_description.trim(),
      description: createForm.description.trim(),
      features: features.length > 0 ? features : undefined,
      google_drive_link: primaryDriveLink,
      files: validDriveFiles,
      is_hot: createForm.is_hot,
      is_trending: createForm.is_trending,
      rating: Number(createForm.rating || 5),
      review_count: Number(createForm.review_count || 443),
      downloadable: true,
    });
  };

  // Filtered Products for Table
  const filteredProducts = useMemo(() => {
    if (selectedCategoryFilter === 'all') return products;
    return products.filter((p) =>
      p.categories?.some((c) => c.toLowerCase() === selectedCategoryFilter.toLowerCase())
    );
  }, [products, selectedCategoryFilter]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, categorySearch]);

  // ==========================================
  // 7. TABLE COLUMNS
  // ==========================================
  const columns: Column<Product>[] = [
    {
      header: 'Bundle / Product',
      cell: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
            alt={p.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-white text-xs truncate max-w-[260px]">{p.name}</h4>
              {p.is_hot && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5" /> HOT
                </span>
              )}
              {p.is_trending && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  TRENDING
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-1.5 py-0.5 rounded">
                {p.categories?.join(', ') || 'Bundle'}
              </span>
              <span className="text-[10px] text-slate-500">•</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {p.reel_count || 1000}+ Reels
              </span>
              <span className="text-[10px] text-slate-500">•</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{p.resolution || '1080P'}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Pricing (Personal / Reseller)',
      cell: (p) => (
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-white text-xs">{formatCurrency(p.price)}</span>
            {p.regular_price > p.price && (
              <span className="text-[10px] text-slate-500 line-through">
                {formatCurrency(p.regular_price)}
              </span>
            )}
            <span className="text-[9px] text-purple-400 font-semibold uppercase">Personal</span>
          </div>
          {p.reseller_price ? (
            <div className="flex items-baseline gap-1.5 text-[11px] text-amber-400">
              <span className="font-bold">{formatCurrency(p.reseller_price)}</span>
              {p.reseller_regular_price && (
                <span className="text-[9px] text-slate-600 line-through">
                  {formatCurrency(p.reseller_regular_price)}
                </span>
              )}
              <span className="text-[9px] text-amber-400/80 font-semibold uppercase">Reseller</span>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (p) => (
        <div className="flex flex-col gap-1">
          <span
            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider w-fit ${
              p.stock_status === 'instock'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {p.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
          </span>
          <span
            className={`px-2 py-0.2 rounded text-[9px] font-bold w-fit ${
              p.status === 'publish'
                ? 'text-slate-400'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {p.status === 'publish' ? '● Live' : '○ Draft'}
          </span>
        </div>
      ),
    },
    {
      header: 'Drive Download File',
      cell: (p) => {
        const driveLink = p.google_drive_link || p.files?.[0]?.file_url;
        const count = p.files && p.files.length > 0 ? p.files.length : (driveLink ? 1 : 0);
        return count > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-medium truncate max-w-[130px]" title={driveLink}>
              {count > 1 ? `${count} Drive Files` : 'Google Drive Ready'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-amber-400/80">No Link Set</span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      cell: (p) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEditProduct(p)}
            className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all font-bold text-xs flex items-center gap-1.5"
            title="Edit Full Product Page"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Full Page</span>
          </button>
          <a
            href={`/product/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="View Live on Store"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => handleDeleteProduct(p)}
            disabled={deleteProductMutation.isPending}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors disabled:opacity-50"
            title="Delete Bundle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Products, Files & Categories
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-600/30 text-purple-300 border border-purple-500/30">
              {products.length} Bundles Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Complete store catalog management. Edit full product pages, Google Drive delivery files, and all 62 competitor categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Upload New Bundle</span>
          </button>

          <button
            onClick={handleOpenAddCategory}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/30 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Tag className="w-4 h-4 text-purple-400 shrink-0" />
            <span>+ Add Category</span>
          </button>

          {/* Main Tab Switcher */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Bundles ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'digital'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Digital Files & Drive ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'categories'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ALL PRODUCTS TABLE */}
      {/* ========================================================= */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Category Filter Pills Toolbar - Mobile Smooth Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 admin-touch-scroll admin-no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.slice(0, 15).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategoryFilter(cat.name)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryFilter.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name} ({cat.count || 0})
              </button>
            ))}
          </div>

          <DataTable
            columns={columns}
            data={filteredProducts}
            searchKey="name"
            searchPlaceholder="Search all 131 bundles by title, category, format..."
            isLoading={isProductsLoading}
            pageSize={25}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DIGITAL FILES & GOOGLE DRIVE ACCESS */}
      {/* ========================================================= */}
      {activeTab === 'digital' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                <FolderOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Google Drive Digital Delivery System</h4>
                <p className="text-[11px] text-slate-400">
                  All 131 products include high-speed Google Drive download access links delivered to buyers upon Cashfree payment.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0">
              {products.filter((p) => p.google_drive_link || p.files?.length).length} / {products.length} Bundles Configured
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => {
              const driveLink = prod.google_drive_link || prod.files?.[0]?.file_url;
              const primaryFile = prod.files?.[0];

              return (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {prod.categories?.[0] || 'Bundle'}
                        </span>
                        <h3 className="font-bold text-sm text-white mt-1 leading-snug truncate">
                          {prod.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 shrink-0">
                      {formatCurrency(prod.price)}
                    </span>
                  </div>

                  {/* Google Drive Link Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Google Drive Link:</span>
                        {prod.files && prod.files.length > 1 && (
                          <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            {prod.files.length} Files
                          </span>
                        )}
                      </span>
                      {driveLink && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(driveLink)}
                            className="text-[11px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedLink === driveLink ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <a
                            href={driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open Drive</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {prod.files && prod.files.length > 1 ? (
                      <div className="space-y-1.5 pt-1">
                        {prod.files.map((f, fIdx) => (
                          <div
                            key={f.id || fIdx}
                            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] gap-2"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-slate-200 truncate block">
                                {f.name || `File Part #${fIdx + 1}`}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 truncate block">
                                {f.file_url}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleCopy(f.file_url)}
                                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold p-1"
                                title="Copy file URL"
                              >
                                {copiedLink === f.file_url ? 'Copied' : 'Copy'}
                              </button>
                              <a
                                href={f.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline font-bold p-1"
                                title="Open Drive link"
                              >
                                Open
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : driveLink ? (
                      <div className="font-mono text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg truncate border border-slate-800">
                        {driveLink}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400/80 italic bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                        No Google Drive link configured yet. Click "Edit Full Page" to add one.
                      </div>
                    )}

                    {/* Quick Token Generator for Streaming */}
                    {primaryFile && (
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <button
                          onClick={() => handleGenerateToken(primaryFile.id)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                        >
                          <Key className="w-3 h-3" />
                          <span>Generate Cloud Token</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="text-[11px] text-slate-400 hover:text-white font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit File Link</span>
                        </button>
                      </div>
                    )}

                    {primaryFile && generatedTokens[primaryFile.id] && (
                      <div className="pt-2 border-t border-slate-800/60 text-[11px] space-y-1">
                        <div className="text-slate-400">Expiring 60-Min Stream URL:</div>
                        <div className="font-mono text-purple-300 bg-purple-950/40 p-2 rounded truncate border border-purple-800/40">
                          {generatedTokens[primaryFile.id]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CATEGORIES MANAGEMENT (All 62 Competitor Categories) */}
      {/* ========================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/20">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>All Store Categories ({categories.length})</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Mirrored from Competitor (ReelsBundles.in)
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage all 62 categories or add new custom categories. Any category added here immediately appears in product filters and edit modals.
              </p>
            </div>

            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-purple-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Category</span>
            </button>
          </div>

          {/* Search Categories */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search categories by name or slug..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Showing {filteredCategories.length} categories
            </span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.slug}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-base shadow-xs">
                      {cat.icon || '✨'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cat.is_custom && (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                          Custom
                        </span>
                      )}
                      <span className="text-[11px] font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        {cat.count || 0} Bundles
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-white mt-2 group-hover:text-purple-300 transition-colors">
                    {cat.name}
                  </h4>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5 truncate">
                    /{cat.slug}
                  </div>
                  {cat.description && (
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={`/shop?cat=${cat.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-white font-semibold flex items-center gap-1 shrink-0"
                  >
                    <span>View Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors border border-slate-700/60"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      disabled={deleteCategoryMutation.isPending}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-200 font-bold text-xs flex items-center gap-1 transition-colors border border-rose-500/30 disabled:opacity-50"
                      title="Delete Category from Store"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: FULL PRODUCT EDIT MODAL */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-900/40 my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={editForm.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                  alt={editForm.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Edit Product Page
                    </h2>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      #{editingProduct.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Live store URL: <code className="text-purple-300">/product/{editForm.slug}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/product/${editForm.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Preview Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex items-center gap-2 py-3 border-b border-slate-800 overflow-x-auto shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setEditTab('basic')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  editTab === 'basic'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                1. Overview & Pricing
              </button>
              <button
                type="button"
                onClick={() => setEditTab('media')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  editTab === 'media'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                2. Media & Preview Video
              </button>
              <button
                type="button"
                onClick={() => setEditTab('details')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  editTab === 'details'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                3. Content & Descriptions
              </button>
              <button
                type="button"
                onClick={() => setEditTab('files')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  editTab === 'files'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                4. Google Drive Download Links ({editForm.drive_files.length})
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProductEdit} className="overflow-y-auto py-5 pr-1 space-y-5 flex-1">
              {/* TAB A: OVERVIEW & PRICING */}
              {editTab === 'basic' && (
                <div className="space-y-4">
                  {/* Name and Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Bundle Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        URL Slug *
                      </label>
                      <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                        <span className="text-xs text-slate-500 font-mono">/product/</span>
                        <input
                          type="text"
                          required
                          value={editForm.slug}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, slug: e.target.value }))}
                          className="w-full bg-transparent text-xs font-mono font-semibold text-purple-300 focus:outline-none pl-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Primary Category *
                      </label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Visibility Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      >
                        <option value="publish">Publish (Visible to Buyers)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Stock Status
                      </label>
                      <select
                        value={editForm.stock_status}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, stock_status: e.target.value as any }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      >
                        <option value="instock">In Stock</option>
                        <option value="outofstock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Personal License */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                          Personal License
                        </span>
                        <span className="text-[10px] text-slate-500">For personal use</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Sale Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={editForm.price}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-black text-emerald-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Regular MRP (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.regular_price}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, regular_price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reseller License */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          Reseller Commercial License
                        </span>
                        <span className="text-[10px] text-slate-500">With resale rights</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Reseller Price (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.reseller_price}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, reseller_price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-black text-amber-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Reseller MRP (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.reseller_regular_price}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, reseller_regular_price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.is_hot}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, is_hot: e.target.checked }))}
                        className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-400" />
                          <span>Show "HOT / Best Seller" Badge</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Highlights this bundle on shop page</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.is_trending}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, is_trending: e.target.checked }))}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Show "Trending" Badge</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Adds trending tag on thumbnail</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB B: MEDIA & PREVIEW VIDEO */}
              {editTab === 'media' && (
                <div className="space-y-4">
                  {/* Featured Image */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Cover Thumbnail Image URL *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                        <ImageIcon className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
                        <input
                          type="url"
                          required
                          value={editForm.featured_image}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, featured_image: e.target.value }))}
                          placeholder="https://images.unsplash.com/... or https://..."
                          className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      {editForm.featured_image && (
                        <img
                          src={editForm.featured_image}
                          alt="Cover Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Preview Video URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Video Preview URL (YouTube Shorts, YouTube Video, or Direct MP4)</span>
                      <span className="text-[10px] text-purple-400">Plays when buyer clicks "View Preview"</span>
                    </label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                      <Video className="w-4 h-4 text-rose-400 mr-2 shrink-0" />
                      <input
                        type="url"
                        value={editForm.preview_video_url}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, preview_video_url: e.target.value }))}
                        placeholder="https://www.youtube.com/shorts/... or https://domain.com/video.mp4"
                        className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gallery Images (One per line) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Gallery Images (One URL per line)</span>
                      <span className="text-[10px] text-slate-500">Additional preview screenshots</span>
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.gallery_images_text}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, gallery_images_text: e.target.value }))}
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB C: CONTENT & DESCRIPTIONS */}
              {editTab === 'details' && (
                <div className="space-y-4">
                  {/* Reel Count, Resolution, Format */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Total Reels Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.reel_count}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, reel_count: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-bold text-purple-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Resolution
                      </label>
                      <input
                        type="text"
                        value={editForm.resolution}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, resolution: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Video Format
                      </label>
                      <input
                        type="text"
                        value={editForm.format}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, format: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Rating (e.g. 4.9)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={editForm.rating}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-bold text-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Total Reviews Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.review_count}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, review_count: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Short Description (Summary near buy button)
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.short_description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, short_description: e.target.value }))}
                      placeholder="High quality viral reels bundle ready to upload on Instagram, YouTube Shorts, and Facebook..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Full Detailed Description / HTML Content
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Write full product overview, what's included, how to use..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Features Bullet Points */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Feature Bullet Points (One per line)</span>
                      <span className="text-[10px] text-slate-500">Rendered with checkmarks</span>
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.features_text}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, features_text: e.target.value }))}
                      placeholder="100% Ready to Post&#10;No Watermark or Logos&#10;Full HD 1080P Resolution&#10;Instant Lifetime Access"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB D: GOOGLE DRIVE & DIGITAL FILE DELIVERY */}
              {editTab === 'files' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                    <div className="font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <span>Customer Download Delivery Links (Multiple Files Supported)</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {editForm.drive_files.length} {editForm.drive_files.length === 1 ? 'Drive File' : 'Drive Files'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Ek product ki multiple Google Drive / Mega files yaha add karein (jaise Part 1, Part 2, Bonus Zip). Jab customer Cashfree se payment complete karega, to confirmation page aur download portal par ye saare download links unlock ho jayenge!
                    </p>
                    <p className="text-[11px] text-emerald-400 font-bold pt-0.5">
                      🔒 Security: Download links database me direct secure rehte hain aur payment se pehle kabhi frontend code me expose nahi hote.
                    </p>
                  </div>

                  {/* Multiple Drive Files List */}
                  <div className="space-y-3.5">
                    {editForm.drive_files.map((file, idx) => (
                      <div
                        key={file.id || idx}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 space-y-3 transition-colors shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Drive File #{idx + 1}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                                Primary Link
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {file.file_url && (
                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Test Link</span>
                              </a>
                            )}
                            {editForm.drive_files.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEditDriveFile(idx)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
                                title="Remove this file link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            Google Drive Folder / Download URL *
                          </label>
                          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 focus-within:border-purple-500 px-3 py-2">
                            <FolderOpen className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                            <input
                              type="url"
                              value={file.file_url}
                              onChange={(e) => handleUpdateEditDriveFile(idx, 'file_url', e.target.value)}
                              placeholder="https://drive.google.com/drive/folders/... or https://mega.nz/..."
                              className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            File Display Name / Part Label
                          </label>
                          <input
                            type="text"
                            value={file.name}
                            onChange={(e) => handleUpdateEditDriveFile(idx, 'name', e.target.value)}
                            placeholder={idx === 0 ? "e.g. Part 1: 500+ AI Reels (Google Drive Access)" : `e.g. Part ${idx + 1}: 500+ Luxury Reels & Bonus Assets`}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                          />
                        </div>

                        {file.file_url && (
                          <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-mono text-purple-300 truncate">
                                {file.file_url}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                              Ready
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Another Drive Link Button */}
                  <button
                    type="button"
                    onClick={handleAddEditDriveFile}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>+ Add Another Google Drive Link / File Part</span>
                  </button>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save All Product Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT CATEGORY MODAL */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-purple-900/40">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingCategory
                    ? `Updating "${editingCategory.name}"`
                    : 'Add a new niche category for your bundles'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anime Reels, Crypto & Web3"
                  value={categoryForm.name}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Category Icon / Emoji
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="✨"
                    value={categoryForm.icon || '✨'}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-16 text-center px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-lg font-bold text-white focus:outline-none shrink-0"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['✨', '🔥', '🚀', '💎', '🎬', '🤖', '💰', '⚡', '🎮', '🐾', '💪', '👑'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setCategoryForm((prev) => ({ ...prev, icon: em }))}
                        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all border ${
                          categoryForm.icon === em
                            ? 'bg-purple-600/40 border-purple-500 text-white scale-110'
                            : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  URL Slug *
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2">
                  <span className="text-xs text-slate-500 font-mono">/category/</span>
                  <input
                    type="text"
                    required
                    placeholder="anime-reels"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-transparent text-xs font-mono font-semibold text-purple-300 focus:outline-none pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Browse high-converting viral reels in this collection..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                {editingCategory ? (
                  <button
                    type="button"
                    onClick={() => {
                      const catToDelete = editingCategory;
                      setIsCategoryModalOpen(false);
                      handleDeleteCategory(catToDelete);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Category</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD NEW PRODUCT MODAL (Identical 4-Tab Full Editor) */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-900/40 my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={
                    createForm.featured_image ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'
                  }
                  alt={createForm.name || 'New Product'}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Add New Product
                    </h2>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      #new-bundle
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    New store URL: <code className="text-purple-300">/product/{createForm.slug || 'bundle-slug'}</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex items-center gap-2 py-3 border-b border-slate-800 overflow-x-auto shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setAddTab('basic')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  addTab === 'basic'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                1. Overview & Pricing
              </button>
              <button
                type="button"
                onClick={() => setAddTab('media')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  addTab === 'media'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                2. Media & Preview Video
              </button>
              <button
                type="button"
                onClick={() => setAddTab('details')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  addTab === 'details'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                3. Content & Descriptions
              </button>
              <button
                type="button"
                onClick={() => setAddTab('files')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  addTab === 'files'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                4. Google Drive Download Links ({createForm.drive_files.length})
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateSubmit} className="overflow-y-auto py-5 pr-1 space-y-5 flex-1">
              {/* TAB 1: OVERVIEW & PRICING */}
              {addTab === 'basic' && (
                <div className="space-y-4">
                  {/* Name and Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Bundle Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2000+ Stop Scrolling Reels Bundle"
                        value={createForm.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const autoSlug = name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');
                          setCreateForm((prev) => ({
                            ...prev,
                            name,
                            slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        URL Slug *
                      </label>
                      <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                        <span className="text-xs text-slate-500 font-mono">/product/</span>
                        <input
                          type="text"
                          placeholder="stop-scrolling-reels-bundle"
                          value={createForm.slug}
                          onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
                          className="w-full bg-transparent text-xs font-mono font-semibold text-purple-300 focus:outline-none pl-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Primary Category *
                      </label>
                      <select
                        value={createForm.category}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Visibility Status
                      </label>
                      <select
                        value={createForm.status}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      >
                        <option value="publish">Publish (Visible to Buyers)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Stock Status
                      </label>
                      <select
                        value={createForm.stock_status}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, stock_status: e.target.value as any }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      >
                        <option value="instock">In Stock</option>
                        <option value="outofstock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Personal License */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                          Personal License
                        </span>
                        <span className="text-[10px] text-slate-500">For personal use</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Sale Price (₹) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={createForm.price}
                            onChange={(e) => {
                              const p = Number(e.target.value);
                              setCreateForm((prev) => ({
                                ...prev,
                                price: p,
                                regular_price: prev.regular_price || p * 5,
                                reseller_price: prev.reseller_price || p * 2,
                                reseller_regular_price: prev.reseller_regular_price || p * 10,
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-black text-emerald-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Regular MRP (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={createForm.regular_price}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, regular_price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reseller License */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          Reseller Commercial License
                        </span>
                        <span className="text-[10px] text-slate-500">With resale rights</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Reseller Price (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={createForm.reseller_price}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, reseller_price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-black text-amber-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Reseller MRP (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={createForm.reseller_regular_price}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, reseller_regular_price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-sm font-semibold text-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createForm.is_hot}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, is_hot: e.target.checked }))}
                        className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-400" />
                          <span>Show "HOT / Best Seller" Badge</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Highlights this bundle on shop page</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createForm.is_trending}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, is_trending: e.target.checked }))}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Show "Trending" Badge</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Adds trending tag on thumbnail</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & PREVIEW VIDEO */}
              {addTab === 'media' && (
                <div className="space-y-4">
                  {/* Featured Image */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Cover Thumbnail Image URL *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                        <ImageIcon className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
                        <input
                          type="url"
                          value={createForm.featured_image}
                          onChange={(e) => setCreateForm((prev) => ({ ...prev, featured_image: e.target.value }))}
                          placeholder="https://images.unsplash.com/... or https://..."
                          className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      {createForm.featured_image && (
                        <img
                          src={createForm.featured_image}
                          alt="Cover Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Preview Video URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Video Preview URL (YouTube Shorts, YouTube Video, or Direct MP4)</span>
                      <span className="text-[10px] text-purple-400">Plays when buyer clicks "View Preview"</span>
                    </label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-purple-500 px-3 py-2.5">
                      <Video className="w-4 h-4 text-rose-400 mr-2 shrink-0" />
                      <input
                        type="url"
                        value={createForm.preview_video_url}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, preview_video_url: e.target.value }))}
                        placeholder="https://www.youtube.com/shorts/... or https://domain.com/video.mp4"
                        className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gallery Images (One per line) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Gallery Images (One URL per line)</span>
                      <span className="text-[10px] text-slate-500">Additional preview screenshots</span>
                    </label>
                    <textarea
                      rows={3}
                      value={createForm.gallery_images_text}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, gallery_images_text: e.target.value }))}
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CONTENT & DESCRIPTIONS */}
              {addTab === 'details' && (
                <div className="space-y-4">
                  {/* Reel Count, Resolution, Format */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Total Reels Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={createForm.reel_count}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, reel_count: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-bold text-purple-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Resolution
                      </label>
                      <input
                        type="text"
                        value={createForm.resolution}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, resolution: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Video Format
                      </label>
                      <input
                        type="text"
                        value={createForm.format}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, format: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Rating (e.g. 5)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={createForm.rating}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-bold text-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Total Reviews Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={createForm.review_count}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, review_count: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Short Description (Summary near buy button)
                    </label>
                    <textarea
                      rows={2}
                      value={createForm.short_description}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, short_description: e.target.value }))}
                      placeholder="High quality viral reels bundle ready to upload on Instagram, YouTube Shorts, and Facebook..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Full Detailed Description / HTML Content
                    </label>
                    <textarea
                      rows={4}
                      value={createForm.description}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Write full product overview, what's included, how to use..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Features Bullet Points */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Feature Bullet Points (One per line)</span>
                      <span className="text-[10px] text-slate-500">Rendered with checkmarks</span>
                    </label>
                    <textarea
                      rows={3}
                      value={createForm.features_text}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, features_text: e.target.value }))}
                      placeholder="100% Ready to Post&#10;No Watermark or Logos&#10;Full HD 1080P Resolution&#10;Instant Lifetime Access"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: GOOGLE DRIVE & DIGITAL FILE DELIVERY */}
              {addTab === 'files' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                    <div className="font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <span>Customer Download Delivery Links (Multiple Files Supported)</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {createForm.drive_files.length} {createForm.drive_files.length === 1 ? 'Drive File' : 'Drive Files'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Ek product ki multiple Google Drive / Mega files yaha add karein (jaise Part 1, Part 2, Bonus Zip). Jab customer Cashfree se payment complete karega, to confirmation page aur download portal par ye saare download links unlock ho jayenge!
                    </p>
                    <p className="text-[11px] text-emerald-400 font-bold pt-0.5">
                      🔒 Security Guarantee: Download links database me direct secure rehte hain aur payment se pehle kabhi frontend code me expose nahi hote.
                    </p>
                  </div>

                  {/* Multiple Drive Files List */}
                  <div className="space-y-3.5">
                    {createForm.drive_files.map((file, idx) => (
                      <div
                        key={file.id || idx}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 space-y-3 transition-colors shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Drive File #{idx + 1}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                                Primary Link
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {file.file_url && (
                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Test Link</span>
                              </a>
                            )}
                            {createForm.drive_files.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCreateDriveFile(idx)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
                                title="Remove this file link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            Google Drive Folder / Download URL *
                          </label>
                          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 focus-within:border-purple-500 px-3 py-2">
                            <FolderOpen className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                            <input
                              type="url"
                              value={file.file_url}
                              onChange={(e) => handleUpdateCreateDriveFile(idx, 'file_url', e.target.value)}
                              placeholder="https://drive.google.com/drive/folders/... or https://mega.nz/..."
                              className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            File Display Name / Part Label
                          </label>
                          <input
                            type="text"
                            value={file.name}
                            onChange={(e) => handleUpdateCreateDriveFile(idx, 'name', e.target.value)}
                            placeholder={idx === 0 ? "e.g. Part 1: 500+ AI Reels (Google Drive Access)" : `e.g. Part ${idx + 1}: 500+ Luxury Reels & Bonus Assets`}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                          />
                        </div>

                        {file.file_url && (
                          <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-mono text-purple-300 truncate">
                                {file.file_url}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                              Ready
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Another Drive Link Button */}
                  <button
                    type="button"
                    onClick={handleAddCreateDriveFile}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>+ Add Another Google Drive Link / File Part</span>
                  </button>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <span>Publishing Bundle...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish New Product to Store</span>
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
