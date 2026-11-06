import type { Metadata } from 'next';
import AdminClientView from './AdminClientView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CreatorMint Command Center | Admin Portal',
  description: 'CreatorMint Management & Command Center',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClientView />;
}
