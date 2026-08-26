"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { apiFetch } from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string;
  demonstrated_skills?: string[] | string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("pf_token");
    const savedUser = localStorage.getItem("pf_user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("pf_user");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("pf_token", newToken);
    localStorage.setItem(
      "pf_user",
      JSON.stringify(newUser)
    );
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("pf_token");
    localStorage.removeItem("pf_user");
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const updatedUser = await apiFetch<User>(
        "/api/auth/me"
      );

      setUser(updatedUser);

      localStorage.setItem(
        "pf_user",
        JSON.stringify(updatedUser)
      );
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
