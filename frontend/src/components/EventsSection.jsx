function EventsSection() {
  const events = [
    {
      title: "Fall 2026 Orientation",
      date: "August 2026",
      description: "Welcome event for incoming Indian graduate students.",
    },
    {
      title: "Diwali Night",
      date: "October 2026",
      description: "IGSA's biggest cultural celebration of the year.",
    },
    {
      title: "Networking Session",
      date: "November 2026",
      description: "Connect with alumni and industry professionals.",
    },
  ];

  return (
    <section className="py-28 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-blue-950 mb-14">
          Upcoming Events
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold text-blue-900 mb-3 hover:-translate-y-2 transition-all duration-300">
                {event.title}
              </h3>

              <p className="text-orange-500 font-semibold mb-3 hover:-translate-y-2 transition-all duration-300 ">
                {event.date}
              </p>

              <p className="text-slate-600 hover:-translate-y-2 transition-all duration-300">
                {event.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default EventsSection;