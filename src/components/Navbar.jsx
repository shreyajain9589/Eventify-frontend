import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
    toast.success('Logged out successfully!');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl" onClick={closeMobileMenu}>
            Eventify
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/" className="hover:text-yellow-200 transition font-medium">Home</Link>
            <Link to="/events" className="hover:text-yellow-200 transition font-medium">Events</Link>

            {!userToken && !adminToken && (
              <>
                <Link to="/auth" className="hover:text-yellow-200 transition font-medium">Login</Link>
                <Link to="/admin/login" className="hover:text-yellow-200 transition font-medium">Admin Login</Link>
              </>
            )}

            {userToken && !adminToken && (
              <button onClick={handleLogout} className="hover:text-yellow-200 transition font-medium">
                Logout
              </button>
            )}

            {adminToken && (
              <>
                <Link to="/admin" className="hover:text-yellow-200 transition font-medium">Admin Dashboard</Link>
                <button onClick={handleLogout} className="hover:text-yellow-200 transition font-medium">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/20 pt-4">
            <Link
              to="/"
              className="block py-2 px-4 hover:bg-white/10 rounded transition"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="block py-2 px-4 hover:bg-white/10 rounded transition"
              onClick={closeMobileMenu}
            >
              Events
            </Link>

            {!userToken && !adminToken && (
              <>
                <Link
                  to="/auth"
                  className="block py-2 px-4 hover:bg-white/10 rounded transition"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  className="block py-2 px-4 hover:bg-white/10 rounded transition"
                  onClick={closeMobileMenu}
                >
                  Admin Login
                </Link>
              </>
            )}

            {userToken && !adminToken && (
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 hover:bg-white/10 rounded transition"
              >
                Logout
              </button>
            )}

            {adminToken && (
              <>
                <Link
                  to="/admin"
                  className="block py-2 px-4 hover:bg-white/10 rounded transition"
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 hover:bg-white/10 rounded transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
