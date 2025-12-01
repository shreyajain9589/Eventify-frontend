import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useForm } from '../hooks/useForm';
import { validators, composeValidators } from '../utils/validation';
import Input from '../components/Input';
import LoadingButton from '../components/LoadingButton';

export default function UserAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  /* ---------------- LOGIN FORM ---------------- */
  const loginForm = useForm(
    { email: '', password: '' },
    {
      email: composeValidators(validators.required, validators.email),
      password: validators.required,
    }
  );

  /* ---------------- REGISTER FORM ---------------- */
  const registerForm = useForm(
    { name: '', email: '', password: '', mobile: '' },
    {
      name: validators.required,
      email: composeValidators(validators.required, validators.email),
      password: composeValidators(validators.required, validators.password),
      mobile: composeValidators(validators.required, validators.mobile),
    }
  );

  /* -------- Password Strength Checker -------- */
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Weak', color: 'bg-red-500' },
      { strength: 2, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 3, label: 'Good', color: 'bg-blue-500' },
      { strength: 4, label: 'Strong', color: 'bg-green-500' },
      { strength: 5, label: 'Very Strong', color: 'bg-green-600' },
    ];

    return levels[strength];
  };

  /* ---------------- LOGIN HANDLER ---------------- */
  const handleLogin = loginForm.handleSubmit(async (values) => {
    try {
      const res = await API.post('/auth/login', values);

      if (res.data.user.role === 'admin') {
        toast.error('Admin cannot login here. Please use Admin Login.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'user');

      setAuthToken(res.data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  });

  /* ---------------- REGISTER HANDLER ---------------- */
  const handleRegister = registerForm.handleSubmit(async (values) => {
    try {
      await API.post('/auth/register', values);

      toast.success('Registration successful! Please login.');
      registerForm.reset();
      setActiveTab('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  });

  const passwordStrength = getPasswordStrength(registerForm.values.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-medium relative ${
              activeTab === 'login' ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            Login
            {activeTab === 'login' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-medium relative ${
              activeTab === 'register' ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            Register
            {activeTab === 'register' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'login' ? (
            /* ---------------- LOGIN FORM ---------------- */
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
              autoComplete="off"
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

              <Input
                label="Email"
                type="email"
                autoComplete="new-email"
                value={loginForm.values.email}
                onChange={(v) => loginForm.handleChange('email', v)}
                onBlur={() => loginForm.handleBlur('email')}
                error={loginForm.touched.email && loginForm.errors.email}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={loginForm.values.password}
                onChange={(v) => loginForm.handleChange('password', v)}
                onBlur={() => loginForm.handleBlur('password')}
                error={loginForm.touched.password && loginForm.errors.password}
                required
              />

              <button
                type="button"
                className="text-sm text-indigo-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'} password
              </button>

              <LoadingButton type="submit" loading={loginForm.isSubmitting} className="w-full">
                Login
              </LoadingButton>
            </motion.form>
          ) : (
            /* ---------------- REGISTER FORM ---------------- */
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegister}
              autoComplete="off"
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-6">Create Account</h2>

              <Input
                label="Full Name"
                autoComplete="new-name"
                value={registerForm.values.name}
                onChange={(v) => registerForm.handleChange('name', v)}
                onBlur={() => registerForm.handleBlur('name')}
                error={registerForm.touched.name && registerForm.errors.name}
                required
              />

              <Input
                label="Email"
                type="email"
                autoComplete="new-email"
                value={registerForm.values.email}
                onChange={(v) => registerForm.handleChange('email', v)}
                onBlur={() => registerForm.handleBlur('email')}
                error={registerForm.touched.email && registerForm.errors.email}
                required
              />

              <Input
                label="Mobile Number"
                type="tel"
                autoComplete="new-tel"
                value={registerForm.values.mobile}
                onChange={(v) => registerForm.handleChange('mobile', v)}
                onBlur={() => registerForm.handleBlur('mobile')}
                error={registerForm.touched.mobile && registerForm.errors.mobile}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={registerForm.values.password}
                onChange={(v) => registerForm.handleChange('password', v)}
                onBlur={() => registerForm.handleBlur('password')}
                error={registerForm.touched.password && registerForm.errors.password}
                required
              />

              <button
                type="button"
                className="text-sm text-indigo-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'} password
              </button>

              {/* Password strength */}
              {registerForm.values.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded ${
                          lvl <= passwordStrength.strength
                            ? passwordStrength.color
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}

              <LoadingButton type="submit" loading={registerForm.isSubmitting} className="w-full">
                Register
              </LoadingButton>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
