import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");

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
    <section className="py-28 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-950 mb-14">
          Upcoming Events
        </h2>

        {loading ? (
          <p className="text-center text-slate-600">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-600">
            No upcoming events yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-blue-900 mb-3">
                  {event.title}
                </h3>

                <p className="text-orange-500 font-semibold mb-2">
                  {event.date}
                </p>

                <p className="text-slate-600 mb-4">
                  {event.description}
                </p>

                <p className="text-sm text-slate-500 mb-1">
                  <span className="font-semibold">Time:</span> {event.time}
                </p>

                <p className="text-sm text-slate-500 mb-4">
                  <span className="font-semibold">Location:</span>{" "}
                  {event.location}
                </p>

                <Link
                  to={`/events/register/${event._id}`}
                  className="inline-block bg-orange-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-600"
                >
                  Register
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default EventsSection;