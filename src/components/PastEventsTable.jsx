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

  const fetchPastEvents = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/events');
      const now = new Date();
      const past = res.data.filter(event => new Date(event.date) < now);
      setPastEvents(past);
      
      // Fetch booking counts for all past events
      const counts = {};
      for (const event of past) {
        try {
          const bookingsRes = await API.get(`/bookings/event/${event._id}`);
          counts[event._id] = bookingsRes.data.length;
        } catch (err) {
          counts[event._id] = 0;
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
    if (eventBookings[eventId]) {
      // Already fetched, just toggle
      setExpandedEvent(expandedEvent === eventId ? null : eventId);
      return;
    }

    try {
      const res = await API.get(`/bookings/event/${eventId}`);
      setEventBookings(prev => ({
        ...prev,
        [eventId]: res.data
      }));
      setExpandedEvent(eventId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch bookings for this event');
    }
  };

  const toggleEventExpansion = (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      fetchEventBookings(eventId);
    }
  };

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tickets Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={event.img}
                          alt={event.title}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticketsSold} / {event.total_seats}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleEventExpansion(event._id)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-1"
                        disabled={bookingCount === 0}
                      >
                        {isExpanded ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Hide Users
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {bookingCount > 0 ? `View Users (${bookingCount})` : 'No Bookings'}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && bookings.length > 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Registered Users ({bookings.length})
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {bookings.map((booking, index) => (
                                <div
                                  key={booking._id}
                                  className="bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                          <span className="text-indigo-600 font-semibold text-sm">
                                            {booking.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div>
                                          <p className="font-medium text-gray-900">{booking.name}</p>
                                          <p className="text-xs text-gray-500">{booking.email}</p>
                                        </div>
                                      </div>
                                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                          </svg>
                                          {booking.mobile}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                          </svg>
                                          {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-gray-900">
                                        ₹{booking.total_amount}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(booking.booking_date).toLocaleDateString()}
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
