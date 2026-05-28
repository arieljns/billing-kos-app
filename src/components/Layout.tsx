import React, { useState } from 'react';
import './Layout.css';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface LayoutProps {
  children: React.ReactNode;
  currentPageId: string;
  onPageChange: (id: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  brandName?: string;
  profileName?: string;
  profileRole?: string;
}

// Inline SVGs for Navigation
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);
const IconRooms = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const IconTenants = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const IconBilling = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPageId,
  onPageChange,
  theme,
  onToggleTheme,
  brandName = 'KosFlow',
  profileName = 'Ariel J.',
  profileRole = 'Pengelola Kos'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Ringkasan', icon: <IconDashboard /> },
    { id: 'rooms', label: 'Kelola Properti', icon: <IconRooms /> },
    { id: 'tenants', label: 'Daftar Penghuni', icon: <IconTenants /> },
    { id: 'billing', label: 'Riwayat Keuangan', icon: <IconBilling /> },
    { id: 'settings', label: 'Pengaturan', icon: <IconSettings /> }
  ];

  const handlePageClick = (id: string) => {
    onPageChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="kf-layout-wrapper">
      
      {/* Sidebar Navigation */}
      <aside className={`kf-sidebar ${mobileMenuOpen ? 'is-mobile-open' : ''}`}>
        <div className="kf-sidebar-header">
          <div className="kf-sidebar-logo">
            <span className="kf-sidebar-logo-icon">KF</span>
            <span className="kf-sidebar-logo-text">{brandName}</span>
          </div>
        </div>
        
        <nav className="kf-sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`kf-sidebar-nav-btn ${currentPageId === item.id ? 'is-active' : ''}`}
              onClick={() => handlePageClick(item.id)}
            >
              <span className="kf-nav-icon">{item.icon}</span>
              <span className="kf-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="kf-sidebar-footer">
          <div className="kf-sidebar-user">
            <div className="kf-user-avatar">
              {profileName.substring(0, 2).toUpperCase()}
            </div>
            <div className="kf-user-info">
              <span className="kf-user-name">{profileName}</span>
              <span className="kf-user-role">{profileRole}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="kf-main-area">
        
        {/* Header Bar */}
        <header className="kf-header">
          <div className="kf-header-left">
            <button 
              className="kf-mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <IconMenu />
            </button>
            <h2 className="kf-header-title">
              {navigationItems.find(item => item.id === currentPageId)?.label || 'Overview'}
            </h2>
          </div>

          <div className="kf-header-right">
            
            {/* Theme Toggle Button */}
            <button 
              className="kf-theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <IconMoon /> : <IconSun />}
            </button>
            
            <div className="kf-header-divider" />
            
            <div className="kf-header-profile">
              <div className="kf-header-avatar">
                {profileName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="kf-content">
          {children}
        </main>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="kf-sidebar-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
