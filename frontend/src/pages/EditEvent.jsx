import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    category: "Orientation",
    date: "",
    time: "",
    capacity: "",
    location: "",
    description: "",
    registrationLink: "",
  });

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("igsaEvents")) || [];
    const selectedEvent = savedEvents.find((item) => String(item.id) === id);

    if (selectedEvent) {
      setEvent(selectedEvent);
    }
  }, [id]);

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    const savedEvents = JSON.parse(localStorage.getItem("igsaEvents")) || [];

    const updatedEvents = savedEvents.map((item) =>
      String(item.id) === id ? event : item
    );

    localStorage.setItem("igsaEvents", JSON.stringify(updatedEvents));
    navigate("/admin/events");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">Edit Event</h1>
        <p className="text-slate-600 mt-2">
          Update IGSA event information.
        </p>
      </div>

      <form className="bg-white rounded-3xl shadow-md p-8 max-w-5xl space-y-6">
        <div>
          <label className="font-semibold text-blue-950">Event Title</label>
          <input
            name="title"
            value={event.title}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Event Category</label>
          <select
            name="category"
            value={event.category}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
          >
            <option>Orientation</option>
            <option>Cultural</option>
            <option>Professional</option>
            <option>Sports</option>
            <option>Networking</option>
            <option>Workshop</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-blue-950">Date</label>
            <input
              name="date"
              value={event.date}
              onChange={handleChange}
              type="date"
              className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-blue-950">Time</label>
            <input
              name="time"
              value={event.time}
              onChange={handleChange}
              type="time"
              className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-blue-950">Capacity</label>
            <input
              name="capacity"
              value={event.capacity}
              onChange={handleChange}
              type="number"
              className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-blue-950">Location</label>
          <input
            name="location"
            value={event.location}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Description</label>
          <textarea
            name="description"
            value={event.description}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl h-32"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Registration Link</label>
          <input
            name="registrationLink"
            value={event.registrationLink}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleUpdate}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600"
          >
            Update Event
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default EditEvent;