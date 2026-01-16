import React, { useState, useEffect } from "react";
import {
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import api from "../lib/axios";
import { Role } from "../types/roles.types";

const ROLE_MAP: Record<Role, string> = {
  admin: "Administrator",
  user: "Consultant",
};

export default function UserActivation() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/all");
      const data = response.data;

      const userList = Array.isArray(data) ? data : [data];
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingUsers = users.filter(
  (u) => !u.is_active && !u.is_deleted
);

const approvedUsers = users.filter(
  (u) => u.is_active && !u.is_deleted
);

const rejectedUsers = users.filter(
  (u) => u.is_deleted
);


  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Approve User Action
  const handleApprove = async (userId, action) => {
    try {
      await api.patch(`/users/${userId}/approve`, null, {
        params: { action },
      });

      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    } catch (error) {
      console.error(error);
      alert(`Failed to ${action} user`);
    }
  };

  const filteredUsers = pendingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleStyle = (roleId) => {
    const role = ROLE_MAP[roleId] || "default";
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "manager":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "analyst":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "consultant":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0f172a]">User Activation</h1>
        <p className="text-slate-500 mt-1">
          Review and approve pending user registration requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pending Approvals
            </p>
            <p className="text-4xl font-bold text-slate-900">{pendingUsers.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Approved
            </p>
            <p className="text-4xl font-bold text-slate-900">{approvedUsers.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
            <XCircle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Rejected Today
            </p>
            <p className="text-4xl font-bold text-slate-900">{rejectedUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Header Area */}
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Pending User Requests
            </h2>
            <p className="text-slate-500 text-sm">
              Users awaiting account activation
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Requested Role
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingUsers.map((user) => (
                <tr
                  key={user.user_id}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border capitalize ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      <Shield className="w-3 h-3" />{" "}
                      {ROLE_MAP[user.role] || "User"}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-sm font-semibold text-slate-600">
                      {user.phone_no || "No Phone"}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(user.created_time).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleApprove(user.user_id, "approve")}
                        className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        <UserCheck className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(user.user_id, "reject")}
                        className="flex items-center gap-2 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 px-5 py-2 rounded-xl text-sm font-bold transition-all"
                      >
                        <UserX className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              No pending registration requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
