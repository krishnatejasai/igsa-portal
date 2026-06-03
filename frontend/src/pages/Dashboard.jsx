import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function Dashboard() {
  const [stats, setStats] = useState([
    [0, "Total Events"],
    [0, "Registrations"],
    [0, "Board Members"],
    [0, "Announcements"],
  ]);

  const [latestRegistration, setLatestRegistration] = useState(null);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [latestEvent, setLatestEvent] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("igsaAdminToken");

const [
  eventsRes,
  registrationsRes,
  boardRes,
  announcementsRes,
  galleryRes,
  messagesRes,
] = await Promise.all([
  fetch("http://localhost:5000/api/events"),

  fetch("http://localhost:5000/api/registrations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  fetch("http://localhost:5000/api/board-members"),

  fetch("http://localhost:5000/api/announcements"),

  fetch("http://localhost:5000/api/gallery"),

  fetch("http://localhost:5000/api/messages", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
]);

const events = await eventsRes.json();
const registrations = await registrationsRes.json();
const boardMembers = await boardRes.json();
const announcements = await announcementsRes.json();
const gallery = await galleryRes.json();
const messages = await messagesRes.json();

setStats([
  [events.length, "Total Events"],
  [registrations.length, "Registrations"],
  [gallery.length, "Gallery Photos"],
  [messages.length, "Messages"],
]);

setLatestEvent(events[0] || null);
setLatestRegistration(registrations[0] || null);
setLatestAnnouncement(announcements[0] || null);
      } catch (error) {
        console.error(error);
        alert("Unable to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

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
          Manage IGSA events, registrations, board members, and announcements.
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
              to="/admin/board/create"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">Add Board Member</span>
              <p className="text-sm opacity-80 mt-2">
                Add or update IGSA board members.
              </p>
            </Link>

            <Link
              to="/admin/announcements/create"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">Post Announcement</span>
              <p className="text-sm opacity-80 mt-2">
                Share updates with students.
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-blue-950 text-white rounded-3xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-5">Live Updates</h2>

          <div className="space-y-5 text-blue-100">
            <div>
              <p className="font-semibold text-white">Latest Event</p>
              <p>{latestEvent ? latestEvent.title : "No events yet"}</p>
            </div>

            <div>
              <p className="font-semibold text-white">Latest Registration</p>
              <p>
                {latestRegistration
                  ? `${latestRegistration.name} registered for ${latestRegistration.eventTitle}`
                  : "No registrations yet"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">Latest Announcement</p>
              <p>
                {latestAnnouncement
                  ? latestAnnouncement.title
                  : "No announcements yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;