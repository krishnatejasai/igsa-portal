import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

import orientation from "../assets/gallery/orientation.jpg";
import diwali from "../assets/gallery/diwali.jpg";
import holi from "../assets/gallery/holi.jpg";
import webinar from "../assets/gallery/webinar.jpg";

const defaultGallery = [
  {
    id: 1,
    title: "Orientation",
    image: orientation,
  },
  {
    id: 2,
    title: "Diwali Night",
    image: diwali,
  },
  {
    id: 3,
    title: "Holi",
    image: holi,
  },
  {
    id: 4,
    title: "Webinars",
    image: webinar,
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

        const formattedPhotos = data.map((photo) => ({
          id: photo._id,
          title: photo.album,
          image: photo.image,
        }));

        setGalleryItems(formattedPhotos);
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
    <section className="py-24 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-orange-500 font-semibold text-center mb-2">
          Gallery
        </p>

        <h2 className="text-5xl font-bold text-center text-blue-950 mb-4">
          Event Highlights
        </h2>

        <p className="text-center text-slate-600 mb-14">
          A glimpse of IGSA events, celebrations, and community memories.
        </p>

        {loading ? (
          <p className="text-center text-slate-500">Loading gallery...</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-8">
            {finalGalleryItems.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl shadow-lg bg-white"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-110
                      transition
                      duration-500
                    "
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-blue-950">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GallerySection;