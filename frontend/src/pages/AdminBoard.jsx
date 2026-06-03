import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function AdminBoard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/board-members");

      if (!response.ok) {
        throw new Error("Failed to fetch board members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load board members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemove = async (id) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this board member?"
    );

    if (!confirmRemove) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/board-members/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove board member");
      }

      setMembers((prev) => prev.filter((member) => member._id !== id));
    } catch (error) {
      console.error(error);
      alert("Unable to remove board member.");
    }
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
        {loading ? (
          <p className="p-6 text-slate-500">Loading board members...</p>
        ) : members.length === 0 ? (
          <p className="p-6 text-slate-500">No board members found.</p>
        ) : (
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
                <tr key={member._id} className="border-b hover:bg-slate-50">
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

                  <td className="p-5">
                    <button
                      onClick={() => handleRemove(member._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminBoard;