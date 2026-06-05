import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";

function Dashboard() {
  const adminName =
  localStorage.getItem("igsaAdminName") || "Admin";

const adminRole =
  localStorage.getItem("igsaAdminRole") || "board-member";

  const [stats, setStats] = useState([
    [0, "Total Events"],
    [0, "Registrations"],
    [0, "Checked-In"],
    [0, "Attendance Rate"],
    [0, "Board Members"],
    [0, "Gallery Albums"],
    [0, "Messages"],
    [0, "Announcements"],
  ]);

  const [latestRegistration, setLatestRegistration] = useState(null);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [latestEvent, setLatestEvent] = useState(null);
  const [eventInsights, setEventInsights] = useState([]);

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
          fetch(`${API_BASE_URL}/api/events`),

          fetch(`${API_BASE_URL}/api/registrations`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_BASE_URL}/api/board-members`),

          fetch(`${API_BASE_URL}/api/announcements`),

          fetch(`${API_BASE_URL}/api/gallery`),

          fetch(`${API_BASE_URL}/api/messages`, {
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

        const checkedInCount = registrations.filter(
          (student) => student.checkedIn
        ).length;

        const attendanceRate =
          registrations.length > 0
            ? Math.round((checkedInCount / registrations.length) * 100)
            : 0;

        setStats([
          [events.length, "Total Events"],
          [registrations.length, "Registrations"],
          [checkedInCount, "Checked-In"],
          [`${attendanceRate}%`, "Attendance Rate"],
          [boardMembers.length, "Board Members"],
          [gallery.length, "Gallery Albums"],
          [messages.length, "Messages"],
          [announcements.length, "Announcements"],
        ]);

        setLatestEvent(events[0] || null);
        setLatestRegistration(registrations[0] || null);
        setLatestAnnouncement(announcements[0] || null);

        setEventInsights(
          events.slice(0, 5).map((event) => {
            const registered = event.registrationCount || 0;
            const capacity = event.capacity || 0;

            return {
              title: event.title,
              capacity,
              registered,
              available: Math.max(capacity - registered, 0),
              registrationOpen: event.registrationOpen !== false,
            };
          })
        );
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
        <div className="flex items-center gap-3 flex-wrap">
  <p className="text-orange-600 font-semibold">
    Welcome back, {adminName} 👋
  </p>

  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
    {adminRole}
  </span>
</div>

        <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mt-2">
  IGSA Board Dashboard
</h1>

        <p className="text-slate-600 mt-2">
          Track IGSA events, registrations, attendance, board members, and
          updates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
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
                Check registrations and export CSV.
              </p>
            </Link>

            <Link
              to="/admin/check-in"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">QR Check-In</span>
              <p className="text-sm opacity-80 mt-2">
                Scan QR codes and mark attendance.
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
              to="/admin/gallery/upload"
              className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-blue-950 hover:text-white transition"
            >
              <span className="font-bold">Upload Gallery Album</span>
              <p className="text-sm opacity-80 mt-2">
                Add event photos to the public gallery.
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

      <div className="mt-8 bg-white rounded-3xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-blue-950 mb-6">
          Event Capacity Insights
        </h2>

        {eventInsights.length === 0 ? (
          <p className="text-slate-500">No events available.</p>
        ) : (
          <div className="space-y-5">
            {eventInsights.map((event) => {
              const percent =
                event.capacity > 0
                  ? Math.min(
                      Math.round((event.registered / event.capacity) * 100),
                      100
                    )
                  : 0;

              return (
                <div
                  key={event.title}
                  className="border border-slate-200 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold text-blue-950">
                        {event.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Registered: {event.registered}/{event.capacity} •
                        Available: {event.available}
                      </p>
                    </div>

                    {event.registrationOpen ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Open
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Closed
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    {percent}% filled
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;