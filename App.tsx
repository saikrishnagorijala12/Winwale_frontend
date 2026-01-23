import React, { useEffect } from "react";
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
import PendingApproval from "./src/pages/PendingApproval";
import GsaProducts from "./src/pages/GsaProducts";
import ClientProducts from "./src/pages/ClientProducts";
import PriceListAnalysis from "./src/pages/PriceListAnalysis";
import { Analysis } from "./src/pages/Analysis";

try {
  Amplify.configure(awsExports);
} catch (e) {
  console.warn("Amplify configuration failed.", e);
}

const AppContent: React.FC = () => {
  const { status, setStatus, isActive, refreshUser } = useAuth();

  useEffect(() => {
    bootstrapAuth();
  }, []);

  // const bootstrapAuth = async () => {
  //   try {
  //     const session = await fetchAuthSession();

  //     if (!session.tokens?.idToken) {
  //       setStatus("unauthenticated");
  //       return;
  //     }

  //     const user = await getDbUser();

  //     setUser(user);
  //     setStatus("authenticated");
  //   } catch (err) {
  //     console.error("Auth bootstrap failed:", err);
  //     await signOut().catch(() => {});
  //     setStatus("unauthenticated");
  //   }
  // };
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
              <Login onAuthSuccess={bootstrapAuth} />
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
              <Route
                path="/clients/:clientId/products"
                element={<ClientProducts />}
              />

              <Route path="/contracts" element={<ContractManagement />} />
              {/* <Route path="/pricelist-analysis" element={<PriceListAnalysis />} /> */}
              <Route path="/pricelist-analysis" element={<Analysis />} />
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
              <Route path="/gsa-products" element={<GsaProducts />} />
              <Route path="/upload-gsa" element={<UploadGsa />} />
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;



// import React from "react";
// import { AuthProvider } from "./src/context/AuthContext";
// import AppRoutes from "./src/routes/AppRoutes";

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// };

// export default App;

