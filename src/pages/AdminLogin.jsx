import React, { useState, useEffect } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useForm } from '../hooks/useForm';
import { validators, composeValidators } from '../utils/validation';
import Input from '../components/Input';
import LoadingButton from '../components/LoadingButton';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const form = useForm(
    { email: '', password: '' },
    {
      email: composeValidators(validators.required, validators.email),
      password: validators.required,
    }
  );

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setAuthToken(adminToken);
      API.get('/auth/admin/verify')
        .then(() => navigate('/admin'))
        .catch(() => {
          localStorage.removeItem('adminToken');
          toast.error('Session expired. Please login again.');
        });
    }
  }, [navigate, toast]);

  const handleLogin = form.handleSubmit(async (values) => {
    try {
      const res = await API.post('/auth/admin/login', values);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('role', 'admin');
      setAuthToken(res.data.token);

      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={form.values.email}
            onChange={(value) => form.handleChange('email', value)}
            onBlur={() => form.handleBlur('email')}
            error={form.touched.email && form.errors.email}
            placeholder="Enter admin email"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.values.password}
              onChange={(value) => form.handleChange('password', value)}
              onBlur={() => form.handleBlur('password')}
              error={form.touched.password && form.errors.password}
              placeholder="Enter admin password"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-indigo-600 hover:text-indigo-700 mt-1"
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          <LoadingButton
            type="submit"
            loading={form.isSubmitting}
            className="w-full"
          >
            Sign In
          </LoadingButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Not an admin?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              User Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
