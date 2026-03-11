import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("barber_user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Keep user state in sync with localStorage in case other tabs modify it
    const handler = () => {
      const stored = localStorage.getItem("barber_user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = ({ email, password }) => {
    // Demo-only authentication
    if (email === "admin@admin.com" && password === "admin123") {
      const u = { name: "Admin", email };
      localStorage.setItem("barber_user", JSON.stringify(u));
      setUser(u);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("barber_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
