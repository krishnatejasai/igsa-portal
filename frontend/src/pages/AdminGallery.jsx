import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/gallery");

      if (!response.ok) {
        throw new Error("Failed to fetch gallery photos");
      }

      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load gallery photos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      setPhotos((prev) => prev.filter((photo) => photo._id !== id));
    } catch (error) {
      console.error(error);
      alert("Unable to delete photo.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-blue-950">
            Gallery Management
          </h1>

          <p className="text-slate-600 mt-2">
            Manage event albums and photos.
          </p>
        </div>

        <Link
          to="/admin/gallery/upload"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          Upload Photos
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="text-slate-500 text-lg">Loading gallery photos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="text-slate-500 text-lg">
            No gallery photos uploaded yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="bg-white rounded-3xl shadow-md overflow-hidden"
            >
              <img
                src={photo.image}
                alt={photo.album}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-950">
                  {photo.album}
                </h3>

                <p className="text-slate-500 mt-2">Uploaded Photo</p>

                <button
                  onClick={() => handleDelete(photo._id)}
                  className="mt-5 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600"
                >
                  Delete Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminGallery;