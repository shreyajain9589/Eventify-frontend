import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import EventCard from '../components/EventCard';
import { useToast } from '../contexts/ToastContext';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

export default function Events() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events', { params: { q, location } });
      setEvents(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    setQ('');
    setLocation('');
    setLoading(true);
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await API.get('/admin/locations');
      
      // Handle both response formats
      let locationsData = [];
      if (Array.isArray(res.data)) {
        locationsData = res.data;
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        locationsData = res.data.data;
      }
      
      setLocations(locationsData.map(loc => loc.displayName));
    } catch (err) {
      // Fallback to empty array if locations fetch fails - this is not critical
      setLocations([]);
    }
  };

  useEffect(() => {
    socket.on('seatUpdate', (data) => {
      setEvents(prev =>
        prev.map(e =>
          e._id === data.eventId ? { ...e, available_seats: data.available_seats } : e
        )
      );
    });
    return () => socket.off('seatUpdate');
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={onSearch}
          className="flex flex-col md:flex-row gap-2 mb-6"
        >
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search events"
            className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="border p-2 rounded w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </motion.form>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded shadow animate-pulse">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {events.map((ev, index) => (
              <motion.div
                key={ev._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <EventCard event={ev} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20 bg-gray-50 rounded-lg"
          >
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-sm text-gray-600 mb-6">
              Try changing your search or view all available events.
            </p>
            <button
              onClick={fetchAllEvents}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              View All Events
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
