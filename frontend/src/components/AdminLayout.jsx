import { Link } from "react-router-dom";
import {
  canManageAdmins,
  canManageAnnouncements,
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
    ["Events", "/admin/events", canViewEvents()],
    ["Registrations", "/admin/registrations", canViewRegistrations()],
    ["QR Check-In", "/admin/check-in", canUseQRCheckIn()],
    ["Gallery", "/admin/gallery", canManageGallery()],
    ["Board Members", "/admin/board", canManageBoard()],
    ["Announcements", "/admin/announcements", canManageAnnouncements()],
    ["Admin Users", "/admin/users", canManageAdmins()],
    ["Messages", "/admin/messages", true],
  ];

  const visibleLinks = links.filter((link) => link[2]);

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      <aside className="hidden lg:block w-72 bg-blue-950 text-white min-h-screen p-6 fixed left-0 top-0">
        <h1 className="text-2xl font-bold">IGSA Portal</h1>
        <p className="text-sm text-blue-200 mt-1">Board Dashboard</p>

        <nav className="mt-10 space-y-3">
          {visibleLinks.map(([label, path]) => (
            <Link
              key={label}
              to={path}
              className="block px-4 py-3 rounded-xl hover:bg-orange-500 transition font-semibold"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-20 left-6 right-6 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          Logout
        </button>

        <Link
          to="/"
          className="absolute bottom-6 left-6 right-6 text-center bg-white text-blue-950 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white"
        >
          Back to Website
        </Link>
      </aside>

      <div className="lg:hidden bg-blue-950 text-white p-4">
        <h1 className="text-2xl font-bold">IGSA Portal</h1>
        <p className="text-sm text-blue-200">Board Dashboard</p>

        <div className="mt-4 overflow-x-auto flex gap-3 pb-2">
          {visibleLinks.map(([label, path]) => (
            <Link
              key={label}
              to={path}
              className="whitespace-nowrap bg-blue-900 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              {label}
            </Link>
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