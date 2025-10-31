import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    setUserToken(localStorage.getItem('token'));
    setAdminToken(localStorage.getItem('adminToken'));

    const handleStorage = () => {
      setUserToken(localStorage.getItem('token'));
      setAdminToken(localStorage.getItem('adminToken'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
    setUserToken(null);
    setAdminToken(null);
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Eventify</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/events" className="hover:underline">Events</Link>

          {/* No one logged in */}
          {!userToken && !adminToken && (
            <>
              <Link to="/auth" className="hover:underline">Login</Link>
              <Link to="/admin/login" className="hover:underline">Admin Login</Link>
            </>
          )}

          {/* User logged in */}
          {userToken && !adminToken && (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          )}

          {/* Admin logged in */}
          {adminToken && (
            <>
              <Link to="/admin" className="hover:underline">Admin Dashboard</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
