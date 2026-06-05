import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";
import { canManageGallery } from "../config/permissions";

function AdminGallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const allowGalleryManagement = canManageGallery();

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`);

      if (!response.ok) {
        throw new Error("Failed to fetch gallery albums");
      }

      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load gallery albums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete album");
      }

      setAlbums((prev) => prev.filter((album) => album._id !== id));
    } catch (error) {
      console.error(error);
      alert("Unable to delete album.");
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

        {allowGalleryManagement && (
  <Link
    to="/admin/gallery/upload"
    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold"
  >
    Upload Album
  </Link>
)}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="text-slate-500 text-lg">Loading gallery albums...</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="text-slate-500 text-lg">
            No gallery albums uploaded yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {albums.map((album) => (
            <div
              key={album._id}
              className="bg-white rounded-3xl shadow-md overflow-hidden"
            >
              <img
                src={album.photos?.[0] || album.image}
                alt={album.album}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-950">
                  {album.album}
                </h3>

                <p className="text-slate-500 mt-2">
                  {album.photos?.length || (album.image ? 1 : 0)} photos
                </p>

                {allowGalleryManagement && (
  <button
    onClick={() => handleDelete(album._id)}
    className="mt-5 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600"
  >
    Delete Album
  </button>
)}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminGallery;