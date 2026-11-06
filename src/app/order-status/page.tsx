import OrderSuccessPage from '@/app/order-success/page';

export const metadata = {
  title: 'Order Status & Instant Access | CreatorMint',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderStatusPage() {
  return <OrderSuccessPage />;
}
