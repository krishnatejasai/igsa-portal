import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/registrations");

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

    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((student) =>
    `${student.name} ${student.email} ${student.phone} ${student.eventTitle} ${student.program}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const exportCSV = () => {
    if (registrations.length === 0) {
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
      "Dietary Preference",
    ];

    const rows = registrations.map((student) => [
      student.name,
      student.email,
      student.phone,
      student.ufid,
      student.eventTitle,
      student.program,
      student.dietaryPreference,
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

    link.href = url;
    link.download = "igsa_registrations.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-blue-950">
            Registrations
          </h1>

          <p className="text-slate-600 mt-2">
            View all student registrations.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, phone, event, or program..."
        className="w-full mb-6 border border-slate-300 p-4 rounded-xl"
      />

      <div className="bg-white rounded-3xl shadow-md overflow-x-auto">
        {loading ? (
          <p className="p-6 text-slate-500">Loading registrations...</p>
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">UFID</th>
                <th className="p-4 text-left">Event</th>
                <th className="p-4 text-left">Program</th>
                <th className="p-4 text-left">Dietary</th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-6 text-center text-slate-500"
                  >
                    No registrations found
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-4">{student.name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.phone}</td>
                    <td className="p-4">{student.ufid}</td>
                    <td className="p-4">{student.eventTitle}</td>
                    <td className="p-4">{student.program}</td>
                    <td className="p-4">
                      {student.dietaryPreference || "None"}
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