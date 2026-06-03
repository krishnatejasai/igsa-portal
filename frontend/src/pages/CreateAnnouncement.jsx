import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function CreateAnnouncement() {
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState({
    title: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!announcement.title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    const saved =
      JSON.parse(localStorage.getItem("igsaAnnouncements")) || [];

    const newAnnouncement = {
      id: Date.now(),
      ...announcement,
    };

    localStorage.setItem(
      "igsaAnnouncements",
      JSON.stringify([...saved, newAnnouncement])
    );

    navigate("/admin/announcements");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">
          Create Announcement
        </h1>

        <p className="text-slate-600 mt-2">
          Share an update with IGSA students.
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
            placeholder="Fall Orientation Registration Open"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Date</label>
          <input
            name="date"
            value={announcement.date}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
            placeholder="June 2026"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Message</label>
          <textarea
            name="message"
            value={announcement.message}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl h-36"
            placeholder="Write announcement details..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold"
          >
            Save Announcement
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

export default CreateAnnouncement;