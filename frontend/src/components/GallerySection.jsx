import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";
import { Link } from "react-router-dom";

import orientation from "../assets/gallery/orientation.jpg";
import diwali from "../assets/gallery/diwali.jpg";
import holi from "../assets/gallery/holi.jpg";
import webinar from "../assets/gallery/webinar.jpg";

const defaultGallery = [
  {
    id: 1,
    album: "Orientation",
    photos: [orientation],
  },
  {
    id: 2,
    album: "Diwali Night",
    photos: [diwali],
  },
  {
    id: 3,
    album: "Holi",
    photos: [holi],
  },
  {
    id: 4,
    album: "Webinars",
    photos: [webinar],
  },
];

function GallerySection() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);

        if (!response.ok) {
          throw new Error("Failed to fetch gallery");
        }

        const data = await response.json();
        setGalleryItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const finalGalleryItems =
    galleryItems.length > 0 ? galleryItems : defaultGallery;

  return (
    <section className="py-16 md:py-24 bg-slate-100">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <p className="text-orange-600 font-semibold text-center text-sm mb-2">
          Gallery
        </p>

        <h2 className="text-3xl md:text-5xl font-bold text-center text-blue-950 mb-4">
          Event Highlights
        </h2>

        <p className="text-center text-slate-600 text-sm md:text-base mb-10 md:mb-14">
          A glimpse of IGSA events, celebrations, and community memories.
        </p>

        {loading ? (
          <p className="text-center text-slate-500">Loading gallery...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {finalGalleryItems.slice(0, 8).map((item) => {
              const coverImage = item.photos?.[0] || item.image;

              return (
  <Link
    to={`/gallery/${item._id || item.id}`}
    key={item._id || item.id}
    className="group overflow-hidden rounded-2xl md:rounded-3xl shadow-md bg-white"
  >
    <div className="h-40 md:h-64 overflow-hidden bg-slate-200">
      {coverImage ? (
        <img
          src={coverImage}
          alt={item.album}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
          No Image
        </div>
      )}
    </div>

    <div className="p-4 md:p-5">
      <h3 className="font-bold text-sm md:text-lg text-blue-950">
        {item.album}
      </h3>

      <p className="text-xs md:text-sm text-slate-500 mt-1">
        {item.photos?.length || (item.image ? 1 : 0)} photos
      </p>
    </div>
  </Link>
);
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default GallerySection;