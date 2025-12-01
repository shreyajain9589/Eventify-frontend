import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import LoadingButton from '../LoadingButton';
import Modal from '../Modal';

export default function LocationsTab() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/admin/locations');
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to fetch locations');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();

    if (!name.trim() || !displayName.trim()) {
      toast.error('Both name and displayName are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim().toLowerCase().replace(/\s+/g, '-'),
        displayName: displayName.trim(),
      };

      const res = await API.post('/admin/locations', payload);

      const newLocation = res.data;

      setLocations([...locations, newLocation]);
      toast.success('Location added successfully');

      setIsModalOpen(false);
      setName('');
      setDisplayName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add location');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Delete this location?')) return;

    try {
      await API.delete(`/admin/locations/${locationId}`);
      setLocations(locations.filter((loc) => loc._id !== locationId));
      toast.success('Location deleted successfully');
    } catch (err) {
      toast.error('Failed to delete location');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Manage Locations</h3>
          <p className="text-gray-600 mt-1">Total: {locations.length} locations</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Location
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {locations.map((location) => (
          <div
            key={location._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 truncate">
                {location.displayName}
              </span>

              <button
                onClick={() => handleDeleteLocation(location._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setName('');
          setDisplayName('');
        }}
        title="Add New Location"
      >
        <form onSubmit={handleAddLocation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internal Name (unique) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., new-york"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., New York, USA"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <LoadingButton type="submit" loading={isSubmitting} className="flex-1">
              Add Location
            </LoadingButton>

            <LoadingButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setName('');
                setDisplayName('');
              }}
            >
              Cancel
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
