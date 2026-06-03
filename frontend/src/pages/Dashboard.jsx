import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function Dashboard() {
  const defaultEventsCount = 3;

  const [eventsCount] = useState(() => {
    const savedEvents = JSON.parse(localStorage.getItem("igsaEvents")) || [];
    return defaultEventsCount + savedEvents.length;
  });

  const [registrationsCount] = useState(() => {
    const registrations =
      JSON.parse(localStorage.getItem("igsaRegistrations")) || [];
    return registrations.length;
  });

  const [galleryCount] = useState(() => {
    const gallery = JSON.parse(localStorage.getItem("igsaGallery")) || [];
    return gallery.length;
  });

  const [messagesCount] = useState(() => {
    const messages = JSON.parse(localStorage.getItem("igsaMessages")) || [];
    return messages.length;
  });

  const [latestRegistration] = useState(() => {
    const registrations =
      JSON.parse(localStorage.getItem("igsaRegistrations")) || [];
    return registrations.length > 0
      ? registrations[registrations.length - 1]
      : null;
  });

  const [latestGallery] = useState(() => {
    const gallery = JSON.parse(localStorage.getItem("igsaGallery")) || [];
    return gallery.length > 0 ? gallery[gallery.length - 1] : null;
  });

  const [latestMessage] = useState(() => {
    const messages = JSON.parse(localStorage.getItem("igsaMessages")) || [];
    return messages.length > 0 ? messages[messages.length - 1] : null;
  });

  const stats = [
    [eventsCount, "Total Events"],
    [registrationsCount, "Registrations"],
    [galleryCount, "Gallery Photos"],
    [messagesCount, "Messages"],
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="text-orange-600 font-semibold">
          Welcome back, Krishna 👋
        </p>

        <h1 className="text-4xl font-bold text-blue-950 mt-2">
          Dashboard
        </h1>

        <p className="text-slate-600 mt-2">
          Manage IGSA events, registrations, gallery updates, and student
          messages.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {stats.map(([number, label]) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-4xl font-bold text-orange-500">{number}</h2>
            <p className="text-slate-600 mt-2">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">
            Quick Actions
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Link
              to="/admin/events/create"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">Create New Event</span>
              <p className="text-sm opacity-80 mt-2">
                Add a new IGSA event for students.
              </p>
            </Link>

            <Link
              to="/admin/registrations"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">View Registrations</span>
              <p className="text-sm opacity-80 mt-2">
                Check all student registrations.
              </p>
            </Link>

            <Link
              to="/admin/gallery/upload"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">Upload Gallery Photos</span>
              <p className="text-sm opacity-80 mt-2">
                Add event memories to gallery.
              </p>
            </Link>

            <Link
              to="/admin/messages"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">View Messages</span>
              <p className="text-sm opacity-80 mt-2">
                Read student questions and inquiries.
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-blue-950 text-white rounded-3xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-5">Live Updates</h2>

          <div className="space-y-5 text-blue-100">
            <div>
              <p className="font-semibold text-white">Latest Registration</p>
              <p>
                {latestRegistration
                  ? `${latestRegistration.name} registered for ${latestRegistration.eventTitle}`
                  : "No registrations yet"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">Latest Gallery Upload</p>
              <p>
                {latestGallery
                  ? `${latestGallery.album} photo uploaded`
                  : "No gallery uploads yet"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">Latest Message</p>
              <p>
                {latestMessage
                  ? `${latestMessage.name}: ${latestMessage.subject}`
                  : "No messages yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;