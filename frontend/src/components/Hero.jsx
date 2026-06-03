function Hero() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        <div>

          

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
  Indian Graduate Student Association
</h1>

<h2 className="text-3xl font-semibold text-orange-400 mb-6">
  University of Florida
</h2>
<p className="text-xl text-slate-200 leading-relaxed max-w-xl mb-10">
  Connecting Indian Graduate Students through
  cultural celebrations, professional networking, leadership,
  academic support, and lifelong friendships.
</p>


          <div className="flex gap-4 mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-semibold">
              Explore Events
            </button>

            <button className="border border-white/40 hover:bg-white hover:text-blue-950 px-6 py-3 rounded-full font-semibold transition">
              Learn More
            </button>
          </div>

        </div>
        

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-5">
            What you can do here
          </h2>

          <div className="space-y-4 text-blue-100">

            <p>✓ Register for upcoming IGSA events</p>

            <p>✓ Explore event galleries and highlights</p>

            <p>✓ Meet the executive board members</p>

            <p>✓ Access student resources and updates</p>

            <p>✓ Stay connected with the Indian community at UF</p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;