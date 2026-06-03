import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements`);

      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
  `${API_BASE_URL}/api/announcements/${id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
    },
  }
);

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      setAnnouncements((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete announcement.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-blue-950">
            Announcements
          </h1>

          <p className="text-slate-600 mt-2">
            Manage IGSA announcements.
          </p>
        </div>

        <Link
          to="/admin/announcements/create"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          + New Announcement
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="p-6 text-slate-500">No announcements found.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="text-left p-5">Announcement</th>
                <th className="text-left p-5">Date</th>
                <th className="text-left p-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {announcements.map((item) => (
                <tr key={item._id} className="border-b hover:bg-slate-50">
                  <td className="p-5">{item.title}</td>
                  <td className="p-5">{item.date}</td>

                  <td className="p-5 space-x-3">
                    <Link
                      to={`/admin/announcements/edit/${item._id}`}
                      className="bg-blue-950 text-white px-4 py-2 rounded-xl"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl"
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

export default AdminAnnouncements;