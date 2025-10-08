// // // src/context/NewAuthContext.jsx

// // "use client";

// // import React, { createContext, useContext, useState, useEffect } from 'react';

// // const NewAuthContext = createContext();

// // export const NewAuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [role, setRole] = useState(null);
// //   const [hasChecked, setHasChecked] = useState(false);

// //   useEffect(() => {
// //     if (hasChecked) return; // Prevent multiple checks
    
// //     const loadUser = async () => {
// //       setIsLoading(true);
      
// //       // Set a timeout to prevent infinite loading
// //       const timeout = setTimeout(() => {
// //         console.warn("Authentication check timed out - assuming not authenticated");
// //         setIsLoading(false);
// //         setHasChecked(true);
// //         setUser(null);
// //         setIsAuthenticated(false);
// //         setRole(null);
// //       }, 3000); // 3 second timeout
      
// //       try {
// //         // Check if user is authenticated by making a request to our API
// //         const response = await fetch('/api/auth/check', {
// //           method: 'GET',
// //           credentials: 'include'
// //         });
        
// //         clearTimeout(timeout); // Clear timeout on successful response
        
// //         if (response.ok) {
// //           const data = await response.json();
// //           if (data.authenticated && data.user) {
// //             setUser(data.user);
// //             setIsAuthenticated(true);
// //             setRole(data.user.role);
// //           } else {
// //             setUser(null);
// //             setIsAuthenticated(false);
// //             setRole(null);
// //           }
// //         } else {
// //           // User is not authenticated
// //           setUser(null);
// //           setIsAuthenticated(false);
// //           setRole(null);
// //         }
// //       } catch (error) {
// //         console.error("Failed to load authenticated user:", error);
// //         clearTimeout(timeout); // Clear timeout on error
// //         // On error, assume user is not authenticated
// //         setUser(null);
// //         setIsAuthenticated(false);
// //         setRole(null);
// //       } finally {
// //         setIsLoading(false);
// //         setHasChecked(true);
// //       }
// //     };

// //     loadUser();
// //   }, [hasChecked]);

// //   const refreshUser = async () => {
// //     setHasChecked(false); // Reset to allow re-checking
// //     setIsLoading(true);
    
// //     // Set a timeout to prevent infinite loading
// //     const timeout = setTimeout(() => {
// //       console.warn("Authentication refresh timed out");
// //       setIsLoading(false);
// //       setHasChecked(true);
// //       setUser(null);
// //       setIsAuthenticated(false);
// //       setRole(null);
// //     }, 3000); // 3 second timeout
    
// //     try {
// //       const response = await fetch('/api/auth/check', {
// //         method: 'GET',
// //         credentials: 'include'
// //       });
      
// //       clearTimeout(timeout); // Clear timeout on successful response
      
// //       if (response.ok) {
// //         const data = await response.json();
// //         if (data.authenticated && data.user) {
// //           setUser(data.user);
// //           setIsAuthenticated(true);
// //           setRole(data.user.role);
// //         } else {
// //           setUser(null);
// //           setIsAuthenticated(false);
// //           setRole(null);
// //         }
// //       } else {
// //         setUser(null);
// //         setIsAuthenticated(false);
// //         setRole(null);
// //       }
// //     } catch (error) {
// //       console.error("Failed to refresh user:", error);
// //       clearTimeout(timeout); // Clear timeout on error
// //       setUser(null);
// //       setIsAuthenticated(false);
// //       setRole(null);
// //     } finally {
// //       setIsLoading(false);
// //       setHasChecked(true);
// //     }
// //   };

// //   const logout = async () => {
// //     try {
// //       // Clear session by calling logout API
// //       await fetch("/api/auth/logout", { 
// //         method: "POST",
// //         credentials: 'include'
// //       });
// //     } catch (error) {
// //       console.error("Error during logout:", error);
// //     } finally {
// //       // Clear local state regardless of API call success
// //       setUser(null);
// //       setIsAuthenticated(false);
// //       setRole(null);
// //       setHasChecked(false);
// //     }
// //   };

// //   const value = {
// //     user,
// //     isAuthenticated,
// //     isLoading,
// //     role,
// //     logout,
// //     refreshUser,
// //   };

// //   return (
// //     <NewAuthContext.Provider value={value}>
// //       {children}
// //     </NewAuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => {
// //   const context = useContext(NewAuthContext);
// //   if (!context) {
// //     // Return a fallback context instead of throwing an error
// //     return {
// //       user: null,
// //       isAuthenticated: false,
// //       isLoading: false,
// //       role: null,
// //       logout: () => {},
// //       refreshUser: () => {},
// //     };
// //   }
// //   return context;
// // };


// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";

// const NewAuthContext = createContext();

// export const NewAuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [role, setRole] = useState(null);
//   const [hasChecked, setHasChecked] = useState(false);

//   const checkAuth = async (isRefresh = false) => {
//     setIsLoading(true);

//     const controller = new AbortController();
//     const timeout = setTimeout(() => {
//       controller.abort();
//       console.warn("⚠️ Auth check timeout");
//     }, 5000);

//     try {
//       const res = await fetch("/api/auth/check", {
//         method: "GET",
//         credentials: "include",
//         signal: controller.signal,
//       });

//       clearTimeout(timeout);

//       if (!res.ok) throw new Error("Auth check failed");
//       const data = await res.json();

//       if (data.authenticated && data.user) {
//         setUser(data.user);
//         setIsAuthenticated(true);
//         setRole(data.user.role);
//       } else {
//         setUser(null);
//         setIsAuthenticated(false);
//         setRole(null);
//       }
//     } catch (err) {
//       console.error("Auth check error:", err.message || err);
//       setUser(null);
//       setIsAuthenticated(false);
//       setRole(null);
//     } finally {
//       clearTimeout(timeout);
//       setIsLoading(false);
//       setHasChecked(true);
//     }
//   };

//   // useEffect(() => {
//   //   if (!hasChecked) checkAuth();
//   // }, [hasChecked]);

//   useEffect(() => {
//     if (hasChecked) return; // Prevent multiple checks
  
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => {
//       controller.abort();
//       console.warn("Auth check timed out");
//     }, 7000);
  
//     const loadUser = async () => {
//       try {
//         setIsLoading(true);
  
//         const response = await fetch("/api/auth/check", {
//           method: "GET",
//           credentials: "include",
//           signal: controller.signal,
//         });
  
//         clearTimeout(timeoutId);
  
//         if (response.ok) {
//           const data = await response.json();
//           if (data.authenticated && data.user) {
//             setUser(data.user);
//             setIsAuthenticated(true);
//             setRole(data.user.role);
//           } else {
//             setUser(null);
//             setIsAuthenticated(false);
//             setRole(null);
//           }
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//           setRole(null);
//         }
//       } catch (error) {
//         if (error.name === "AbortError") {
//           console.warn("Auth check aborted");
//         } else {
//           console.error("Auth check error:", error);
//         }
//         setUser(null);
//         setIsAuthenticated(false);
//         setRole(null);
//       } finally {
//         clearTimeout(timeoutId);
//         setIsLoading(false);
//         setHasChecked(true);
//       }
//     };
  
//     loadUser();
  
//     // ✅ Cleanup properly
//     return () => {
//       clearTimeout(timeoutId);
//       controller.abort();
//     };
//   }, [hasChecked]);
  
  

//   const refreshUser = () => {
//     setHasChecked(false);
//     checkAuth(true);
//   };

//   const logout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
//     } catch (e) {
//       console.error("Logout error:", e);
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//       setRole(null);
//       setHasChecked(false);
//     }
//   };

//   console.log("Auth loading:", isLoading, "checked:", hasChecked, "user:", user);


//   return (
//     <NewAuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         isLoading,
//         role,
//         logout,
//         refreshUser,
//       }}
//     >
//       {children}
//     </NewAuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(NewAuthContext);
//   if (!context) {
//     return {
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       role: null,
//       logout: () => {},
//       refreshUser: () => {},
//     };
//   }
//   return context;
// };

"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const NewAuthContext = createContext();

export const NewAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // ✅ only run once unless explicitly reset
    if (checked) return;

    let active = true;
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          if (res.status === 401) {
            // User is not authenticated, this is normal
            if (active) setUser(null);
          } else {
            throw new Error(`HTTP ${res.status}: Failed to fetch session`);
          }
        } else {
          const data = await res.json();
          if (active) {
            setUser(data?.user || null);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (active) setUser(null);
      } finally {
        if (active) {
          setLoading(false);
          setChecked(true);
        }
      }
    };

    checkUser();
    return () => {
      active = false;
    };
  }, [checked]); // ✅ Only runs once, doesn't reset on rerenders

  // Computed values for backward compatibility
  const isAuthenticated = !!user;
  const role = user?.role || null;
  const isLoading = loading;

  const logout = async () => {
    try {
      console.log("🔐 Logging out user...");
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      console.log("🔐 Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setChecked(false);
      console.log("🔐 User state cleared");
    }
  };

  const refreshUser = () => {
    setChecked(false);
  };

  return (
    <NewAuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      checked,
      isAuthenticated,
      role,
      isLoading,
      logout,
      refreshUser
    }}>
      {children}
    </NewAuthContext.Provider>
  );
};

export const useAuth = () => useContext(NewAuthContext);
