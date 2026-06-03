function About() {
  return (
    <main className="pt-24 bg-white">
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-6xl mx-auto px-5 md:px-6 text-center">
          <p className="text-orange-600 font-semibold text-sm mb-2">
            About IGSA
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-950">
            Supporting Indian Graduate Students at UF
          </h1>

          <p className="text-slate-600 mt-5 max-w-3xl mx-auto leading-relaxed">
            The Indian Graduate Student Association at the University of Florida
            brings together Indian graduate students through cultural events,
            academic support, professional networking, and community building.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-blue-950 mb-3">
              Community
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We help incoming and current students feel connected, welcomed,
              and supported throughout their journey at UF.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-blue-950 mb-3">
              Culture
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              From Diwali and Holi to orientation and social gatherings, IGSA
              celebrates Indian culture and traditions on campus.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-blue-950 mb-3">
              Growth
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We create opportunities for academic guidance, professional
              networking, leadership, and student collaboration.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;