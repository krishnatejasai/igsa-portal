import { useEffect, useState } from "react";

function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/announcements"
        );

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
    <section className="py-20 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-orange-600 font-semibold">
            Latest Updates
          </p>

          <h2 className="text-4xl font-bold text-blue-950 mt-2">
            Announcements
          </h2>

          <p className="text-slate-600 mt-3">
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
          <div className="grid md:grid-cols-3 gap-6">
            {announcements.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200"
              >
                <p className="text-orange-600 font-semibold mb-2">
                  {item.date}
                </p>

                <h3 className="text-xl font-bold text-blue-950">
                  {item.title}
                </h3>

                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                  {item.description ||
                    "More details will be shared soon."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AnnouncementSection;