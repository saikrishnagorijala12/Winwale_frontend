import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

import awsExports from "./src/aws-exports";

import Login from "./src/pages/auth/Login";
import Signup from "./src/pages/auth/Signup";
import ForgotPassword from "./src/pages/auth/ForgotPassword";
import Dashboard from "./src/pages/Dashboard";
import Settings from "./src/pages/Settings";
import NotFound from "./src/pages/NotFound";

import ProtectedRoute from "./src/components/ProtectedRoute";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { getCurrentUser as getDbUser } from "./src/api/user";
import AppLayout from "./src/components/layout/AppLayout";
import Clients from "./src/pages/Clients";
import ClientActivation from "./src/pages/ClientActivation";
import UserActivation from "./src/pages/UserActivation";
import { ROLES } from "./src/types/roles.types";
import ContractManagement from "./src/pages/Contracts";
import UploadGsa from "./src/pages/UploadGsa";

try {
  Amplify.configure(awsExports);
} catch (e) {
  console.warn("Amplify configuration failed.", e);
}

const AppContent: React.FC = () => {
  const { setUser, status, setStatus } = useAuth();

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens?.idToken) {
        setStatus("unauthenticated");
        return;
      }
      const user = await getDbUser();
      setUser(user);
      setStatus("authenticated");
    } catch (err) {
      console.error("Auth bootstrap failed:", err);
      await signOut().catch(() => {});
      setStatus("unauthenticated");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(220,25%,97%)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(211,60%,35%)]" />
      </div>
    );
  }

  const isAuthenticated = status === "authenticated";

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onAuthSuccess={bootstrapAuth} />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Authenticated users */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />

            {/* Consultant only */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[ROLES.USER]}
                />
              }
            >
              <Route path="/clients" element={<Clients />} />
              <Route path="/contracts" element={<ContractManagement />} />
            </Route>

            {/* Admin only */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[ROLES.ADMIN]}
                />
              }
            >
              <Route path="/client-activation" element={<ClientActivation />} />
              <Route path="/user-activation" element={<UserActivation />} />
              <Route path="/upload-gsa" element={<UploadGsa />} />
            </Route>
          </Route>
        </Route>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

/* ------------------------------------------------------------------ */
/* App wrapper                                                         */
/* ------------------------------------------------------------------ */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
