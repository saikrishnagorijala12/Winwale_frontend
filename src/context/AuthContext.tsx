import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../api/user';
import { signOut } from 'aws-amplify/auth';
import api from '../lib/axios';
 
type AuthStatus = "loading" | "authenticated" | "unauthenticated";
 
interface AuthContextType {
  user: UserProfile | null;
  isActive: boolean;
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
  const [isActive, setIsActive] = useState(false);
 
 
  const refreshUser = async () => {
  try {
    const response = await api.get('/users/me');
    const userData = response.data;
 
    setUser(userData);
    setIsActive(!!userData.is_active);
 
    setStatus("authenticated");
  } catch (error) {
    console.error("Failed to refresh user:", error);
    setUser(null);
    setIsActive(false);
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
  setIsActive(false);
  setStatus("unauthenticated");
}
 
  };
 
  return (
<AuthContext.Provider
  value={{
    user,
    isActive,
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