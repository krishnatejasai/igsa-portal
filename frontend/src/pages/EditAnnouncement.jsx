import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";
import { canManageAnnouncements } from "../config/permissions";

function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();
const allowAnnouncementManagement = canManageAnnouncements();

  const [announcement, setAnnouncement] = useState({
    title: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/announcements/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }

        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error(error);
        alert("Unable to load announcement details.");
      }
    };

    fetchAnnouncement();
  }, [id]);
  if (!allowAnnouncementManagement) {
  return (
    <AdminLayout>
      <div className="bg-white rounded-3xl shadow-md p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Access Denied
        </h1>

        <p className="text-slate-600 mt-3">
          You do not have permission to edit announcements.
        </p>
      </div>
    </AdminLayout>
  );
}

  const handleChange = (e) => {
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
    },
    body: JSON.stringify(announcement),
  }
);

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      alert("Announcement updated successfully!");
      navigate("/admin/announcements");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the announcement.");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">
          Edit Announcement
        </h1>

        <p className="text-slate-600 mt-2">
          Update IGSA announcement details.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-8 max-w-4xl space-y-6">
        <div>
          <label className="font-semibold text-blue-950">Title</label>
          <input
            name="title"
            value={announcement.title}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Date</label>
          <input
            name="date"
            value={announcement.date}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Description</label>
          <textarea
            name="description"
            value={announcement.description}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl h-36"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold"
          >
            Update Announcement
          </button>

          <button
            onClick={() => navigate("/admin/announcements")}
            className="bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditAnnouncement;