import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("igsaAdminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;