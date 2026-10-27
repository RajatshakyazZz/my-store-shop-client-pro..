import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Menu,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { useAdminTheme } from '../../context/AdminThemeContext';

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isLight } = useAdminTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Verifying Portal Access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const bottomTabs = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
  ];

  return (
    <div className={`admin-root ${isLight ? 'admin-theme-light' : 'admin-theme-dark'} min-h-screen flex transition-colors duration-200 overflow-x-hidden ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-3 sm:p-5 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto overflow-x-hidden admin-touch-scroll">
          <Outlet />
        </main>
      </div>

      {/* Mobile Thumb-Friendly Bottom Navigation Bar */}
      <nav
        aria-label="Mobile quick navigation"
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl border-t transition-colors pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]'
            : 'bg-slate-950/95 border-slate-800/90 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]'
        }`}
      >
        <div className="grid grid-cols-5 h-15 px-1">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.name}
                to={tab.href}
                end={tab.href === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                    isActive
                      ? isLight
                        ? 'text-amber-600 font-extrabold'
                        : 'text-amber-400 font-extrabold'
                      : isLight
                      ? 'text-slate-500 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold tracking-tight">{tab.name}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
              isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
