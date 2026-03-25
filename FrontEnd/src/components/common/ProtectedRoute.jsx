import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute
 * Props:
 *  - roles: string[] (optional) – the roles allowed. If omitted, any logged-in user passes.
 *  - redirectTo: string – where to send unauthenticated users (default: "/signin")
 */
export default function ProtectedRoute({ children, roles, redirectTo = "/signin" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/drives" replace />;
  }

  return children;
}
