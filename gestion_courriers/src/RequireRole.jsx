import { Navigate } from "react-router-dom";

export function RequireRole({ allowed, children }) {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/" replace />;

  if (role.toLowerCase() !== allowed.toLowerCase()) {
    return <Navigate to="/accueil" replace />;
  }

  return children;
}
