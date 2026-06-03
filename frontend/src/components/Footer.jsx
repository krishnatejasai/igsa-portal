function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-12">
      <div className="max-w-6xl mx-auto px-5 md:px-6">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Organization */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              IGSA UF
            </h3>

            <p className="text-slate-400 leading-relaxed">
              Indian Graduate Student Association at the
              University of Florida, connecting students through
              culture, community, leadership, and professional growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-3">
              Quick Links
            </h4>

            <div className="flex flex-col gap-2 text-slate-400">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/board">Board</a>
              <a href="/events">Events</a>
              <a href="/gallery">Gallery</a>
              <a href="/contact">Contact</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-3">
              Contact
            </h4>

            <div className="space-y-2 text-slate-400">
              <p>igsa@ufl.edu</p>
              <p>@igsa.uf</p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 IGSA UF. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;