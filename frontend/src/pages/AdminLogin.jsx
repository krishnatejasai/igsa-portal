import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const submitting = useRef(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (submitting.current) return;
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    submitting.current = true;
    setLoading(true);
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), 8000);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        signal: AbortSignal.timeout(75000),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("igsaAdminToken", data.token);
      localStorage.setItem("igsaAdminUser", JSON.stringify(data.admin));
      localStorage.setItem("igsaAdminName", data.admin?.name || "Admin");
      localStorage.setItem("igsaAdminRole", data.admin?.role || "board-member");
      localStorage.setItem("igsaAdminLoggedIn", "true");

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      setError(error.name === "TimeoutError" ? "The server is taking too long. Please try signing in again." : "Unable to login. Please try again.");
    } finally {
      clearTimeout(slowTimer);
      submitting.current = false;
      setLoading(false);
      setSlow(false);
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
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-wait"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
          {loading && <p role="status" className="text-sm text-slate-600 text-center">{slow ? "The server may be waking up. Please keep this page open while we sign you in." : "Checking your credentials…"}</p>}
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Access restricted to authorized IGSA board members only.
        </p>
      </div>
    </main>
  );
}

export default AdminLogin;