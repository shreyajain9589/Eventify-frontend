import React, { useEffect, useState } from 'react';
import API, { setAuthToken } from '../services/api';
import EventCard from '../components/EventCard';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null); // current event being edited
  const [form, setForm] = useState({
    title: '', description: '', location: '', date: '', total_seats: '', price: '', img: ''
  });

  // ✅ Check for token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin first');
      window.location.href = '/admin/login';
    } else {
      setAuthToken(token);
      fetchEvents();
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch events');
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
  // Update existing event
  const updatedData = {
    ...form,
    total_seats: Number(form.total_seats),
    available_seats: Number(form.total_seats) // reset available seats to total seats
  };

  const res = await API.put(`/events/${editingEvent._id}`, updatedData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  setEvents(events.map(ev => ev._id === editingEvent._id ? res.data : ev));
  setEditingEvent(null);
}
else {
        // Create new event
        const res = await API.post('/events', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEvents([...events, res.data]);
      }
      setForm({ title:'', description:'', location:'', date:'', total_seats:'', price:'', img:'' });
    } catch (err) {
      console.error(err);
      alert('Failed to save event');
    }
  };

  const handleDelete = (deletedId) => {
    setEvents(events.filter(e => e._id !== deletedId));
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0,16),
      total_seats: event.total_seats,
      price: event.price,
      img: event.img
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard — Events</h2>

      {/* Event Form */}
      <form onSubmit={createEvent} className="grid grid-cols-2 gap-2 mb-6">
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="border p-2 rounded"/>
        <input value={form.date} onChange={e=>setForm({...form, date:e.target.value})} type="datetime-local" className="border p-2 rounded"/>
        <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Location" className="border p-2 rounded"/>
        <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price" className="border p-2 rounded"/>
        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="col-span-2 border p-2 rounded"/>
        <input value={form.total_seats} onChange={e=>setForm({...form, total_seats:e.target.value})} placeholder="Total seats" className="border p-2 rounded"/>
        <input value={form.img} onChange={e=>setForm({...form, img:e.target.value})} placeholder="Image URL" className="border p-2 rounded"/>
        <button className="col-span-2 bg-indigo-600 text-white p-2 rounded mt-2">
          {editingEvent ? 'Update Event' : 'Create Event'}
        </button>
      </form>

      {/* Events List */}
      <div className="grid md:grid-cols-3 gap-4">
        {events.map(ev => (
          <EventCard 
            key={ev._id} 
            event={ev} 
            isAdmin={true} 
            onDelete={handleDelete} 
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
