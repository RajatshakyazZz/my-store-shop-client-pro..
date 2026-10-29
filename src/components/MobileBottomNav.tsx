'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, total, isCartOpen } = useCart();

  // Hide on checkout, thankyou, reseller hub/landing pages, or when CartDrawer is open
  if (
    isCartOpen ||
    pathname?.startsWith('/r/') ||
    pathname === '/r' ||
    pathname?.startsWith('/earn') ||
    pathname === '/earn' ||
    pathname.includes('/checkout') ||
    pathname.includes('/order-success')
  ) {
    return null;
  }

  const isReelsPage = pathname.startsWith('/reels');
  const isCartPage = pathname === '/cart';

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9.5 9-7 9 7V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
    },
    {
      name: 'Preview',
      href: '/reels',
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <path d="m10 8.5 5.5 3.5-5.5 3.5z" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: 'Bundle',
      href: '/shop',
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6.5 12 3l8 3.5-8 3.5zM4 11l8 3.5 8-3.5M4 15.5 12 19l8-3.5" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="md:hidden fixed left-2.5 right-2.5 bottom-2.5 z-50 min-h-[58px] bg-slate-950/92 backdrop-blur-2xl border border-red-500/30 rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-1.5 py-1.5 grid grid-cols-4 items-stretch">
      {navItems.map((item) => {
        const isActive = item.href === '/reels' ? isReelsPage : pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            prefetch={false}
            className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-[16px] transition-all ${
              isActive
                ? 'bg-gradient-to-b from-red-600/25 to-red-600/5 text-rose-400 font-black border border-red-500/35 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'text-slate-400 hover:text-rose-300 font-bold'
            }`}
          >
            {isActive && (
              <span className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            )}
            <span className="relative flex items-center justify-center w-[26px] h-[26px]">
              {item.icon}
            </span>
            <span className="text-[10px] mt-0.5 tracking-tight font-extrabold leading-tight">
              {item.name}
            </span>
          </Link>
        );
      })}

      {/* Cart Button linking to /cart */}
      <Link
        href="/cart"
        prefetch={false}
        className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-[16px] transition-all ${
          isCartPage
            ? 'bg-gradient-to-b from-red-600/25 to-red-600/5 text-rose-400 font-black border border-red-500/35 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            : 'text-slate-400 hover:text-rose-300 font-bold'
        }`}
        aria-label="Cart"
      >
        {isCartPage && (
          <span className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
        )}
        <span className="relative flex items-center justify-center w-[26px] h-[26px]">
          <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H6.2M9 20h.01M17 20h.01" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-gradient-to-br from-red-600 to-rose-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-slate-950 shadow-md shadow-red-500/40">
              {cartCount}
            </span>
          )}
        </span>
        <span className="text-[10px] mt-0.5 tracking-tight font-extrabold leading-tight">
          Cart
        </span>
        {cartCount > 0 && (
          <span className="text-[7.5px] font-black text-rose-400 leading-none mt-0.5">
            ₹{total}.00
          </span>
        )}
      </Link>
    </nav>
  );
}
