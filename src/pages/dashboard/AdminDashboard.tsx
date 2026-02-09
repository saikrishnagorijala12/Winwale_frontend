import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  ChevronRight,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "@/src/lib/axios";

interface User {
  user_id: number;
  name: string;
  email: string;
  phone_no: string | null;
  is_active: boolean;
  is_deleted: boolean;
  role: string;
  created_time: string;
}

interface Client {
  client_id: number;
  company_name: string;
  company_email: string;
  contact_officer_name: string;
  status: string;
  created_time: string;
  updated_time: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    bg: "#f5f7f9",
    fg: "#1b2531",
    muted: "#627383",
    border: "#d9e0e8",
    success: "#33b17d",
    warning: "#f9ab20",
    destructive: "#df3a3a",
    secondaryBg: "#f8fafc",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, clientsResponse] = await Promise.all([
        api.get(`/users/all`),
        api.get(`/clients`),
      ]);

      setUsers(usersResponse.data);
      setClients(clientsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: "approve" | "reject") => {
    try {
      await api.patch(
        `/users/${userId}/approve?action=${action}`
      );
      fetchData();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const handleClientAction = async (clientId: number, action: "approve" | "reject") => {
    try {
      await api.patch(
        `/clients/${clientId}/approve?action=${action}`
      );
      fetchData();
    } catch (error) {
      console.error(`Error ${action}ing client:`, error);
    }
  };

  const totalUsers = users.filter(u => !u.is_deleted);
  const pendingUsers = users.filter(u => !u.is_active && !u.is_deleted);
  const pendingClients = clients.filter(c => c.status === "pending");
  const activeUsers = users.filter(u => u.is_active && !u.is_deleted);
  const approvedClients = clients.filter(c => c.status === "approved");

  const displayUsers = pendingUsers.slice(0, 5);
  const displayClients = pendingClients.slice(0, 5);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.length.toString(),
      icon: Users,
    },
    {
      label: "Client Approvals",
      value: pendingClients.length.toString(),
      icon: Building2,
    },
    {
      label: "Active Users",
      value: activeUsers.length.toString(),
      icon:UserCheck,
    },
    {
      label: "Verified Clients",
      value: approvedClients.length.toString(),
      icon: ShieldCheck,
    },
  ];

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#24578f]" />
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 lg:p-10 animate-fade-in"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
        <div className="space-y-1">
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: colors.fg }}
          >
            Welcome, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="font-medium" style={{ color: colors.muted }}>
            Reviewing pending user access and client profile verifications.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 flex flex-col justify-between rounded-2xl transition-all hover:shadow-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: colors.muted }}
              >
                {stat.label}
              </span>
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: colors.secondaryBg }}
              >
                <stat.icon
                  className="w-5 h-5 text-[#24548f]"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div>
              <div
                className="text-3xl font-black tracking-tighter mb-1"
                style={{ color: colors.fg }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* User Requests Column */}
        <div className="bg-white p-8 rounded-2xl animate-slide-up shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: colors.fg }}>
                User Access Requests
              </h2>
              <p className="text-sm font-medium" style={{ color: colors.muted }}>
                Account registration approvals
              </p>
            </div>
            <span className="bg-blue-50 text-[#24548f] text-[10px] font-black px-2 py-1 rounded">
              {pendingUsers.length} PENDING
            </span>
          </div>

          <div className="space-y-3">
            {displayUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-medium" style={{ color: colors.muted }}>
                  No pending user requests
                </p>
              </div>
            ) : (
              <>
                {displayUsers.map((item) => (
                  <div
                    key={item.user_id}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:shadow-sm transition-all"
                    style={{ backgroundColor: `${colors.bg}80` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-sm"
                      style={{ borderColor: colors.border }}
                    >
                      <UserCheck className="w-5 h-5 text-[#24548f]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate" style={{ color: colors.fg }}>
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold" style={{ color: colors.muted }}>
                        {item.role} • {getTimeAgo(item.created_time)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors" 
                        style={{ color: colors.destructive }}
                        onClick={() => handleUserAction(item.user_id, "reject")}
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                      <button 
                        className="p-2 rounded-xl hover:bg-green-50 transition-colors" 
                        style={{ color: colors.success }}
                        onClick={() => handleUserAction(item.user_id, "approve")}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingUsers.length > 5 && (
                  <button
                    onClick={() => navigate("/user-activation")}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm transition-all hover:shadow-md flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: colors.secondaryBg,
                      color: colors.fg 
                    }}
                  >
                    View All Users
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Client Requests Column */}
        <div className="bg-white p-8 rounded-2xl animate-slide-up shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: colors.fg }}>
                Client Profile Reviews
              </h2>
              <p className="text-sm font-medium" style={{ color: colors.muted }}>
                Company profile approvals
              </p>
            </div>
            <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-1 rounded">
              {pendingClients.length} PENDING
            </span>
          </div>

          <div className="space-y-3">
            {displayClients.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-medium" style={{ color: colors.muted }}>
                  No pending client requests
                </p>
              </div>
            ) : (
              <>
                {displayClients.map((item) => (
                  <div
                    key={item.client_id}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:shadow-sm transition-all"
                    style={{ backgroundColor: `${colors.bg}80` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-sm"
                      style={{ borderColor: colors.border }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: colors.success }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate" style={{ color: colors.fg }}>
                        {item.company_name}
                      </h4>
                      <p className="text-xs font-bold" style={{ color: colors.muted }}>
                        {item.contact_officer_name} • {getTimeAgo(item.created_time)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors" 
                        style={{ color: colors.destructive }}
                        onClick={() => handleClientAction(item.client_id, "reject")}
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                      <button 
                        className="p-2 rounded-xl hover:bg-green-50 transition-colors" 
                        style={{ color: colors.success }}
                        onClick={() => handleClientAction(item.client_id, "approve")}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingClients.length > 5 && (
                  <button
                    onClick={() => navigate("/client-activation")}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm transition-all hover:shadow-md flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: colors.secondaryBg,
                      color: colors.fg 
                    }}
                  >
                    View All Clients
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}