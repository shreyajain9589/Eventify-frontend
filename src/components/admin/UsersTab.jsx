import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Modal from "../Modal";
import { useToast } from "../../contexts/ToastContext";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const viewBookings = async (user) => {
    setSelectedUser(user);

    try {
      const res = await API.get(`/admin/users/${user._id}/bookings`);

      if (res.data.success) {
        setUserBookings(res.data.bookings);
      } else {
        setUserBookings([]);
      }
    } catch (err) {
      toast.error("Failed to fetch user bookings");
      setUserBookings([]);
    }
  };

  return (
    <div className="space-y-6">

      <h3 className="text-2xl font-bold text-gray-900">Users</h3>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-auto shadow rounded-lg border">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Mobile</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.lastBooking?.mobile || "--"}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => viewBookings(u)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      View Bookings
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BOOKING MODAL */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setUserBookings([]);
        }}
        title={`Bookings for ${selectedUser?.name}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-auto">

          {userBookings.length === 0 ? (
            <p className="text-gray-600">No bookings found for this user.</p>
          ) : (
            userBookings.map((b) => (
              <div
                key={b._id}
                className="p-4 border rounded-lg shadow-sm bg-white space-y-2"
              >
                <h4 className="font-semibold text-lg">
                  {b.event?.title || "Event Deleted"}
                </h4>

                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {b.event?.date}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Seats:</strong> {b.quantity}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Booking Date:</strong>{" "}
                  {new Date(b.createdAt).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {b.event?.location}
                </p>

                {b.event?.coverImage && (
                  <img
                    src={b.event.coverImage}
                    alt="event"
                    className="h-32 w-full object-cover rounded"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
