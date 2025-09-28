"use client";

import { createContext, useContext, useEffect, useState } from 'react';

export const NewAuthContext = createContext(null);

export const NewAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated by making a request to our API
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
          setRole(userData.role);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to load authenticated user:", error);
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear session by calling logout API
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      });

      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      
      // Redirect to login page
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <NewAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        logout,
        refreshUser,
      }}
    >
      {children}
    </NewAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(NewAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a NewAuthProvider');
  }
  return context;
};