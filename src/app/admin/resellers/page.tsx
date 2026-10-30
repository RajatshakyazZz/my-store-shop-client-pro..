'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminResellersManagementPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/asdf/products');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
      Redirecting to Admin Portal...
    </div>
  );
}
