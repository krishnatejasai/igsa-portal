import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import API_BASE_URL from "../config/api";

function EventRegistration() {
  const { id } = useParams();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredData, setRegisteredData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ufid: "",
    program: "",
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
      } finally {
        setLoading(false);
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
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.ufid.trim() ||
      !form.program.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

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

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      setRegisteredData(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while registering.");
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("registration-qr-code");

    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${registeredData.name}-IGSA-QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-16">
        <p className="text-slate-600">Loading event details...</p>
      </main>
    );
  }

  if (selectedEvent?.registrationOpen === false) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Registrations Closed
          </h1>

          <p className="text-slate-600 mb-6">
            Registrations for {selectedEvent?.title || "this event"} are
            currently closed.
          </p>

          <Link
            to="/events"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  if (registeredData) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl text-center">
          <h1 className="text-4xl font-bold text-blue-950 mb-3">
            Registration Successful!
          </h1>

          <p className="text-slate-600 mb-6">
            Please save this QR code and show it at the event check-in desk.
          </p>

          <div className="flex justify-center bg-slate-50 rounded-2xl p-6 mb-6">
            <QRCodeCanvas
              id="registration-qr-code"
              value={registeredData.qrCode}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-left bg-slate-50 rounded-2xl p-5 mb-6">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {registeredData.name}
            </p>

            <p>
              <span className="font-semibold">Event:</span>{" "}
              {registeredData.eventTitle}
            </p>

            <p>
              <span className="font-semibold">QR Code:</span>{" "}
              {registeredData.qrCode}
            </p>
          </div>

          <button
            onClick={downloadQRCode}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
          >
            Download QR Code
          </button>
        </div>
      </main>
    );
  }

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