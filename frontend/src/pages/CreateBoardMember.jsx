import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";
import { canManageBoard } from "../config/permissions";

function CreateBoardMember() {
  const navigate = useNavigate();

  const [member, setMember] = useState({
    name: "",
    position: "",
    email: "",
    description: "",
    image: "",
  });
  const allowBoardManagement = canManageBoard();

if (!allowBoardManagement) {
  return (
    <AdminLayout>
      <div className="bg-white rounded-3xl shadow-md p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-600 mt-3">
          Only the President and Vice President can manage board members.
        </p>
      </div>
    </AdminLayout>
  );
}

  const handleChange = (e) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setMember({
        ...member,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!member.name.trim() || !member.position.trim()) {
      alert("Please enter name and position.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/board-members`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
  },
  body: JSON.stringify(member),
});

      if (!response.ok) {
        throw new Error("Failed to create board member");
      }

      alert("Board member added successfully!");
      navigate("/admin/board");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding board member.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-5xl font-bold text-blue-950 mb-8">
        Add Board Member
      </h1>

      <div className="bg-white rounded-3xl shadow-md p-8 max-w-4xl space-y-6">
        <input
          name="name"
          value={member.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        <input
          name="position"
          value={member.position}
          placeholder="Position"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        <input
          name="email"
          value={member.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        <textarea
          name="description"
          value={member.description}
          placeholder="Short Description / Responsibilities"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl h-32"
        />

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleImage}
          className="w-full border p-4 rounded-xl"
        />

        {member.image && (
          <img
            src={member.image}
            alt="preview"
            className="w-40 h-40 object-cover rounded-full"
          />
        )}

        <button
          onClick={handleSave}
          className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold"
        >
          Save Member
        </button>
      </div>
    </AdminLayout>
  );
}

export default CreateBoardMember;