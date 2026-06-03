function StatisticsSection() {
  const stats = [
    {
      number: "500+",
      title: "Students Connected",
    },
    {
      number: "30+",
      title: "Events Organized",
    },
    {
      number: "10+",
      title: "Executive Members",
    },
    {
      number: "5+",
      title: "Years of Community Impact",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-blue-950 mb-16">
          IGSA By Numbers
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
            >
              <h3 className="text-5xl font-bold text-orange-500 mb-4">
                {stat.number}
              </h3>

              <p className="text-slate-700 font-medium">
                {stat.title}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;