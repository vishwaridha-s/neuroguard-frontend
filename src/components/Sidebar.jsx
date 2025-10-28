import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Sidebar({ onLogout, routes }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get the current route index for navigation
  const currentIndex = routes.findIndex(route => route.path === location.pathname);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < routes.length - 1;

  const handleNavigation = (direction) => {
    if (direction === 'prev' && hasPrev) {
      navigate(routes[currentIndex - 1].path);
    } else if (direction === 'next' && hasNext) {
      navigate(routes[currentIndex + 1].path);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 50,
          display: 'none',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '80px' : '250px',
          height: '100vh',
          backgroundColor: 'var(--sidebar-bg, #1e1e2d)',
          color: 'var(--sidebar-text, #9ca3af)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 40,
          overflow: 'hidden',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}
      >
        <div 
          className="sidebar-brand" 
          style={{
            padding: '1.5rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--sidebar-brand, #fff)',
            borderBottom: '1px solid var(--sidebar-border, rgba(255,255,255,0.1))',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {!isCollapsed && 'NeuroGuard'}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--sidebar-text, #9ca3af)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {routes.map(rt => {
            const isActive = location.pathname === rt.path;
            return (
              <button 
                key={rt.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigate(rt.path);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: isActive ? 'var(--sidebar-active-bg, rgba(79, 70, 229, 0.1))' : 'transparent',
                  color: isActive ? 'var(--sidebar-active-text, #4f46e5)' : 'var(--sidebar-text, #9ca3af)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  '&:hover': {
                    backgroundColor: isActive ? 'var(--sidebar-active-hover-bg, rgba(79, 70, 229, 0.15))' : 'var(--sidebar-hover-bg, rgba(255,255,255,0.05))',
                    color: isActive ? 'var(--sidebar-active-text, #4f46e5)' : 'var(--sidebar-hover-text, #fff)'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.3)'
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{rt.icon}</span>
                {!isCollapsed && <span>{rt.label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--sidebar-border, rgba(255,255,255,0.1))',
          marginTop: 'auto'
        }}>
          <button 
            className="sidebar-logout" 
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'transparent',
              color: 'var(--sidebar-text, #9ca3af)',
              border: '1px solid var(--sidebar-border, rgba(255,255,255,0.1))',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'var(--sidebar-hover-bg, rgba(255,255,255,0.05))',
                color: 'var(--sidebar-hover-text, #fff)'
              }
            }}
          >
            <FiLogOut />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 30
      }}>
        <button
          onClick={() => handleNavigation('prev')}
          disabled={!hasPrev}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: hasPrev ? 'var(--primary)' : 'var(--bg-secondary)',
            color: hasPrev ? 'white' : 'var(--text-secondary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: hasPrev ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            opacity: hasPrev ? 1 : 0.6,
            transition: 'all 0.2s',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          }}
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          onClick={() => handleNavigation('next')}
          disabled={!hasNext}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: hasNext ? 'var(--primary)' : 'var(--bg-secondary)',
            color: hasNext ? 'white' : 'var(--text-secondary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: hasNext ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            opacity: hasNext ? 1 : 0.6,
            transition: 'all 0.2s',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          }}
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .mobile-menu-button {
            display: flex !important;
          }
          .sidebar.collapsed {
            width: 80px !important;
          }
        }
        
        @media (min-width: 1025px) {
          .sidebar.collapsed {
            width: 80px !important;
          }
          .sidebar.collapsed .sidebar-link span:not(.icon) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
