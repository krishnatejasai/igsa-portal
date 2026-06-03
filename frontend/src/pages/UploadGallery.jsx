import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function UploadGallery() {
  const navigate = useNavigate();

  const [album, setAlbum] = useState("");
  const [image, setImage] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!album.trim()) {
      alert("Please enter an album name.");
      return;
    }

    if (!image) {
      alert("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
},
        body: JSON.stringify({
          album,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      alert("Photo uploaded successfully!");
      navigate("/admin/gallery");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while uploading photo.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-5xl font-bold text-blue-950 mb-8">
        Upload Gallery Photo
      </h1>

      <div className="bg-white rounded-3xl shadow-md p-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <label className="font-semibold">Album Name</label>

            <input
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full mt-2 border p-4 rounded-xl"
              placeholder="Diwali Night"
            />
          </div>

          <div>
            <label className="font-semibold">Upload Image</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImage}
              className="w-full mt-2 border p-4 rounded-xl"
            />
          </div>

          {image && (
            <img
              src={image}
              alt="preview"
              className="w-full h-72 object-cover rounded-2xl"
            />
          )}

          <button
            onClick={handleSave}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold"
          >
            Save Photo
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UploadGallery;