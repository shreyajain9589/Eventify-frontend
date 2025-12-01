import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function Navbar() {
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // 🔄 Re-sync token on every route change (important!)
  useEffect(() => {
    setUserToken(localStorage.getItem('token'));
    setAdminToken(localStorage.getItem('adminToken'));
  }, [location.pathname]);

  // 🔄 Listen to localStorage changes (cross-tab + instant update)
  useEffect(() => {
    const syncTokens = () => {
      setUserToken(localStorage.getItem('token'));
      setAdminToken(localStorage.getItem('adminToken'));
    };

    window.addEventListener('storage', syncTokens);
    return () => window.removeEventListener('storage', syncTokens);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');

    setUserToken(null);
    setAdminToken(null);
    setMobileMenuOpen(false);

    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          Eventify
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-5 items-center">

          <Link to="/" className="hover:text-yellow-200">Home</Link>
          <Link to="/events" className="hover:text-yellow-200">Events</Link>

          {/* IF no one is logged in */}
          {!userToken && !adminToken && (
            <>
              <Link to="/auth" className="hover:text-yellow-200">Login</Link>
              <Link to="/admin/login" className="hover:text-yellow-200">Admin Login</Link>
            </>
          )}

          {/* USER logged in */}
          {userToken && !adminToken && (
            <button onClick={handleLogout} className="hover:text-yellow-200">Logout</button>
          )}

          {/* ADMIN logged in */}
          {adminToken && (
            <>
              <Link to="/admin/dashboard" className="hover:text-yellow-200 transition font-medium">
  Admin Dashboard
</Link>
              <button onClick={handleLogout} className="hover:text-yellow-200">Logout</button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
        >
          {mobileMenuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t border-white/30">

          <Link to="/" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/events" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Events</Link>

          {!userToken && !adminToken && (
            <>
              <Link to="/auth" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/admin/login" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                Admin Login
              </Link>
            </>
          )}

          {userToken && !adminToken && (
            <button onClick={handleLogout} className="block w-full text-left py-2">
              Logout
            </button>
          )}

          {adminToken && (
            <>
              <Link to="/admin" className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
              <button onClick={handleLogout} className="block w-full text-left py-2">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
