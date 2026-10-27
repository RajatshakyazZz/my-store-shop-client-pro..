'use client';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BackendHealthProvider } from './context/BackendHealthContext';
import { AdminThemeProvider } from './context/AdminThemeContext';
import AdminLayout from './components/layout/AdminLayout';
import './index.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import Content from './pages/Content';
import Branding from './pages/Branding';
import SiteMode from './pages/SiteMode';
import StoreSetup from './pages/StoreSetup';
import MetaPixel from './pages/MetaPixel';
import WhatsappButton from './pages/WhatsappButton';
import Webhooks from './pages/Webhooks';
import Plugins from './pages/Plugins';
import Themes from './pages/Themes';
import Connector from './pages/Connector';
import SettingsIntegrations from './pages/SettingsIntegrations';
import AuditLogs from './pages/AuditLogs';
import Resellers from './pages/Resellers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BackendHealthProvider>
              <BrowserRouter basename="/asdf">
                <Routes>
                  {/* Public Auth Route */}
                  <Route path="/login" element={<Login />} />

                  {/* Protected Admin Shell */}
                  <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="audit-logs" element={<AuditLogs />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="resellers" element={<Resellers />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="content" element={<Content />} />
                    <Route path="branding" element={<Branding />} />
                    <Route path="site-mode" element={<SiteMode />} />
                    <Route path="store-setup" element={<StoreSetup />} />
                    <Route path="meta-pixel" element={<MetaPixel />} />
                    <Route path="whatsapp-button" element={<WhatsappButton />} />
                    <Route path="webhooks" element={<Webhooks />} />
                    <Route path="plugins" element={<Plugins />} />
                    <Route path="themes" element={<Themes />} />
                    <Route path="connector" element={<Connector />} />
                    <Route path="settings" element={<SettingsIntegrations />} />
                  </Route>

                  {/* Catch-all Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </BackendHealthProvider>
          </AuthProvider>
        </ToastProvider>
      </AdminThemeProvider>
    </QueryClientProvider>
  );
}
