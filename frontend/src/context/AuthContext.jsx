import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("adminUser");

      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("Failed to load admin user:", error);
      localStorage.removeItem("adminUser");
    }

    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (!data.token) {
        throw new Error("Login successful but no token was returned");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return data;
    } catch (error) {
      console.error(
        "Admin login error:",
        error.response?.data || error.message
      );

      throw new Error(
        error.response?.data?.message || "Login failed",
        { cause: error }
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};