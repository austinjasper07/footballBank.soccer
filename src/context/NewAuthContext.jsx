"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const NewAuthContext = createContext();

export const NewAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (hasChecked) return; // Prevent multiple checks
    
    const loadUser = async () => {
      setIsLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.warn("Authentication check timed out - assuming not authenticated");
        setIsLoading(false);
        setHasChecked(true);
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      }, 3000); // 3 second timeout
      
      try {
        // Check if user is authenticated by making a request to our API
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'
        });
        
        clearTimeout(timeout); // Clear timeout on successful response
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            setRole(data.user.role);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setRole(null);
          }
        } else {
          // User is not authenticated
          setUser(null);
          setIsAuthenticated(false);
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to load authenticated user:", error);
        clearTimeout(timeout); // Clear timeout on error
        // On error, assume user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setIsLoading(false);
        setHasChecked(true);
      }
    };

    loadUser();
  }, [hasChecked]);

  const refreshUser = async () => {
    setHasChecked(false); // Reset to allow re-checking
    setIsLoading(true);
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("Authentication refresh timed out");
      setIsLoading(false);
      setHasChecked(true);
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
    }, 3000); // 3 second timeout
    
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include'
      });
      
      clearTimeout(timeout); // Clear timeout on successful response
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          setRole(data.user.role);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setRole(null);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      clearTimeout(timeout); // Clear timeout on error
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setIsLoading(false);
      setHasChecked(true);
    }
  };

  const logout = async () => {
    try {
      // Clear session by calling logout API
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      setHasChecked(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    role,
    logout,
    refreshUser,
  };

  return (
    <NewAuthContext.Provider value={value}>
      {children}
    </NewAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(NewAuthContext);
  if (!context) {
    // Return a fallback context instead of throwing an error
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,
      logout: () => {},
      refreshUser: () => {},
    };
  }
  return context;
};
