import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Configure axios to include credentials (cookies) with all requests
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

// Add response interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401, the session is invalid
    if (error.response?.status === 401) {
      // Clear any stale auth state
    }
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on app load by checking with backend
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated by calling backend
        const response = await axios.get("/api/auth/me", {
          withCredentials: true,
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // User is not authenticated - this is expected if not logged in
        console.log("Auth check: user not authenticated");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((userData) => {
    // Set state from user data returned by login endpoint
    setUser(userData);
    setIsAuthenticated(true);
    // Persist user to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call backend logout to clear session/cookie
      await axios.post("/api/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Clear localStorage
      localStorage.removeItem("user");
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
