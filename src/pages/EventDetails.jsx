import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { useToast } from '../contexts/ToastContext';
import LoadingButton from '../components/LoadingButton';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [qtyError, setQtyError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
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
    load();
  }, [id, navigate, toast]);

  const handleQtyChange = (value) => {
    const numValue = Number(value);
    
    if (numValue < 1) {
      setQtyError('Quantity must be at least 1');
      setQty(1);
    } else if (numValue > event.available_seats) {
      setQtyError(`Only ${event.available_seats} seats available`);
      setQty(event.available_seats);
    } else {
      setQtyError('');
      setQty(numValue);
    }
  };

  const onCheckout = () => {
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      toast.error('Admin accounts cannot book tickets. Please logout and login as a regular user to book tickets.');
      return;
    }
    
    if (qty < 1 || qty > event.available_seats) {
      toast.error('Please select a valid quantity');
      return;
    }
    navigate(`/checkout/${id}`, { state: { qty } });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white shadow rounded overflow-hidden animate-pulse">
          <div className="w-full h-64 bg-gray-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
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
      className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6"
    >
      <img
        src={event.img || 'https://via.placeholder.com/800x300'}
        alt={event.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        {/* Admin Warning Banner */}
        {localStorage.getItem('adminToken') && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Admin accounts cannot book tickets
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Please logout and login as a regular user to book tickets for this event.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-3xl font-bold mb-2 text-gray-900">{event.title}</h2>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.date).toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{event.description}</p>

        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQtyChange(qty - 1)}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <input
                  type="number"
                  min="1"
                  max={event.available_seats}
                  value={qty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className={`w-20 text-center border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                    qtyError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                
                <button
                  onClick={() => handleQtyChange(qty + 1)}
                  disabled={qty >= event.available_seats}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {qtyError ? (
                <p className="text-xs text-red-600 mt-1">{qtyError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  {event.available_seats} seats available
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-indigo-600">
                  ₹{(event.price * qty).toLocaleString()}
                </div>
              </div>

              <LoadingButton
                onClick={onCheckout}
                disabled={qty < 1 || qty > event.available_seats}
                className="w-full md:w-auto"
              >
                Proceed to Checkout
              </LoadingButton>
            </div>
          </div>
        </div>

        {/* Event Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Price per Ticket</div>
            <div className="text-xl font-semibold text-gray-900">₹{event.price}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Available Seats</div>
            <div className="text-xl font-semibold text-gray-900">{event.available_seats}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Capacity</div>
            <div className="text-xl font-semibold text-gray-900">{event.total_seats}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
