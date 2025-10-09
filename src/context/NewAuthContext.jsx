// //  src/context/NewAuthContext.jsx

// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";

// const NewAuthContext = createContext();

// export const NewAuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const checkUser = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       if (!res.ok) {
//         if (res.status === 401) {
//           setUser(null);
//         } else {
//           throw new Error(`HTTP ${res.status}: Failed to fetch session`);
//         }
//       } else {
//         const data = await res.json();
//         setUser(data?.user || null);
//       }
//     } catch (err) {
//       console.error("Auth check failed:", err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkUser(); // ✅ runs once on mount
//   }, []);

//   const logout = async () => {
//     try {
//       console.log("🔐 Logging out user...");
//       await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       setUser(null);
//       checkUser(); // ✅ refresh immediately after logout
//       console.log("🔐 User state cleared and refreshed");
//     }
//   };

//   const refreshUser = () => checkUser(); // ✅ simple refresh

//   const value = {
//     user,
//     setUser,
//     isAuthenticated: !!user,
//     role: user?.role || null,
//     loading,
//     logout,
//     refreshUser,
//   };

//   return (
//     <NewAuthContext.Provider value={value}>
//       {children}
//     </NewAuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(NewAuthContext);


//  src/context/NewAuthContext.jsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const NewAuthContext = createContext();

export const NewAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches and validates current user session.
   * Includes:
   * - AbortController to cancel in-flight fetch
   * - Safe JSON parsing
   */
  const checkUser = async () => {
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        signal,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setUser(null); // not logged in
        } else {
          throw new Error(`HTTP ${res.status}: Failed to fetch session`);
        }
      } else {
        let data = null;
        try {
          data = await res.json();
        } catch (parseErr) {
          console.warn("⚠️ Failed to parse /api/auth/me response:", parseErr);
        }
        setUser(data?.user || null);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Auth check failed:", err);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }

    // Return cleanup function to cancel ongoing request
    return () => controller.abort();
  };

  useEffect(() => {
    const abortFetch = checkUser();
    return () => {
      if (typeof abortFetch === "function") abortFetch();
    };
  }, []);

  /**
   * Logs out user, clears local state, and revalidates session asynchronously
   */
  const logout = async () => {
    try {
      console.log("🔐 Logging out user...");
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      // Non-blocking refresh for smoother UX
      checkUser();
      console.log("🔐 User state cleared and refreshed");
    }
  };

  const refreshUser = () => checkUser();

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    role: user?.role || null,
    loading,
    logout,
    refreshUser,
  };

  return (
    <NewAuthContext.Provider value={value}>
      {children}
    </NewAuthContext.Provider>
  );
};

export const useAuth = () => useContext(NewAuthContext);
