import React, { useState, useEffect } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call admin login endpoint
      const res = await API.post('/auth/admin/login', { email, password });

      // Save admin token
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('role', 'admin');
      setAuthToken(res.data.token);

      alert('Admin login successful!');
      setEmail('');
      setPassword('');
      navigate('/admin'); // redirect to admin dashboard
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}
