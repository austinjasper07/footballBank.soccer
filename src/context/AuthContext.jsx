'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { getUserById } from '@/actions/adminActions';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, getClaim } = useKindeAuth();
  const [userDb, setUserDb] = useState(null);
  const [role, setRole] = useState(null);
  
useEffect(() => {
  const loadRoles = async () => {
    if (isAuthenticated && user?.id) {
      const res = await getUserById(user.id);
      if (res) {
        setUserDb(res);
        setRole(res.role); // ✅ Use fetched data, not stale state
      }
    }
  };

  loadRoles();
}, [isAuthenticated, user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user: userDb,
        isAuthenticated,
        isLoading,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
