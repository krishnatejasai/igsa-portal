import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config/api";

function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ufid: "",
    program: "",
    dietaryPreference: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        setSelectedEvent(data);
      } catch (error) {
        console.error(error);
        alert("Unable to load event details.");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: id,
          eventTitle: selectedEvent?.title || "IGSA Event",
          ...form,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while registering.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-16">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-950 mb-2">
          Register for {selectedEvent?.title || "IGSA Event"}
        </h1>

        <p className="text-orange-600 font-semibold mb-8">
          {selectedEvent?.date} • {selectedEvent?.location}
        </p>

        <div className="space-y-5">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="UF Email"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <input
            name="ufid"
            value={form.ufid}
            onChange={handleChange}
            placeholder="UFID"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <input
            name="program"
            value={form.program}
            onChange={handleChange}
            placeholder="Program / Major"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <input
            name="dietaryPreference"
            value={form.dietaryPreference}
            onChange={handleChange}
            placeholder="Dietary Preference"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600"
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}

export default EventRegistration;