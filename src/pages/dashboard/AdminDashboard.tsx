import React from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  UserPlus,
  Building2,
  ChevronRight,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const stats = [
    {
      label: "User Approvals",
      value: "5",
      change: "2 urgent requests",
      trend: "warning",
      icon: UserPlus,
    },
    {
      label: "Client Approvals",
      value: "9",
      change: "4 new profiles",
      trend: "up",
      icon: Building2,
    },
    {
      label: "Active Users",
      value: "182",
      change: "+12 this month",
      trend: "up",
      icon: Users,
    },
    {
      label: "Verified Clients",
      value: "64",
      change: "All profiles active",
      trend: "up",
      icon: ShieldCheck,
    },
  ];

  const userRequests = [
    {
      id: "1",
      name: "James Wilson",
      detail: "Senior Consultant",
      date: "10m ago",
    },
    {
      id: "4",
      name: "Sarah Chen",
      detail: "Junior Analyst",
      date: "Yesterday",
    },
  ];

  const clientRequests = [
    {
      id: "2",
      name: "Global Logistics Inc",
      detail: "New GSA Schedule",
      date: "1h ago",
    },
    {
      id: "3",
      name: "Enterprise Solutions",
      detail: "Profile Update",
      date: "3h ago",
    },
  ];

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
            className="bg-white p-6 h-40 flex flex-col justify-between rounded-2xl transition-all hover:shadow-lg shadow-sm"
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
              <div
                className="flex items-center gap-1.5 text-[11px] font-bold"
                style={{
                  color: stat.trend === "up" ? colors.success : colors.warning,
                }}
              >
                {stat.change}
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
              {userRequests.length} PENDING
            </span>
          </div>

          <div className="space-y-3">
            {userRequests.map((item) => (
              <div
                key={item.id}
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
                    {item.detail} • {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl hover:bg-red-50" style={{ color: colors.destructive }}>
                    <XCircle className="w-6 h-6" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-green-50" style={{ color: colors.success }}>
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
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
                Company profile & GSA updates
              </p>
            </div>
            <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-1 rounded">
              {clientRequests.length} PENDING
            </span>
          </div>

          <div className="space-y-3">
            {clientRequests.map((item) => (
              <div
                key={item.id}
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
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold" style={{ color: colors.muted }}>
                    {item.detail} • {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl hover:bg-red-50" style={{ color: colors.destructive }}>
                    <XCircle className="w-6 h-6" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-green-50" style={{ color: colors.success }}>
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}