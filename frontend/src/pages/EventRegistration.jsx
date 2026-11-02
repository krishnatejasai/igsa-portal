import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import API_BASE_URL from "../config/api";

function EventRegistration() {
  const { id } = useParams();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredData, setRegisteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ufid: "",
    program: "",
    slotId: "",
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
        setError("Unable to load event details. Please refresh to try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!selectedEvent?.slotQuestion?.enabled || registeredData) return;
    let active = true;
    const refresh = async () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`, { cache: 'no-store' });
        if (response.ok && active) setSelectedEvent(await response.json());
      } catch { /* Keep the last availability; booking rechecks it server-side. */ }
    };
    const timer = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [id, selectedEvent?.slotQuestion?.enabled, registeredData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (submitting) return;
    const required = ['name', 'email', ...['phone', 'ufid', 'program'].filter(key => (selectedEvent?.registrationFields?.[key] || 'required') === 'required')];
    if (required.some(key => !form[key].trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please complete the required fields and enter a valid email address.'); return;
    }
    if (selectedEvent?.slotQuestion?.enabled && !form.slotId) {
      setError('Please choose a time slot.'); return;
    }
    setError('');
    setSubmitting(true);
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
        setError(data.message || "Registration failed.");
        if (response.status === 409) {
          const latest = await fetch(`${API_BASE_URL}/api/events/${id}`, { cache: 'no-store' });
          if (latest.ok) setSelectedEvent(await latest.json());
        }
        return;
      }

      setRegisteredData(data);
    } catch (error) {
      console.error(error);
      setError("Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
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

  if (!registeredData && selectedEvent?.registrationOpen === false) {
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

  if (!selectedEvent && !loading) return <main className="min-h-screen px-6 pt-40 text-center"><p role="alert">{error || 'Event not found.'}</p><Link to="/events">Back to events</Link></main>;

  if (registeredData?.waitlisted) {
    return <main className="min-h-screen px-6 py-16 text-center"><h1 className="text-3xl font-bold">You’re on the waitlist</h1><p className="mt-4">Your place is not confirmed yet. Contact IGSA for updates about availability.</p><Link to="/events">Back to events</Link></main>;
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

          {registeredData.slotLabel && <p className="font-semibold text-blue-950 mb-5">{registeredData.slotQuestion}: {registeredData.slotLabel}</p>}
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
            placeholder="Full name *"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address *"
            className="w-full border border-slate-300 p-4 rounded-xl"
          />

          {['phone', 'ufid', 'program'].map(key => {
            const mode = selectedEvent.registrationFields?.[key] || 'required';
            if (mode === 'hidden') return null;
            const label = { phone: 'Phone number', ufid: 'UFID', program: 'Program / major' }[key];
            return <label key={key} className="block font-semibold text-blue-950">{label} {mode === 'optional' ? '(optional)' : '*'}<input name={key} value={form[key]} onChange={handleChange} maxLength={254} required={mode === 'required'} className="w-full mt-2 border border-slate-300 p-4 rounded-xl" /></label>;
          })}
          {selectedEvent.slotQuestion?.enabled && <label className="block font-semibold text-blue-950">{selectedEvent.slotQuestion.label} *
            <select name="slotId" value={form.slotId} onChange={handleChange} required className="w-full mt-2 border border-slate-300 p-4 rounded-xl">
              <option value="">Select a time slot</option>
              {selectedEvent.slotQuestion.options.map(slot => <option key={slot.id} value={slot.id} disabled={slot.remaining === 0}>{slot.label} — {slot.remaining === 0 ? 'Full' : `${slot.remaining} seats left`}</option>)}
            </select>
            <span className="block text-sm font-normal text-slate-600 mt-2">Full slots cannot be selected. Availability is checked again when you register.</span>
          </label>}
          {selectedEvent.remaining === 0 && <p role="status" className="font-semibold text-orange-700">This event is full.</p>}
          {error && <p role="alert" className="text-red-700">{error}</p>}

          <button
            onClick={handleRegister}
            disabled={submitting || selectedEvent.remaining === 0 || (selectedEvent.slotQuestion?.enabled && (!form.slotId || selectedEvent.slotQuestion.options.find(slot => slot.id === form.slotId)?.remaining === 0))}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600"
          >
            {submitting ? "Registering…" : "Register"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default EventRegistration;