import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';
import BookingSuccess from '../components/BookingSuccess';

export default function Checkout() {
  const { id } = useParams(); // event id
  const location = useLocation();
  const navigate = useNavigate();
  const qty = (location.state && location.state.qty) || 1;

  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [event, setEvent] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load event.');
      }
    };
    loadEvent();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to book tickets.');
      navigate('/login');
      return;
    }

    // ✅ Check required fields
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      alert('Please fill in your name, email, and mobile number.');
      return;
    }

    setAuthToken(token);

    try {
      const res = await API.post('/bookings', { eventId: id, ...form, quantity: qty });
      setSuccess(res.data.booking); // Booking success triggers QR display
      setForm({ name: '', email: '', mobile: '' }); // Clear form fields
    } catch (err) {
      console.error(err);
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (success) return <BookingSuccess booking={success} />; // Show QR with redirect button

  if (!event) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Checkout — {event.title}</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
          className="w-full border p-2 rounded"
        />
        <input
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          value={form.mobile}
          onChange={e => setForm({ ...form, mobile: e.target.value })}
          placeholder="Mobile"
          className="w-full border p-2 rounded"
        />
        <div className="flex items-center justify-between">
          <div>Total: ₹{event.price * qty}</div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Pay & Book
          </button>
        </div>
      </form>
    </div>
  );
}
