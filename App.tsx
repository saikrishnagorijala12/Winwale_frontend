import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppRoutes from "./src/routes/AppRoutes";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

