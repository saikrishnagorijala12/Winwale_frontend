import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../api/user';
import { signOut } from 'aws-amplify/auth';
import api from '../lib/axios';

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      setStatus("authenticated");
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        status,
        setStatus,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
