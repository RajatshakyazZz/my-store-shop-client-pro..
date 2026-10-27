'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminTheme = 'light' | 'dark';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
  isLight: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vaultworld_admin_theme') as AdminTheme | null;
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
      } else {
        // Default to light theme as requested
        setThemeState('light');
      }
    } catch {}
    setMounted(true);
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('vaultworld_admin_theme', newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <AdminThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isLight: theme === 'light',
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
