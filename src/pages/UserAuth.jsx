import React, { useState, useEffect } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function UserAuth() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '' });
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ name: '', email: '', password: '', mobile: '' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await API.post('/auth/register', form);
        alert('Registration successful! Please login.');
        setIsRegister(false);
        setForm({ name: '', email: '', password: '', mobile: '' });
      } else {
        const res = await API.post('/auth/login', { email: form.email, password: form.password });

        // Prevent admin login via UserAuth
        if (res.data.user.role === 'admin') {
          alert('Admin cannot login here. Please use Admin Login.');
          setForm({ ...form, password: '' });
          return;
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'user');
        setAuthToken(res.data.token);
        alert('Login successful!');
        setForm({ name: '', email: '', password: '', mobile: '' });
        navigate('/');
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
      setForm({ ...form, password: '' });
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setForm({ name: '', email: '', password: '', mobile: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">{isRegister ? 'Register' : 'Login'}</h2>

        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={e => setForm({ ...form, mobile: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full mb-3">
          {isRegister ? 'Register' : 'Login'}
        </button>

        <p className="text-sm text-center">
          {isRegister ? 'Already have an account?' : 'Don’t have an account?'}
          <button type="button" className="ml-1 text-indigo-600 underline" onClick={toggleForm}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
}
