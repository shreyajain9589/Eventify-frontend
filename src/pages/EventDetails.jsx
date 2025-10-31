import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load event.');
      }
    };
    load();
  }, [id]);

  const onCheckout = () => {
    navigate(`/checkout/${id}`, { state: { qty } });
  };

  if (!event) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded overflow-hidden mt-6">
      <img
        src={event.img || 'https://via.placeholder.com/800x300'}
        alt={event.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {new Date(event.date).toLocaleString()} • {event.location}
        </p>
        <p className="mb-4">{event.description}</p>

        <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={event.available_seats}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-24 border p-2 rounded"
            />
            <div className="text-xs text-gray-500 mt-1">{event.available_seats} seats available</div>
          </div>

          <div className="text-xl font-semibold">
            Total: ₹{event.price * qty}
          </div>

          <button
            onClick={onCheckout}
            className="ml-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
