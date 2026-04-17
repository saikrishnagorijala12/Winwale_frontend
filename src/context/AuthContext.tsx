import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { userService } from "../services/userService";
import { UserProfile } from "../types/user.types";
import { AuthStatus } from "../types/auth.types";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

interface AuthContextType {
  user: UserProfile | null;
  isActive: boolean;
  setUser: (user: UserProfile | null) => void;
  status: AuthStatus;
  refreshUser: () => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [isActive, setIsActive] = useState(false);

  const bootstrapped = useRef(false);

  const refreshUser = async (): Promise<UserProfile> => {
    const userData = await userService.getMe();

    setUser(userData);
    setIsActive(!!userData.is_active);
    setStatus("authenticated");
    return userData;
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (bootstrapped.current) return;
      bootstrapped.current = true;

      const publicPaths = ["/login", "/signup", "/forgot-password"];
      if (publicPaths.includes(window.location.pathname)) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const session = await fetchAuthSession();

        if (!session.tokens?.idToken) {
          setStatus("unauthenticated");
          return;
        }

        await refreshUser();
      } catch (err) {
        console.error("Auth bootstrap failed:", err);
        await signOut().catch(() => { });
        setUser(null);
        setIsActive(false);
        setStatus("unauthenticated");
      }
    };

    bootstrapAuth();
  }, []);

  useEffect(() => {
    const handleUnauthorized = async () => {
      console.warn("Unauthorized access detected, logging out...");
      await logout();
    };

    window.addEventListener("custom:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("custom:unauthorized", handleUnauthorized);
    };
  }, []);

  const logout = async () => {
    try {
      await signOut();
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
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
