import { useEffect, useState } from "react";

function AdminLogin() {
      useEffect(() => {
    if (localStorage.getItem("igsaAdminLoggedIn") === "true") {
      window.location.href = "/admin/dashboard";
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const adminEmail = "admin@igsauf.com";
    const adminPassword = "igsa2026";

    if (
      email.trim() === adminEmail &&
      password.trim() === adminPassword
    ) {
      localStorage.setItem("igsaAdminLoggedIn", "true");
      window.location.href = "/admin/dashboard";
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen pt-32 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950">
            Board Login
          </h1>

          <p className="text-slate-600 mt-2">
            Access the IGSA admin dashboard
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@igsauf.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Access restricted to authorized IGSA board members only.
        </p>
      </div>
    </main>
  );
}

export default AdminLogin;