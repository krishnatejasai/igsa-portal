import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ufid: "",
    program: "",
    dietaryPreference: "",
  });

  const allEvents = [
    { id: 1, title: "Fall 2026 Orientation" },
    { id: 2, title: "Diwali Night" },
    { id: 3, title: "Networking Session" },
    ...(JSON.parse(localStorage.getItem("igsaEvents")) || []),
  ];

  const selectedEvent = allEvents.find((event) => String(event.id) === id);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    const existingRegistrations =
      JSON.parse(localStorage.getItem("igsaRegistrations")) || [];

    const newRegistration = {
      id: Date.now(),
      eventId: id,
      eventTitle: selectedEvent?.title || "IGSA Event",
      ...form,
    };

    localStorage.setItem(
      "igsaRegistrations",
      JSON.stringify([...existingRegistrations, newRegistration])
    );

    alert("Registration successful!");
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-16">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-950 mb-2">
  Register for {selectedEvent?.title}
</h1>

        <p className="text-orange-600 font-semibold mb-8">
          {selectedEvent?.title || "IGSA Event"}
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
  required
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