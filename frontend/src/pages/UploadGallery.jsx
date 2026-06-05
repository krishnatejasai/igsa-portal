import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";
import { canManageGallery } from "../config/permissions";

function UploadGallery() {
  const navigate = useNavigate();
  

  const [album, setAlbum] = useState("");
  const [photos, setPhotos] = useState([]);
  const allowGalleryManagement = canManageGallery();

if (!allowGalleryManagement) {
  return (
    <AdminLayout>
      <div className="bg-white rounded-3xl shadow-md p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Access Denied
        </h1>

        <p className="text-slate-600 mt-3">
          Only authorized media or executive board members can upload gallery albums.
        </p>
      </div>
    </AdminLayout>
  );
}

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve(reader.result);
          };

          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((images) => {
      setPhotos(images);
    });
  };

  const handleSave = async () => {
    if (!album.trim()) {
      alert("Please enter an album name.");
      return;
    }

    if (photos.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
        },
        body: JSON.stringify({
          album,
          photos,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload album");
      }

      alert("Album uploaded successfully!");
      navigate("/admin/gallery");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while uploading album.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-5xl font-bold text-blue-950 mb-8">
        Upload Gallery Album
      </h1>

      <div className="bg-white rounded-3xl shadow-md p-8 max-w-5xl">
        <div className="space-y-6">
          <div>
            <label className="font-semibold">Album / Event Name</label>

            <input
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full mt-2 border p-4 rounded-xl"
              placeholder="Diwali Night 2026"
            />
          </div>

          <div>
            <label className="font-semibold">
              Upload Photos
            </label>

            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImages}
              className="w-full mt-2 border p-4 rounded-xl"
            />

            <p className="text-sm text-slate-500 mt-2">
              You can select multiple photos for the same event album.
            </p>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`preview-${index}`}
                  className="w-full h-40 object-cover rounded-2xl"
                />
              ))}
            </div>
          )}

          <button
            onClick={handleSave}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold"
          >
            Save Album
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UploadGallery;