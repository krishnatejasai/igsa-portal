import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";
import { canManageAdmins } from "../config/permissions";



function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "board-member",
  });

  const [loading, setLoading] = useState(true);

  const allowAdminManagement = canManageAdmins();

  if (!allowAdminManagement) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="text-slate-600 mt-3">
            Only the President can manage admin users.
          </p>
        </div>
      </AdminLayout>
    );
  }

  const token = localStorage.getItem("igsaAdminToken");


  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load admin users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAdmin = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert("Please fill name, email, and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to create admin user");
      }

      alert("Admin user created successfully!");

      setForm({
  name: "",
  email: "",
  password: "",
  role: "board-member",
});

      fetchAdmins();
    } catch (error) {
      console.error(error);
      alert("Unable to create admin user.");
    }
  };

  const handleDeleteAdmin = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admins/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete admin user");
      }

      setAdmins((prev) => prev.filter((admin) => admin._id !== id));
    } catch (error) {
      console.error(error);
      alert("Unable to delete admin user.");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">
          Admin Users
        </h1>

        <p className="text-slate-600 mt-2">
          Create and manage IGSA board member login access.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">
            Add New Admin
          </h2>

          <div className="space-y-4">
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
              placeholder="Email Address"
              className="w-full border border-slate-300 p-4 rounded-xl"
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Temporary Password"
              type="password"
              className="w-full border border-slate-300 p-4 rounded-xl"
            />

            <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="w-full border border-slate-300 p-4 rounded-xl"
>
  <option value="board-member">Board Member</option>
  <option value="president">President</option>
  <option value="vice-president">Vice President</option>
  <option value="treasurer">Treasurer</option>
  <option value="executive-secretary">Executive Secretary</option>
  <option value="it-director">IT Director</option>
  <option value="event-director">Event Director</option>
  <option value="event-manager">Event Manager</option>
  <option value="pr-director">PR Director</option>
  <option value="marketing-manager">Marketing Manager</option>
  <option value="social-media-manager">Social Media Manager</option>
  <option value="creative-director">Creative Director</option>
</select>

            <button
              onClick={handleCreateAdmin}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600"
            >
              Create Admin
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">
            Existing Admins
          </h2>

          {loading ? (
            <p className="text-slate-500">Loading admins...</p>
          ) : admins.length === 0 ? (
            <p className="text-slate-500">No admin users found.</p>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="border border-slate-200 rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-blue-950">
                      {admin.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {admin.email}
                    </p>

                    <p className="text-sm text-orange-600 font-semibold mt-1">
                      {admin.role}
                    </p>
                  </div>

                  {admin.email !== "admin@igsauf.com" ? (
  <button
    onClick={() => handleDeleteAdmin(admin._id)}
    className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600"
  >
    Delete
  </button>
) : (
  <span className="text-xs bg-slate-100 text-slate-500 px-3 py-2 rounded-xl font-semibold">
    Main Admin
  </span>
)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;