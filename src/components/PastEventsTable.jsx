import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function PastEventsTable() {
  const [pastEvents, setPastEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [eventBookings, setEventBookings] = useState({});
  const [bookingCounts, setBookingCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchPastEvents();
  }, []);

  // Safe getter for array data from new & old format
  const getArrayData = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  };

  const fetchPastEvents = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/events');
      const events = getArrayData(res);

      const now = new Date();
      const past = events.filter(ev => new Date(ev.date) < now);

      setPastEvents(past);

      // Fetch booking counts
      const counts = {};
      for (const ev of past) {
        try {
          const bookingsRes = await API.get(`/bookings/event/${ev._id}`);
          const bookingsData = getArrayData(bookingsRes);
          counts[ev._id] = bookingsData.length;
        } catch {
          counts[ev._id] = 0;
        }
      }

      setBookingCounts(counts);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch past events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventBookings = async (eventId) => {
    // Use cached data
    if (eventBookings[eventId]) {
      setExpandedEvent(expandedEvent === eventId ? null : eventId);
      return;
    }

    try {
      const res = await API.get(`/bookings/event/${eventId}`);
      const bookings = getArrayData(res);

      setEventBookings(prev => ({ ...prev, [eventId]: bookings }));
      setExpandedEvent(eventId);
    } catch {
      toast.error('Failed to fetch bookings for this event');
    }
  };

  const toggleEventExpansion = (eventId) => {
    if (expandedEvent === eventId) setExpandedEvent(null);
    else fetchEventBookings(eventId);
  };

  // ================= UI =================

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Past Events</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (pastEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Past Events</h3>
        <p className="text-gray-600 text-center py-8">No past events yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Past Events</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {pastEvents.map((event) => {
              const ticketsSold = event.total_seats - event.available_seats;
              const bookingCount = bookingCounts[event._id] || 0;
              const isExpanded = expandedEvent === event._id;
              const bookings = eventBookings[event._id] || [];

              return (
                <React.Fragment key={event._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center">
                      <img src={event.img} alt={event.title} className="h-10 w-10 rounded object-cover mr-3" />
                      <span className="text-sm font-medium">{event.title}</span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">{event.location}</td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ticketsSold} / {event.total_seats}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toggleEventExpansion(event._id)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-1"
                        disabled={bookingCount === 0}
                      >
                        {isExpanded ? 'Hide Users' : `View Users (${bookingCount})`}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && bookings.length > 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">
                            Registered Users ({bookings.length})
                          </h4>

                          <div className="grid md:grid-cols-2 gap-3">
                            {bookings.map((b) => (
                              <div key={b._id} className="p-3 bg-white rounded-lg border hover:border-indigo-300">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <span className="text-indigo-600 font-semibold">
                                        {b.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>

                                    <div>
                                      <p className="font-medium">{b.name}</p>
                                      <p className="text-xs text-gray-500">{b.email}</p>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">₹{b.total_amount}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(b.booking_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
