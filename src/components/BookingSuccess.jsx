import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingSuccess({ booking }) {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Booking Confirmed 🎉</h2>
      <p className="mt-2">Booking ID: {booking._id}</p>
      <p className="mt-2">Total: ₹{booking.total_amount}</p>

      {booking.qr && (
        <div className="mt-4">
          <img src={booking.qr} alt="QR code" className="mx-auto w-48 h-48" />
          <p className="text-sm mt-2">Download this QR or show it at the venue.</p>
        </div>
      )}

      {/* Button to go back to events or home */}
      <button
        onClick={() => navigate('/events')} // change '/' if you want home
        className="bg-indigo-600 text-white px-4 py-2 rounded mt-4"
      >
        Go to Events
      </button>
    </div>
  );
}
