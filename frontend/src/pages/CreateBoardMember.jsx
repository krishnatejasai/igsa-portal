import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function CreateBoardMember() {
  const navigate = useNavigate();

  const [member, setMember] = useState({
    name: "",
    position: "",
    email: "",
    image: "",
  });

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

  const handleSave = () => {
    const savedMembers =
      JSON.parse(localStorage.getItem("igsaBoardMembers")) || [];

    const newMember = {
      id: Date.now(),
      ...member,
    };

    savedMembers.push(newMember);

    localStorage.setItem(
      "igsaBoardMembers",
      JSON.stringify(savedMembers)
    );

    navigate("/admin/board");
  };

  return (
    <AdminLayout>
      <h1 className="text-5xl font-bold text-blue-950 mb-8">
        Add Board Member
      </h1>

      <div className="bg-white rounded-3xl shadow-md p-8 max-w-4xl space-y-6">

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        <input
          name="position"
          placeholder="Position"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-4 rounded-xl"
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