'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, getClaim } = useKindeAuth();


  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      if (isAuthenticated) {
        const rolesList = getClaim("roles");
        const userRoles = rolesList.value.map((role)=> role.key);
      
        setRoles(userRoles || []);
      }
    };

    loadRoles();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        roles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
