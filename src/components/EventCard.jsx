import React from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function EventCard({ event, isAdmin = false, onDelete, onEdit }) {

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Admin login required');
      await API.delete(`/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete && onDelete(event._id); // callback to parent
      alert('Event deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete event');
    }
  };

  const handleEdit = () => {
    onEdit && onEdit(event); // callback to parent for editing inline
  };

  return (
    <div className="border rounded shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={event.img || 'https://via.placeholder.com/400x200'}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-lg">{event.title}</h3>
        <p className="text-sm text-gray-600">
          {new Date(event.date).toLocaleString()} - {event.location}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">₹{event.price}</div>
            <div className="text-xs text-gray-500">{event.available_seats} seats left</div>
          </div>

          {!isAdmin && (
            <Link
              to={`/events/${event._id}`}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
            >
              View
            </Link>
          )}

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
