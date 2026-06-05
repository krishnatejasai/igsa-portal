import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";
import { canDeleteContent } from "../config/permissions";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [loading, setLoading] = useState(true);

  const allowDelete = canDeleteContent();

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const eventOptions = [
    "all",
    ...new Set(registrations.map((student) => student.eventTitle)),
  ];

  const filteredRegistrations = registrations.filter((student) => {
    const matchesSearch =
      `${student.name} ${student.email} ${student.phone} ${student.ufid} ${student.eventTitle} ${student.program}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesEvent =
      selectedEvent === "all" || student.eventTitle === selectedEvent;

    return matchesSearch && matchesEvent;
  });

  const checkedInCount = filteredRegistrations.filter(
    (student) => student.checkedIn
  ).length;

  const notCheckedInCount = filteredRegistrations.length - checkedInCount;

  const handleCheckIn = async (qrCode) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registrations/check-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
          },
          body: JSON.stringify({ qrCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to check in.");
        return;
      }

      alert("Attendance marked successfully!");
      fetchRegistrations();
    } catch (error) {
      console.error(error);
      alert("Unable to check in.");
    }
  };

  const handleDeleteRegistration = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this registration?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete registration");
      }

      setRegistrations((prev) =>
        prev.filter((registration) => registration._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete registration.");
    }
  };

  const exportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registrations to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "UFID",
      "Event",
      "Program",
      "QR Code",
      "Checked In",
      "Checked In At",
    ];

    const rows = filteredRegistrations.map((student) => [
      student.name,
      student.email,
      student.phone,
      student.ufid,
      student.eventTitle,
      student.program,
      student.qrCode,
      student.checkedIn ? "Yes" : "No",
      student.checkedInAt
        ? new Date(student.checkedInAt).toLocaleString()
        : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${value || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const fileEventName =
      selectedEvent === "all"
        ? "all_events"
        : selectedEvent.toLowerCase().replace(/\s+/g, "_");

    link.href = url;
    link.download = `igsa_${fileEventName}_registrations.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-950">
            Registrations
          </h1>

          <p className="text-slate-600 mt-2">
            View registrations and manage event attendance.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 w-fit"
        >
          Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-3xl font-bold text-orange-500">
            {filteredRegistrations.length}
          </h2>
          <p className="text-slate-600 mt-1">Total Registrations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-3xl font-bold text-green-600">
            {checkedInCount}
          </h2>
          <p className="text-slate-600 mt-1">Checked In</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-3xl font-bold text-red-500">
            {notCheckedInCount}
          </h2>
          <p className="text-slate-600 mt-1">Not Checked In</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, UFID, phone, event, or program..."
          className="w-full border border-slate-300 p-4 rounded-xl"
        />

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border border-slate-300 p-4 rounded-xl bg-white"
        >
          {eventOptions.map((event) => (
            <option key={event} value={event}>
              {event === "all" ? "All Events" : event}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-md overflow-x-auto">
  {loading ? (
    <p className="p-6 text-slate-500">Loading registrations...</p>
  ) : (
    <table className="w-full min-w-[1200px] table-fixed">
      <thead className="bg-blue-950 text-white">
        <tr>
          <th className="p-4 text-left w-[160px]">Name</th>
          <th className="p-4 text-left w-[230px]">Email</th>
          <th className="p-4 text-left w-[140px]">Phone</th>
          <th className="p-4 text-left w-[110px]">UFID</th>
          <th className="p-4 text-left w-[150px]">Event</th>
          <th className="p-4 text-left w-[120px]">Program</th>
          <th className="p-4 text-left w-[170px]">QR Code</th>
          <th className="p-4 text-left w-[140px]">Status</th>
          <th className="p-4 text-left w-[170px]">Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredRegistrations.length === 0 ? (
          <tr>
            <td colSpan="9" className="p-6 text-center text-slate-500">
              No registrations found
            </td>
          </tr>
        ) : (
          filteredRegistrations.map((student) => (
            <tr key={student._id} className="border-b hover:bg-slate-50">
              <td className="p-4 whitespace-normal break-words font-medium">
                {student.name}
              </td>

              <td className="p-4 whitespace-normal break-all text-sm">
                {student.email}
              </td>

              <td className="p-4 whitespace-nowrap">
                {student.phone}
              </td>

              <td className="p-4 whitespace-nowrap">
                {student.ufid}
              </td>

              <td className="p-4 whitespace-normal break-words">
                {student.eventTitle}
              </td>

              <td className="p-4 whitespace-normal break-words">
                {student.program}
              </td>

              <td className="p-4 text-xs break-all">
                {student.qrCode || "Old registration"}
              </td>

              <td className="p-4">
                {student.checkedIn ? (
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Checked In
                  </span>
                ) : (
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Not Checked In
                  </span>
                )}
              </td>

              <td className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {student.qrCode && !student.checkedIn && (
                    <button
                      onClick={() => handleCheckIn(student.qrCode)}
                      className="bg-blue-950 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      Check-In
                    </button>
                  )}

                  {allowDelete && (
                    <button
                      onClick={() => handleDeleteRegistration(student._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )}
</div>
    </AdminLayout>
  );
}

export default AdminRegistrations;