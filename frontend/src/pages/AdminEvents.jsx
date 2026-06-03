import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function AdminEvents() {
  const defaultEvents = [
    {
      id: 1,
      title: "Fall 2026 Orientation",
      date: "August 2026",
      registrations: 52,
      isDefault: true,
    },
    {
      id: 2,
      title: "Diwali Night",
      date: "October 2026",
      registrations: 120,
      isDefault: true,
    },
    {
      id: 3,
      title: "Networking Session",
      date: "November 2026",
      registrations: 35,
      isDefault: true,
    },
  ];

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("igsaEvents")) || [];
    setEvents([...defaultEvents, ...savedEvents]);
  }, []);

  const handleDelete = (id, isDefault) => {
    if (isDefault) {
      alert("Default sample events cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    const savedEvents = JSON.parse(localStorage.getItem("igsaEvents")) || [];
    const updatedSavedEvents = savedEvents.filter((event) => event.id !== id);

    localStorage.setItem("igsaEvents", JSON.stringify(updatedSavedEvents));

    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
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
        <table className="w-full">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Registrations</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-slate-50">
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.date || "Not added"}</td>
                <td className="p-4">{event.registrations}</td>
                <td className="p-4 flex gap-2">
                  <Link
                    to={`/admin/events/edit/${event.id}`}
                    className="bg-blue-950 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(event.id, event.isDefault)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminEvents;