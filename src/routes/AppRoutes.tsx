import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

import awsExports from "../aws-exports";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import PendingApproval from "../pages/PendingApproval";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";

import Clients from "../pages/Clients";
import ClientProducts from "../pages/ClientProducts";
import ClientActivation from "../pages/ClientActivation";
import UserActivation from "../pages/UserActivation";
import ContractManagement from "../pages/Contracts";
import UploadGsa from "../pages/UploadGsa";
import GsaProducts from "../pages/GsaProducts";

import { ROLES } from "../types/roles.types";
import PriceListAnalysis from "../pages/PriceListAnalysis";

try {
  Amplify.configure(awsExports);
} catch (e) {
  console.warn("Amplify configuration failed.", e);
}

const AppRoutes: React.FC = () => {
  const { status, setStatus, isActive, refreshUser } = useAuth();

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

      await refreshUser();
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


  if (isAuthenticated && !isActive) {
    return (
      <Router>
        <Routes>
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="*" element={<Navigate to="/pending-approval" replace />} />
        </Routes>
      </Router>
    );
  }


  return (
    <Router>
      <Routes>
        {/* Auth */}
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

        {/* Protected */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />

            {/* Consultant */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[ROLES.USER]}
                />
              }
            >
              <Route path="/clients" element={<Clients />} />
              <Route
                path="/clients/:clientId/products"
                element={<ClientProducts />}
              />
              <Route path="/contracts" element={<ContractManagement />} />
              <Route path="/pricelist-analysis" element={<PriceListAnalysis />} />
            </Route>

            {/* Admin */}
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
              <Route path="/gsa-products" element={<GsaProducts />} />
              <Route path="/upload-gsa" element={<UploadGsa />} />
            </Route>
          </Route>
        </Route>

        {/* Root */}
        <Route
                  path="/"
                  element={
                    <Navigate
                      to={
                        !isAuthenticated
                          ? "/login"
                          : isActive
                          ? "/dashboard"
                          : "/pending-approval"
                      }
                      replace
                    />
                  }
                />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
