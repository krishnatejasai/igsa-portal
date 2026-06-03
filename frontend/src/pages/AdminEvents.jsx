import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load events from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
  },
});

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete event.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-950">
            Events Management
          </h1>
          <p className="text-slate-600 mt-2">Manage all IGSA events.</p>
        </div>

        <Link
          to="/admin/events/create"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
        >
          + Create Event
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="p-6 text-slate-500">No events found.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="p-4 text-left">Event</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Capacity</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{event.title}</td>
                  <td className="p-4">{event.date || "Not added"}</td>
                  <td className="p-4">{event.capacity || 0}</td>

                  <td className="p-4 flex gap-2">
                    <Link
                      to={`/admin/events/edit/${event._id}`}
                      className="bg-blue-950 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEvents;