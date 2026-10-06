import { Link } from 'react-router-dom';
function Footer() {
  return (
    <footer className="bg-[#262a23] text-white py-12">
      <div className="max-w-6xl mx-auto px-5 md:px-6">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Organization */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              IGSA UF
            </h3>

            <p className="text-[#d5d5ca] leading-relaxed">
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

            <div className="flex flex-col gap-2 text-[#d5d5ca]">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/board">Board</Link>
              <Link to="/events">Events</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/community">Roommates & Travel</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-3">
              Contact
            </h4>

            <div className="space-y-2 text-[#d5d5ca]">
              <a href="mailto:igsa.uf@gmail.com" className="hover:text-white">igsa.uf@gmail.com</a>
              <p>@igsa.uf</p>
            </div>
          </div>

        </div>

        <div className="border-t border-[#42483b] mt-10 pt-6 text-center">
          <p className="text-[#b9bcae] text-sm">
  © 2026 IGSA UF. All Rights Reserved.
</p>

<p className="text-[#b9bcae] text-sm mt-2">
  Website Designed & Developed by Sai Sri Krishna Teja Sanku
</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;