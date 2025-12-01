import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API, { setAuthToken } from '../services/api';
import BookingSuccess from '../components/BookingSuccess';
import { useToast } from '../contexts/ToastContext';
import { useForm } from '../hooks/useForm';
import { validators, composeValidators } from '../utils/validation';
import Input from '../components/Input';
import LoadingButton from '../components/LoadingButton';

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const qty = (location.state && location.state.qty) || 1;

  const [event, setEvent] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const form = useForm(
    { name: '', email: '', mobile: '' },
    {
      name: validators.required,
      email: composeValidators(validators.required, validators.email),
      mobile: composeValidators(validators.required, validators.mobile),
    }
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      toast.error('Admin accounts cannot book tickets. Please logout and login as a regular user to book tickets.');
      navigate('/events');
      return;
    }
    
    if (!token) {
      toast.error('Please login to book tickets');
      navigate('/events');
      return;
    }

    const loadEvent = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id, navigate, toast]);

  const onSubmit = form.handleSubmit(async (values) => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      toast.error('Admin accounts cannot book tickets. Please logout and login as a regular user.');
      return;
    }
    
    if (!token) {
      toast.error('Please login to book tickets');
      navigate('/events');
      return;
    }

    setAuthToken(token);

    try {
      const res = await API.post('/bookings', {
        eventId: id,
        ...values,
        quantity: qty
      });
      setSuccess(res.data.booking);
      toast.success('Booking confirmed! Check your email for details.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  });

  if (success) return <BookingSuccess booking={success} />;

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-6">
        <div className="bg-white shadow-lg rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto mt-6"
    >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Checkout</h2>
          <p className="text-indigo-100">{event.title}</p>
        </div>

        {/* Event Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Quantity</span>
            <span className="font-semibold">{qty} {qty === 1 ? 'ticket' : 'tickets'}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price per ticket</span>
            <span className="font-semibold">₹{event.price}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-indigo-600">
              ₹{(event.price * qty).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

          <Input
            label="Full Name"
            value={form.values.name}
            onChange={(value) => form.handleChange('name', value)}
            onBlur={() => form.handleBlur('name')}
            error={form.touched.name && form.errors.name}
            placeholder="Enter your full name"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <Input
            label="Email Address"
            type="email"
            value={form.values.email}
            onChange={(value) => form.handleChange('email', value)}
            onBlur={() => form.handleBlur('email')}
            error={form.touched.email && form.errors.email}
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
            value={form.values.mobile}
            onChange={(value) => form.handleChange('mobile', value)}
            onBlur={() => form.handleBlur('mobile')}
            error={form.touched.mobile && form.errors.mobile}
            placeholder="Enter 10-digit mobile number"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <div className="pt-4">
            <LoadingButton
              type="submit"
              loading={form.isSubmitting}
              className="w-full"
            >
              Pay ₹{(event.price * qty).toLocaleString()} & Confirm Booking
            </LoadingButton>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to receive booking confirmation via email and SMS
          </p>
        </form>
      </div>
    </motion.div>
  );
}
