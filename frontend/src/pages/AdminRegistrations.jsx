import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminRegistrations() {
  const [registrations] = useState(() => {
    return JSON.parse(localStorage.getItem("igsaRegistrations")) || [];
  });

  const [search, setSearch] = useState("");

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

    const headers = ["Name", "Email", "Phone", "Event", "Program"];

    const rows = registrations.map((student) => [
      student.name,
      student.email,
      student.phone,
      student.eventTitle,
      student.program,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
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
        <table className="w-full min-w-[900px]">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Program</th>
            </tr>
          </thead>

          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-slate-500"
                >
                  No registrations found
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((student) => (
                <tr key={student.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{student.phone}</td>
                  <td className="p-4">{student.eventTitle}</td>
                  <td className="p-4">{student.program}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminRegistrations;