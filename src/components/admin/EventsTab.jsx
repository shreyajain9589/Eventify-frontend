import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import EventCard from '../EventCard';
import { useToast } from '../../contexts/ToastContext';
import { useForm } from '../../hooks/useForm';
import { validators, composeValidators } from '../../utils/validation';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import Modal from '../Modal';

export default function EventsTab() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const toast = useToast();

  const form = useForm(
    {
      title: '',
      description: '',
      location: '',
      date: '',
      total_seats: '',
      price: '',
      img: ''
    },
    {
      title: validators.required,
      description: validators.required,
      location: validators.required,
      date: validators.required,
      total_seats: composeValidators(validators.required, validators.number, validators.min(1)),
      price: composeValidators(validators.required, validators.number, validators.min(0)),
      img: validators.required,
    }
  );

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/events');
      const now = new Date();
      const upcoming = res.data.filter(event => new Date(event.date) >= now);
      setEvents(upcoming);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await API.get('/admin/locations');

      let locationsData = [];
      if (Array.isArray(res.data)) {
        locationsData = res.data;
      } else if (Array.isArray(res.data?.data)) {
        locationsData = res.data.data;
      }
      setLocations(locationsData.map(loc => loc.displayName));
    } catch {
      setLocations([]); // safe fallback
    }
  };

  const createOrUpdateEvent = form.handleSubmit(async (values) => {
    try {
      const finalLocation = values.location === 'Other' ? customLocation : values.location;

      if (values.location === 'Other' && !customLocation.trim()) {
        toast.error('Please enter a custom location');
        return;
      }

      const payload = {
        ...values,
        location: finalLocation,
        total_seats: Number(values.total_seats),
        available_seats: Number(values.total_seats),
        price: Number(values.price),
      };

      if (editingEvent) {
        const res = await API.put(`/events/${editingEvent._id}`, payload);
        setEvents(events.map(ev => (ev._id === editingEvent._id ? res.data : ev)));
        toast.success('Event updated successfully');
        setEditingEvent(null);
      } else {
        const res = await API.post('/events', payload);
        setEvents([...events, res.data]);
        toast.success('Event created successfully');
      }

      form.reset();
      setImagePreview('');
      setShowCustomLocation(false);
      setCustomLocation('');
    } catch (err) {
      toast.error(err.message || 'Failed to save event');
    }
  });

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await API.delete(`/events/${eventToDelete._id}`);
      setEvents(events.filter(e => e._id !== eventToDelete._id));
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete event');
    } finally {
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);

    const isCustom = !locations.includes(event.location);

    form.setValues({
      title: event.title,
      description: event.description,
      location: isCustom ? 'Other' : event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      total_seats: String(event.total_seats),
      price: String(event.price),
      img: event.img,
    });

    if (isCustom) {
      setShowCustomLocation(true);
      setCustomLocation(event.location);
    } else {
      setShowCustomLocation(false);
      setCustomLocation('');
    }

    setImagePreview(event.img);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    form.reset();
    setImagePreview('');
    setShowCustomLocation(false);
    setCustomLocation('');
  };

  const handleLocationChange = (value) => {
    form.handleChange('location', value);
    if (value === 'Other') {
      setShowCustomLocation(true);
    } else {
      setShowCustomLocation(false);
      setCustomLocation('');
    }
  };

  const handleImageChange = (value) => {
    form.handleChange('img', value);
    setImagePreview(value);
  };

  const locationOptions = [...locations, 'Other'];

  return (
    <div className="space-y-8">
      {/* Event Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </h3>

        <form onSubmit={createOrUpdateEvent} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Event Title"
              value={form.values.title}
              onChange={(v) => form.handleChange('title', v)}
              onBlur={() => form.handleBlur('title')}
              error={form.touched.title && form.errors.title}
              required
            />

            <Input
              label="Date & Time"
              type="datetime-local"
              value={form.values.date}
              onChange={(v) => form.handleChange('date', v)}
              onBlur={() => form.handleBlur('date')}
              error={form.touched.date && form.errors.date}
              required
            />

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                value={form.values.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onBlur={() => form.handleBlur('location')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select location</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price (₹)"
              type="number"
              value={form.values.price}
              onChange={(v) => form.handleChange('price', v)}
              onBlur={() => form.handleBlur('price')}
              error={form.touched.price && form.errors.price}
              required
            />

            <Input
              label="Total Seats"
              type="number"
              value={form.values.total_seats}
              onChange={(v) => form.handleChange('total_seats', v)}
              onBlur={() => form.handleBlur('total_seats')}
              error={form.touched.total_seats && form.errors.total_seats}
              required
            />

            <Input
              label="Image URL"
              value={form.values.img}
              onChange={handleImageChange}
              onBlur={() => form.handleBlur('img')}
              error={form.touched.img && form.errors.img}
              required
            />
          </div>

          {showCustomLocation && (
            <Input
              label="Custom Location"
              value={customLocation}
              onChange={setCustomLocation}
              placeholder="Enter custom location"
              required
            />
          )}

          <Input
            label="Description"
            value={form.values.description}
            onChange={(v) => form.handleChange('description', v)}
            onBlur={() => form.handleBlur('description')}
            error={form.touched.description && form.errors.description}
            required
          />

          {imagePreview && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Image Preview
              </label>
              <img
                src={imagePreview}
                alt="preview"
                className="w-full max-w-md h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  toast.error('Invalid image URL');
                }}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <LoadingButton
              type="submit"
              loading={form.isSubmitting}
              className="flex-1"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </LoadingButton>

            {editingEvent && (
              <LoadingButton
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </LoadingButton>
            )}
          </div>
        </form>
      </div>

      {/* Events List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Upcoming Events ({events.length})</h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No events created yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
              <EventCard
                key={ev._id}
                event={ev}
                isAdmin={true}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{eventToDelete?.title}</strong>?
          </p>

          <div className="flex gap-3 justify-end">
            <LoadingButton variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </LoadingButton>

            <LoadingButton variant="danger" onClick={confirmDelete}>
              Delete Event
            </LoadingButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
