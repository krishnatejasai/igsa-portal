import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function CreateEvent() {
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

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...event,
        capacity: Number(event.capacity),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    alert("Event created successfully!");
    navigate("/admin/events");
  } catch (error) {
    alert("Something went wrong while creating the event.");
    console.error(error);
  }
};

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">Create Event</h1>
        <p className="text-slate-600 mt-2">
          Add a new IGSA event for students to view and register.
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
            placeholder="Fall 2026 Orientation"
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
              placeholder="100"
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
            placeholder="Reitz Union, University of Florida"
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Description</label>
          <textarea
            name="description"
            value={event.description}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl h-32"
            placeholder="Write event details here..."
          />
        </div>

        <div>
          <label className="font-semibold text-blue-950">Registration Link</label>
          <input
            name="registrationLink"
            value={event.registrationLink}
            onChange={handleChange}
            className="w-full mt-2 border border-slate-300 p-4 rounded-xl"
            placeholder="https://igsauf.com/events/register"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600"
          >
            Save Event
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

export default CreateEvent;