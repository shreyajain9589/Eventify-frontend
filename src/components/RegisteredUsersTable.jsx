import React, { useState } from 'react';

// Hardcoded sample data for registered users
const sampleUsers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    event: 'Tech Conference 2024',
    bookingDate: '2024-11-15',
    quantity: 2
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    event: 'Music Festival',
    bookingDate: '2024-11-18',
    quantity: 1
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    event: 'Food Carnival',
    bookingDate: '2024-11-20',
    quantity: 4
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    event: 'Tech Conference 2024',
    bookingDate: '2024-11-22',
    quantity: 1
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    event: 'Art Exhibition',
    bookingDate: '2024-11-25',
    quantity: 3
  },
  {
    id: 6,
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    event: 'Music Festival',
    bookingDate: '2024-11-28',
    quantity: 2
  },
  {
    id: 7,
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    event: 'Sports Tournament',
    bookingDate: '2024-11-30',
    quantity: 1
  },
  {
    id: 8,
    name: 'Kavya Nair',
    email: 'kavya.nair@example.com',
    event: 'Food Carnival',
    bookingDate: '2024-12-02',
    quantity: 2
  },
];

export default function RegisteredUsersTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Registered Users & Bookings</h3>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No users found matching your search
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.event}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(user.bookingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {user.quantity} {user.quantity === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {sampleUsers.length} registered users
        </p>
      </div>
    </div>
  );
}
