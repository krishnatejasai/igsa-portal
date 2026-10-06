import { Link, NavLink } from "react-router-dom";
import {
  canManageAdmins,
  canManageBoard,
  canManageGallery,
  canUseQRCheckIn,
  canViewEvents,
  canViewRegistrations,
} from "../config/permissions";

function AdminLayout({ children }) {
  const logout = () => {
    localStorage.removeItem("igsaAdminLoggedIn");
    localStorage.removeItem("igsaAdminToken");
    localStorage.removeItem("igsaAdminUser");
    localStorage.removeItem("igsaAdminName");
    localStorage.removeItem("igsaAdminRole");
    window.location.href = "/admin/login";
  };

  const links = [
    ["Dashboard", "/admin/dashboard", true],
    ["Community Listings", "/admin/community", true],
    ["Events", "/admin/events", canViewEvents()],
    ["Registrations", "/admin/registrations", canViewRegistrations()],
    ["QR Check-In", "/admin/check-in", canUseQRCheckIn()],
    ["Gallery", "/admin/gallery", canManageGallery()],
    ["Board Members", "/admin/board", canManageBoard()],
    ["Admin Users", "/admin/users", canManageAdmins()],
  ];

  const visibleLinks = links.filter((link) => link[2]);

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      <aside className="hidden lg:flex w-72 bg-blue-950 text-white h-screen overflow-y-auto p-6 fixed left-0 top-0 flex-col">
        <h1 className="text-2xl font-bold">IGSA Portal</h1>
        <p className="text-sm text-blue-200 mt-1">Board Dashboard</p>

        <nav className="mt-10 space-y-3">
          {visibleLinks.map(([label, path]) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) => `block px-4 py-3 rounded-xl transition font-semibold ${isActive ? "bg-white text-blue-950" : "hover:bg-blue-900 text-blue-100"}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-8 shrink-0 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          Logout
        </button>

        <Link
          to="/"
          className="mt-3 shrink-0 text-center bg-white text-blue-950 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white"
        >
          Back to Website
        </Link>
      </aside>

      <div className="lg:hidden bg-blue-950 text-white p-4">
        <h1 className="text-2xl font-bold">IGSA Portal</h1>
        <p className="text-sm text-blue-200">Board Dashboard</p>

        <div className="mt-4 overflow-x-auto flex gap-3 pb-2">
          {visibleLinks.map(([label, path]) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) => `whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold ${isActive ? "bg-white text-blue-950" : "bg-blue-900"}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex gap-3 mt-3">
          <button
            onClick={logout}
            className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-bold"
          >
            Logout
          </button>

          <Link
            to="/"
            className="bg-white text-blue-950 px-5 py-2 rounded-xl text-sm font-bold"
          >
            Website
          </Link>
        </div>
      </div>

      <main className="w-full lg:ml-72 lg:w-[calc(100%-18rem)] p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;