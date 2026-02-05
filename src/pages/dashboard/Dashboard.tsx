import React from "react";
import { useAuth } from "../../context/AuthContext";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (!user || !user.is_active || user.is_deleted) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Access denied
      </div>
    );
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;

    case "user":
    default:
      return <UserDashboard />;
  }
}
