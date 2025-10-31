import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    if (userToken) localStorage.removeItem('token');
    if (adminToken) localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
    alert('Logged out successfully!');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">Eventify</Link>

        {/* Links */}
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/events" className="hover:underline">Events</Link>

          {/* When no one is logged in */}
          {!userToken && !adminToken && (
            <>
              <Link to="/auth" className="hover:underline">Login</Link>
              <Link to="/admin/login" className="hover:underline">Admin Login</Link>
            </>
          )}

          {/* When a normal user is logged in */}
          {userToken && !adminToken && (
            <>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}

          {/* When an admin is logged in */}
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
