import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-72 bg-blue-950 text-white min-h-screen p-6 fixed left-0 top-0">
        <h1 className="text-2xl font-bold">IGSA Portal</h1>
        <p className="text-sm text-blue-200 mt-1">Board Dashboard</p>

        <nav className="mt-10 space-y-3">
          {[
  ["Dashboard", "/admin/dashboard"],
  ["Events", "/admin/events"],
  ["Registrations", "/admin/registrations"],
  ["Gallery", "/admin/gallery"],
  ["Board Members", "/admin/board"],
  ["Announcements", "/admin/announcements"],
  ["Messages", "/admin/messages"],
].map(([label, path]) => (
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
  onClick={() => {
    localStorage.removeItem("igsaAdminLoggedIn");
    window.location.href = "/admin/login";
  }}
  className="absolute bottom-20 left-6 right-6 text-center bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
>
  Logout
</button>
        <Link
          to="/"
          className="absolute bottom-6 left-6 right-6 text-center bg-white text-blue-950 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition"
        >
          Back to Website
        </Link>
      </aside>

      <main className="ml-72 w-full p-8">{children}</main>
    </div>
  );
}

export default AdminLayout;