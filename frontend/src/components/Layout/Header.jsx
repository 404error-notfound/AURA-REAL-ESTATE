import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ user, token, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-[#001B48] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl lg:text-2xl font-bold hover:text-[#97CADB] transition-colors"
          >
            <span>🏠</span>
            <span>AURA Real Estate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
            {!token ? (
              <div className="flex items-center justify-center space-x-6">
                <Link 
                  to="/register" 
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    isActivePath('/register') 
                      ? 'bg-[#97CADB] text-[#001B48]' 
                      : 'hover:bg-[#002B6D]'
                  }`}
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    isActivePath('/login') 
                      ? 'bg-[#97CADB] text-[#001B48]' 
                      : 'hover:bg-[#002B6D]'
                  }`}
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full max-w-4xl">
                {/* Navigation Links */}
                <div className="flex items-center space-x-8">
                  <Link 
                    to="/dashboard" 
                    className={`px-5 py-2 rounded-lg transition-colors font-medium ${
                      isActivePath('/dashboard') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/properties" 
                    className={`px-5 py-2 rounded-lg transition-colors font-medium ${
                      isActivePath('/dashboard/properties') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Properties
                  </Link>
                  <Link 
                    to="/dashboard/leads" 
                    className={`px-5 py-2 rounded-lg transition-colors font-medium ${
                      isActivePath('/dashboard/leads') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Leads
                  </Link>
                  <Link 
                    to="/dashboard/clients" 
                    className={`px-5 py-2 rounded-lg transition-colors font-medium ${
                      isActivePath('/dashboard/clients') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Clients
                  </Link>
                </div>
                
                {/* User Info and Logout */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#97CADB] font-medium">
                    Welcome, {user?.name || 'User'}
                  </span>
                  <button 
                    onClick={onLogout}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-[#002B6D] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#002B6D]">
            <nav className="flex flex-col space-y-2">
              {!token ? (
                <>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/register') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/login') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-[#97CADB] border-b border-[#002B6D]">
                    Welcome, {user?.name || 'User'}
                  </div>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/dashboard') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/properties" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/dashboard/properties') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Properties
                  </Link>
                  <Link 
                    to="/dashboard/leads" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/dashboard/leads') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Leads
                  </Link>
                  <Link 
                    to="/dashboard/clients" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/dashboard/clients') 
                        ? 'bg-[#97CADB] text-[#001B48]' 
                        : 'hover:bg-[#002B6D]'
                    }`}
                  >
                    Clients
                  </Link>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mx-4 mt-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
