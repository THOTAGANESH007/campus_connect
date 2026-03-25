import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { _id, name, email, role, profile, ... }
  const [loading, setLoading] = useState(true); // true while checking session

  // Try to fetch current user profile on mount (validates the cookie session)
  useEffect(() => {
    axios
      .get(`${API}/api/profile/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await axios.post(`${API}/api/auth/signout`, {}, { withCredentials: true });
    } catch (_) {}
    setUser(null);
  };

  const updateUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));

  // Role helpers
  const isAdmin          = user?.role === "ADMIN";
  const isOfficer        = user?.role === "PLACEMENT_OFFICER";
  const isStudent        = user?.role === "STUDENT";
  const canManageDrives  = isAdmin || isOfficer;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser, isAdmin, isOfficer, isStudent, canManageDrives }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
