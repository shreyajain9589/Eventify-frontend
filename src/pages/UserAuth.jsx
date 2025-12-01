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

  // Login form
  const loginForm = useForm(
    { email: '', password: '' },
    {
      email: composeValidators(validators.required, validators.email),
      password: validators.required,
    }
  );

  // Register form
  const registerForm = useForm(
    { name: '', email: '', password: '', mobile: '' },
    {
      name: validators.required,
      email: composeValidators(validators.required, validators.email),
      password: composeValidators(validators.required, validators.password),
      mobile: composeValidators(validators.required, validators.mobile),
    }
  );

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

  const handleRegister = registerForm.handleSubmit(async (values) => {
    try {
      await API.post('/auth/register', values);
      toast.success('Registration successful! Please login.');
      setActiveTab('login');
      registerForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  });

  const passwordStrength = getPasswordStrength(registerForm.values.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden my-auto">
        {/* Tab Headers */}
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-medium transition-colors relative cursor-pointer ${
              activeTab === 'login'
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
            {activeTab === 'login' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-medium transition-colors relative cursor-pointer ${
              activeTab === 'register'
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
            {activeTab === 'register' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

              <Input
                label="Email"
                type="email"
                value={loginForm.values.email}
                onChange={(value) => loginForm.handleChange('email', value)}
                onBlur={() => loginForm.handleBlur('email')}
                error={loginForm.touched.email && loginForm.errors.email}
                placeholder="Enter your email"
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
                  value={loginForm.values.password}
                  onChange={(value) => loginForm.handleChange('password', value)}
                  onBlur={() => loginForm.handleBlur('password')}
                  error={loginForm.touched.password && loginForm.errors.password}
                  placeholder="Enter your password"
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
                  className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>

              <LoadingButton
                type="submit"
                loading={loginForm.isSubmitting}
                className="w-full"
              >
                Login
              </LoadingButton>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

              <Input
                label="Full Name"
                type="text"
                value={registerForm.values.name}
                onChange={(value) => registerForm.handleChange('name', value)}
                onBlur={() => registerForm.handleBlur('name')}
                error={registerForm.touched.name && registerForm.errors.name}
                placeholder="Enter your full name"
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <Input
                label="Email"
                type="email"
                value={registerForm.values.email}
                onChange={(value) => registerForm.handleChange('email', value)}
                onBlur={() => registerForm.handleBlur('email')}
                error={registerForm.touched.email && registerForm.errors.email}
                placeholder="Enter your email"
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <Input
                label="Mobile Number"
                type="tel"
                value={registerForm.values.mobile}
                onChange={(value) => registerForm.handleChange('mobile', value)}
                onBlur={() => registerForm.handleBlur('mobile')}
                error={registerForm.touched.mobile && registerForm.errors.mobile}
                placeholder="Enter 10-digit mobile number"
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={registerForm.values.password}
                  onChange={(value) => registerForm.handleChange('password', value)}
                  onBlur={() => registerForm.handleBlur('password')}
                  error={registerForm.touched.password && registerForm.errors.password}
                  placeholder="Create a strong password"
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
                  className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'} password
                </button>

                {/* Password Strength Indicator */}
                {registerForm.values.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <p className="text-xs text-gray-600">
                        Password strength: {passwordStrength.label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <LoadingButton
                type="submit"
                loading={registerForm.isSubmitting}
                className="w-full"
              >
                Register
              </LoadingButton>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
