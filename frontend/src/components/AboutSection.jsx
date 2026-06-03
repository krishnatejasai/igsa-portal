function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold text-blue-950 mb-8">
          About IGSA
        </h2>

        <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto mb-16">
          The Indian Graduate Student Association (IGSA) at the
          University of Florida serves as a home away from home
          for Indian graduate students.

          We organize cultural celebrations, networking events,
          professional development sessions, sports activities,
          and community gatherings that help students connect,
          grow, and thrive during their academic journey.
        </p>

        {/* Statistics */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          <div className="bg-slate-50 rounded-2xl p-8 shadow-md">
            <h3 className="text-4xl font-bold text-orange-500">
              500+
            </h3>
            <p className="text-slate-600 mt-2">
              Students Connected
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 shadow-md">
            <h3 className="text-4xl font-bold text-orange-500">
              30+
            </h3>
            <p className="text-slate-600 mt-2">
              Events Organized
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 shadow-md">
            <h3 className="text-4xl font-bold text-orange-500">
              10+
            </h3>
            <p className="text-slate-600 mt-2">
              Executive Members
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 shadow-md">
            <h3 className="text-4xl font-bold text-orange-500">
              5+
            </h3>
            <p className="text-slate-600 mt-2">
              Years of Impact
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;