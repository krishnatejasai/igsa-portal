import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/igsa-logo-clean.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <img
  src={logo}
  alt="IGSA UF"
  className="h-10 md:h-16 w-auto"
/>

          <div>
            <h1 className="text-xs md:text-lg font-bold text-blue-950 leading-tight">
              Indian Graduate Student Association
            </h1>

            <p className="text-xs text-slate-500">University of Florida</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <Link to="/about" className="hover:text-orange-600 transition">About</Link>
          <Link to="/board" className="hover:text-orange-600 transition">Board</Link>
          <Link to="/events" className="hover:text-orange-600 transition">Events</Link>
          <Link to="/gallery" className="hover:text-orange-600 transition">Gallery</Link>
          <Link to="/contact" className="hover:text-orange-600 transition">Contact</Link>
        </div>

        <Link
          to="/admin/login"
          className="hidden md:inline-flex bg-blue-950 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Board Login
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden text-blue-950 text-3xl font-bold"
          aria-label="Toggle menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
  <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-200 shadow-xl z-50">
          <div className="px-6 py-5 flex flex-col gap-4 font-semibold text-blue-950">
            <Link onClick={closeMenu} to="/">Home</Link>
            <Link onClick={closeMenu} to="/about">About</Link>
            <Link onClick={closeMenu} to="/board">Board</Link>
            <Link onClick={closeMenu} to="/events">Events</Link>
            <Link onClick={closeMenu} to="/gallery">Gallery</Link>
            <Link onClick={closeMenu} to="/contact">Contact</Link>

            <Link
              onClick={closeMenu}
              to="/admin/login"
              className="bg-blue-950 text-white text-center px-5 py-3 rounded-full font-bold"
            >
              Board Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;