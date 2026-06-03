import { useState } from "react";

function AnnouncementSection() {
  const defaultAnnouncements = [
    {
      id: 1,
      title: "Fall 2026 Orientation Registration Open",
      date: "June 2026",
      message: "Incoming students can register for the Fall 2026 orientation.",
    },
  ];

  const [announcements] = useState(() => {
    const saved =
      JSON.parse(localStorage.getItem("igsaAnnouncements")) || [];

    return [...saved, ...defaultAnnouncements];
  });

  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-orange-600 font-semibold">Latest Updates</p>

          <h2 className="text-4xl font-bold text-blue-950 mt-2">
            Announcements
          </h2>

          <p className="text-slate-600 mt-3">
            Stay updated with IGSA news, events, and important information.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {announcements.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 shadow-md border border-slate-200"
            >
              <p className="text-orange-600 font-semibold mb-2">
                {item.date}
              </p>

              <h3 className="text-xl font-bold text-blue-950">
                {item.title}
              </h3>

              <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                {item.message || "More details will be shared soon."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnnouncementSection;