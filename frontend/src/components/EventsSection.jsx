import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 md:py-28 bg-slate-100">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="text-center mb-9 md:mb-14">
          <p className="text-orange-600 font-semibold text-sm md:text-base mb-2">
            Events
          </p>

          <h2 className="text-3xl md:text-5xl font-bold text-blue-950">
            Upcoming Events
          </h2>

          <p className="text-sm md:text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
            Join upcoming IGSA events, workshops, and community activities.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-600">
            No upcoming events yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-4 md:p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <p className="text-orange-500 text-sm md:text-base font-semibold mb-2 md:mb-3">
                  {event.date}
                </p>

                <h3 className="text-lg md:text-2xl font-bold text-blue-950 mb-2 md:mb-4 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-slate-600 text-sm md:text-base mb-3 md:mb-5 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                  <p className="text-xs md:text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">Time:</span>{" "}
                    {event.time}
                  </p>

                  <p className="text-xs md:text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Location:
                    </span>{" "}
                    {event.location}
                  </p>
                </div>

                {event.registrationOpen !== false ? (
  <Link
    to={`/events/register/${event._id}`}
    className="inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold"
  >
    Register
  </Link>
) : (
  <button
    disabled
    className="bg-slate-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
  >
    Registration Closed
  </button>
)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default EventsSection;