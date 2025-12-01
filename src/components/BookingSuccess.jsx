import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BookingSuccess({ booking }) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/events');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-lg mx-auto mt-8"
    >
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-gray-600 mb-6">Your tickets have been successfully booked</p>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-mono font-semibold text-sm">{booking._id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-indigo-600">₹{booking.total_amount}</span>
          </div>
        </div>

        {/* QR Code */}
        {booking.qr && (
          <div className="mb-6">
            <img
              src={booking.qr}
              alt="QR code"
              className="mx-auto w-48 h-48 border-2 border-gray-200 rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-3">
              Save this QR code or show it at the venue for entry
            </p>
          </div>
        )}

        {/* Redirect Notice */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-indigo-800">
            Redirecting to events page in <span className="font-bold text-lg">{countdown}</span> seconds...
          </p>
        </div>

        {/* Manual Button */}
        <button
          onClick={() => navigate('/events')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
        >
          Go to Events Now
        </button>
      </div>
    </motion.div>
  );
}
