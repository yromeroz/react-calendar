"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      // optionally decode the token
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
