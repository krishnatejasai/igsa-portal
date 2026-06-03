import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
        <div>
          <p className="text-orange-400 font-semibold text-sm md:text-base mb-3">
            University of Florida
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 max-w-3xl">
            Indian Graduate Student Association
          </h1>

          <p className="text-base md:text-xl text-slate-200 leading-relaxed max-w-xl mb-8">
            Supporting Indian graduate students through cultural events,
            community building, student resources, and professional connections.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/events"
              className="bg-orange-500 hover:bg-orange-600 px-5 md:px-6 py-3 rounded-full font-semibold text-sm md:text-base"
            >
              Explore Events
            </Link>

            <Link
              to="/about"
              className="border border-white/40 hover:bg-white hover:text-blue-950 px-5 md:px-6 py-3 rounded-full font-semibold transition text-sm md:text-base"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            What you can do here
          </h2>

          <div className="space-y-3 text-sm md:text-base text-blue-100">
            <p>✓ Register for upcoming IGSA events</p>
            <p>✓ Explore event galleries and highlights</p>
            <p>✓ Meet the executive board members</p>
            <p>✓ Stay updated with student announcements</p>
            <p>✓ Connect with the Indian graduate community at UF</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;