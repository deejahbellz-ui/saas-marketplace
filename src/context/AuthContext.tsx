"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = "https://saas-marketplace-ngmm.onrender.com";

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => setIsAdmin(!!data?.is_admin))
      .catch(() => setIsAdmin(false));
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}