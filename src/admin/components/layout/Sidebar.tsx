import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  FileText,
  Palette,
  Power,
  Store,
  Crosshair,
  MessageCircle,
  Webhook,
  Plug,
  Paintbrush,
  RefreshCw,
  Settings,
  ShieldCheck,
  Activity,
  Play,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminTheme } from '../../context/AdminThemeContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { admin } = useAuth();
  const { isLight } = useAdminTheme();

  const navigation = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Audit Logs', href: '/audit-logs', icon: Activity, badge: 'Firebase' },
      ],
    },
    {
      group: 'COMMERCE',
      items: [
        { name: 'Products & Files', href: '/products', icon: Package },
        { name: 'Orders & Delivery', href: '/orders', icon: ShoppingCart },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Resellers & Payouts', href: '/resellers', icon: Users, badge: 'Live' },
        { name: 'Coupons', href: '/coupons', icon: Ticket },
      ],
    },
    {
      group: 'CONTENT & STORE',
      items: [
        { name: 'Content & Pages', href: '/content', icon: FileText },
        { name: 'Branding & Theme', href: '/branding', icon: Palette },
        { name: 'Site Mode', href: '/site-mode', icon: Power, badge: 'Control' },
        { name: 'Store Setup', href: '/store-setup', icon: Store },
      ],
    },
    {
      group: 'MARKETING',
      items: [
        { name: 'Meta Pixel & CAPI', href: '/meta-pixel', icon: Crosshair },
        { name: 'WhatsApp Button', href: '/whatsapp-button', icon: MessageCircle },
      ],
    },
    {
      group: 'SYSTEM & INTEGRATIONS',
      items: [
        { name: 'Portal Connector', href: '/connector', icon: RefreshCw },
        { name: 'Settings & Bridges', href: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className={`h-16 px-4 sm:px-5 border-b flex items-center justify-between gap-3 shrink-0 ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-950'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-black border border-amber-500/30 overflow-hidden flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <img src="/logo.webp" alt="VaultWorld Store Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`font-extrabold text-[15px] tracking-tight leading-none truncate ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              VaultWorld Store
            </span>
            <span className="text-[11px] font-black text-amber-500 tracking-wide mt-1 truncate">
              COMMAND CENTER v2.0
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto admin-touch-scroll">
        {navigation.map((section) => (
          <div key={section.group} className="space-y-1">
            <h4 className={`px-3 text-[10px] font-black uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {section.group}
            </h4>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/'}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 lg:py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? isLight
                            ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-xs'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                          : isLight
                          ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                        isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-slate-800 text-amber-300 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Admin User Footer Box */}
      <div className={`p-3 border-t shrink-0 pb-safe ${
        isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800/80 bg-slate-900/40'
      }`}>
        <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border shrink-0 ${
            isLight
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {admin?.name}
            </div>
            <div className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="truncate">{admin?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className={`hidden lg:flex w-64 border-r flex-col shrink-0 h-screen sticky top-0 select-none transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950/90 border-slate-800/80'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <aside className={`relative z-10 w-72 max-w-[85vw] border-r flex flex-col h-full shadow-2xl select-none transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
