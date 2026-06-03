import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/announcements`);

        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-slate-100">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-orange-600 font-semibold text-sm">
            Latest Updates
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mt-2">
            Announcements
          </h2>

          <p className="text-sm md:text-base text-slate-600 mt-3 max-w-2xl mx-auto">
            Stay updated with IGSA news, events, and important information.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-slate-500">
            No announcements available.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {announcements.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                    !
                  </div>

                  <div>
                    <p className="text-orange-600 font-semibold text-xs md:text-sm mb-1">
                      {item.date}
                    </p>

                    <h3 className="text-base md:text-xl font-bold text-blue-950 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 mt-2 text-sm leading-relaxed line-clamp-2">
                      {item.description || "More details will be shared soon."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AnnouncementSection;