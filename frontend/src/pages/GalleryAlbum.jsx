import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

function GalleryAlbum() {
  const { id } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);

        if (!response.ok) {
          throw new Error("Failed to fetch gallery albums");
        }

        const data = await response.json();
        const selectedAlbum = data.find((item) => item._id === id);

        setAlbum(selectedAlbum);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const handleDownload = (photo, fileName) => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <main className="pt-32 min-h-screen bg-slate-100">
        <p className="text-center text-slate-600">Loading album...</p>
      </main>
    );
  }

  if (!album) {
    return (
      <main className="pt-32 min-h-screen bg-slate-100 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-blue-950">
            Album not found
          </h1>

          <Link
            to="/gallery"
            className="inline-block mt-6 bg-orange-500 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Back to Gallery
          </Link>
        </div>
      </main>
    );
  }

  const photos = album.photos || (album.image ? [album.image] : []);

  return (
    <main className="pt-32 pb-20 min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <Link
          to="/gallery"
          className="text-orange-600 font-semibold hover:text-orange-700"
        >
          ← Back to Gallery
        </Link>

        <div className="mt-8 mb-10">
          <p className="text-orange-600 font-semibold text-sm mb-2">
            Gallery Album
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-blue-950">
            {album.album}
          </h1>

          <p className="text-slate-600 mt-3">
            {photos.length} photos from this event.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-[90px_1fr_160px] bg-blue-950 text-white font-semibold">
            <div className="p-4">Preview</div>
            <div className="p-4">File Name</div>
            <div className="p-4 text-center">Actions</div>
          </div>

          <div className="divide-y divide-slate-200">
            {photos.map((photo, index) => {
              const fileName = `${album.album.replace(/\s+/g, "-")}-photo-${
                index + 1
              }.jpg`;

              return (
                <div
                  key={index}
                  className="grid grid-cols-[70px_1fr] md:grid-cols-[90px_1fr_160px] items-center gap-3 p-3 md:p-4 hover:bg-slate-50 transition"
                >
                  <button
                    onClick={() => setSelectedPhoto(photo)}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-100"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div>
                    <h3 className="font-bold text-blue-950 text-sm md:text-base">
                      Photo {index + 1}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                      {fileName}
                    </p>

                    <div className="flex gap-2 mt-3 md:hidden">
                      <button
                        onClick={() => setSelectedPhoto(photo)}
                        className="bg-blue-950 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDownload(photo, fileName)}
                        className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-2 justify-center">
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDownload(photo, fileName)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600"
                    >
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Selected gallery"
            className="max-w-full max-h-[90vh] rounded-2xl"
          />
        </div>
      )}
    </main>
  );
}

export default GalleryAlbum;