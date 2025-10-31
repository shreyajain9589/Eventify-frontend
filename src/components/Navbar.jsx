import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');

    // Check normal user
    if (token) setIsUser(true);

    // Check admin token validity
    if (adminToken) {
      setAuthToken(adminToken);
      API.get('/auth/admin/verify') // create verify route in backend
        .then(() => setIsAdmin(true))
        .catch(() => {
          localStorage.removeItem('adminToken');
          setIsAdmin(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
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

          {!isUser && !isAdmin && (
            <>
              <Link to="/auth" className="hover:underline">Login</Link>
              <Link to="/admin/login" className="hover:underline">Admin Login</Link>
            </>
          )}

          {isUser && !isAdmin && (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          )}

          {isAdmin && (
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
