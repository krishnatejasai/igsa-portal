import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("igsaAdminToken");
  const loggedIn = localStorage.getItem(
    "igsaAdminLoggedIn"
  );

  if (!token || loggedIn !== "true") {
    localStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;