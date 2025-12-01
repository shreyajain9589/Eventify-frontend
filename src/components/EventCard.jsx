import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, isAdmin = false, onDelete, onEdit }) {
  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleEdit = () => {
    onEdit && onEdit(event);
  };

  return (
    <div className="border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={event.img || 'https://via.placeholder.com/400x200'}
          alt={event.title}
          className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {event.available_seats < 10 && event.available_seats > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Only {event.available_seats} left!
          </div>
        )}
        {event.available_seats === 0 && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="text-lg font-bold text-indigo-600">₹{event.price}</div>
            <div className="text-xs text-gray-500">{event.available_seats} seats left</div>
          </div>

          {!isAdmin && (
            <Link
              to={`/events/${event._id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              View Details
            </Link>
          )}

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
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
