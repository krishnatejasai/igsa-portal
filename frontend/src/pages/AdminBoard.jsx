import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function AdminBoard() {
  const defaultMembers = [
    { id: 1, name: "Sai Sri Krishna Teja Sanku", position: "President", isDefault: true },
    { id: 2, name: "Drushtant Patil", position: "Vice President", isDefault: true },
    { id: 3, name: "Simha Kishore Reddy", position: "Treasurer", isDefault: true },
    { id: 4, name: "Lohith Maricharla", position: "Executive Secretary", isDefault: true },
    { id: 5, name: "Riddhi Nijhawan", position: "Creative Director", isDefault: true },
    { id: 6, name: "Jatin Salve", position: "Event Director", isDefault: true },
    { id: 7, name: "Anitha Madapakula", position: "Event Manager", isDefault: true },
    { id: 8, name: "Pavan Karthik Chila", position: "Social Media Manager", isDefault: true },
    { id: 9, name: "Ayush Ranjan", position: "Marketing Manager", isDefault: true },
    { id: 10, name: "Himanshu Potham Shetty", position: "IT Director", isDefault: true },
    { id: 11, name: "Atish Maragur", position: "PR Director", isDefault: true },
  ];

  const [members, setMembers] = useState(() => {
    const savedMembers =
      JSON.parse(localStorage.getItem("igsaBoardMembers")) || [];

    return [...defaultMembers, ...savedMembers];
  });

  const handleRemove = (id, isDefault) => {
    if (isDefault) {
      alert("Default board members cannot be removed.");
      return;
    }

    const confirmRemove = window.confirm(
      "Are you sure you want to remove this board member?"
    );

    if (!confirmRemove) return;

    const savedMembers =
      JSON.parse(localStorage.getItem("igsaBoardMembers")) || [];

    const updatedSavedMembers = savedMembers.filter(
      (member) => member.id !== id
    );

    localStorage.setItem(
      "igsaBoardMembers",
      JSON.stringify(updatedSavedMembers)
    );

    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-blue-950">
            Board Members
          </h1>

          <p className="text-slate-600 mt-2">
            Manage IGSA executive board.
          </p>
        </div>

        <Link
          to="/admin/board/create"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          + Add Member
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Role</th>
              <th className="text-left p-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-slate-50">
                <td className="p-5 flex items-center gap-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold">
                      {member.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}

                  <span>{member.name}</span>
                </td>

                <td className="p-5">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {member.position}
                  </span>
                </td>

                <td className="p-5 space-x-3">
                  <button className="bg-blue-950 text-white px-4 py-2 rounded-xl">
                    Edit
                  </button>

                  <button
                    onClick={() => handleRemove(member.id, member.isDefault)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminBoard;