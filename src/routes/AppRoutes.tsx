import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Amplify } from "aws-amplify";

import awsExports from "../aws-exports";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
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
import { DocumentProvider } from "../context/DocumentContext";
import { DocumentWorkflowRenderer } from "../pages/DocumentGeneration";
import AnalysisHistory from "../pages/AnalysisHistory";
import DownloadHistory from "../pages/DownloadHistory";
import Dashboard from "../pages/dashboard/Dashboard";
import AnalysisDetails from "../pages/AnalysisDetails";
import { ClientProvider } from "../context/ClientContext";
import { AnalysisProvider } from "../context/AnalysisContext";

try {
  Amplify.configure(awsExports);
} catch (e) {
  console.warn("Amplify configuration failed.", e);
}

const AppRoutes: React.FC = () => {
  const { status, isActive } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f7f9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24578f]" />
      </div>
    );
  }

  const isAuthenticated = status === "authenticated";

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              isActive ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/pending-approval" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/pending-approval"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isActive ? (
              <PendingApproval />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout />}>
            <Route element={<ClientProvider />}>
              <Route element={<AnalysisProvider />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />

                <Route
                  element={
                    <ProtectedRoute
                      isAuthenticated={isAuthenticated}
                      allowedRoles={[ROLES.USER, ROLES.ADMIN]}
                    />
                  }
                >
                  <Route path="/clients" element={<Clients />} />
                  <Route
                    path="/clients/products"
                    element={<ClientProducts />}
                  />
                  <Route path="/contracts" element={<ContractManagement />} />

                  <Route path="/gsa-products" element={<GsaProducts />} />
                  <Route path="/gsa-products/upload" element={<UploadGsa />} />
                  <Route
                    path="/pricelist-analysis"
                    element={<PriceListAnalysis />}
                  />
                  <Route
                    path="/documents"
                    element={
                      <DocumentProvider>
                        <DocumentWorkflowRenderer />
                      </DocumentProvider>
                    }
                  />

                  <Route path="/analyses" element={<AnalysisHistory />} />
                  <Route
                    path="/analyses/details"
                    element={<AnalysisDetails />}
                  />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    allowedRoles={[ROLES.ADMIN]}
                  />
                }
              >
                <Route
                  path="/client-activation"
                  element={<ClientActivation />}
                />
                <Route path="/user-activation" element={<UserActivation />} />
              </Route>
            </Route>
          </Route>
        </Route>

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
