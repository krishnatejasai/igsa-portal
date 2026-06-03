import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState({
    title: "",
    date: "",
    message: "",
  });

  useEffect(() => {
    const savedAnnouncements =
      JSON.parse(localStorage.getItem("igsaAnnouncements")) || [];

    const selectedAnnouncement = savedAnnouncements.find(
      (item) => String(item.id) === id
    );

    if (selectedAnnouncement) {
      setAnnouncement(selectedAnnouncement);
    }
  }, [id]);

  const handleChange = (e) => {
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    if (!announcement.title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    const savedAnnouncements =
      JSON.parse(localStorage.getItem("igsaAnnouncements")) || [];

    const updatedAnnouncements = savedAnnouncements.map((item) =>
      String(item.id) === id ? announcement : item
    );

    localStorage.setItem(
      "igsaAnnouncements",
      JSON.stringify(updatedAnnouncements)
    );

    navigate("/admin/announcements");
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
          <label className="font-semibold text-blue-950">Message</label>
          <textarea
            name="message"
            value={announcement.message}
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