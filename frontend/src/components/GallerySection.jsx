import { useState } from "react";

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
  const [galleryItems] = useState(() => {
    const uploadedPhotos =
      JSON.parse(localStorage.getItem("igsaGallery")) || [];

    const formattedPhotos = uploadedPhotos.map((photo) => ({
      id: photo.id,
      title: photo.album,
      image: photo.image,
    }));

    return [...formattedPhotos, ...defaultGallery];
  });

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

        <div className="grid md:grid-cols-4 gap-8">

          {galleryItems.slice(0, 8).map((item) => (
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
      </div>
    </section>
  );
}

export default GallerySection;