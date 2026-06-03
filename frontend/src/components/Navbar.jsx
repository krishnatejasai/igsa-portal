import { Link } from "react-router-dom";
import logo from "../assets/igsa-logo-clean.png";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="IGSA UF"
            className="h-16 w-auto"
          />

          <div>
            <h1 className="text-lg font-bold text-blue-950">
              Indian Graduate Student Association
            </h1>

            <p className="text-xs text-slate-500">
              University of Florida
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="hover:text-orange-600 transition">
            Home
          </Link>

          <Link to="/about" className="hover:text-orange-600 transition">
            About
          </Link>

          <Link to="/board" className="hover:text-orange-600 transition">
            Board
          </Link>

          <Link to="/events" className="hover:text-orange-600 transition">
            Events
          </Link>

          <Link to="/gallery" className="hover:text-orange-600 transition">
            Gallery
          </Link>

          <Link to="/contact" className="hover:text-orange-600 transition">
            Contact
          </Link>
        </div>

        <Link
          to="/admin/login"
          className="hidden md:inline-flex bg-blue-950 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Board Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;