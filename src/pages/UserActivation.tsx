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
  Users,
} from "lucide-react";
import api from "../lib/axios";
import { Role } from "../types/roles.types";

const ROLE_MAP: Record<Role, string> = {
  admin: "Administrator",
  user: "Consultant",
};

type TabType = "all" | "pending" | "approved" | "rejected";

export default function UserActivation() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Fetch Users from Backend
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

  const pendingUsers = users.filter((u) => !u.is_active && !u.is_deleted);
  const approvedUsers = users.filter((u) => u.is_active && !u.is_deleted);
  const rejectedUsers = users.filter((u) => u.is_deleted);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve/Reject User Action
  const handleApprove = async (userId, action) => {
    try {
      await api.patch(`/users/${userId}/approve`, null, {
        params: { action },
      });

      // Refresh users after action
      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert(`Failed to ${action} user`);
    }
  };

  // Get filtered users based on active tab
  const getFilteredUsers = () => {
    let userList = [];
    switch (activeTab) {
      case "all":
        userList = users;
        break;
      case "pending":
        userList = pendingUsers;
        break;
      case "approved":
        userList = approvedUsers;
        break;
      case "rejected":
        userList = rejectedUsers;
        break;
      default:
        userList = users;
    }

    return userList.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredUsers = getFilteredUsers();

  const getRoleStyle = (roleId) => {
    const role = ROLE_MAP[roleId] || "default";
    switch (role) {
      case "Administrator":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Consultant":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusBadge = (user) => {
    if (user.is_deleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-600 border-rose-100">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    } else if (user.is_active) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
          <CheckCircle2 className="w-3 h-3" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-orange-50 text-orange-600 border-orange-100">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "all":
        return "All Users";
      case "pending":
        return "Pending User Requests";
      case "approved":
        return "Approved Users";
      case "rejected":
        return "Rejected Users";
      default:
        return "Users";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "all":
        return "Complete list of all users in the system";
      case "pending":
        return "Users awaiting account activation";
      case "approved":
        return "Users with active accounts";
      case "rejected":
        return "Users whose accounts were rejected";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0f172a]">User Management</h1>
        <p className="text-slate-500 mt-1">
          Manage user accounts, approvals, and permissions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total Users
            </p>
            <p className="text-4xl font-bold text-slate-900">{users.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pending Approvals
            </p>
            <p className="text-4xl font-bold text-slate-900">
              {pendingUsers.length}
            </p>
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
            <p className="text-4xl font-bold text-slate-900">
              {approvedUsers.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center gap-5 border border-slate-100">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
            <XCircle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Rejected
            </p>
            <p className="text-4xl font-bold text-slate-900">
              {rejectedUsers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-100 px-8 pt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "all"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "pending"
                  ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Pending ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "approved"
                  ? "bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Approved ({approvedUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${
                activeTab === "rejected"
                  ? "bg-rose-50 text-rose-600 border-b-2 border-rose-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Rejected ({rejectedUsers.length})
            </button>
          </div>
        </div>

        {/* Table Header Area */}
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {getTabTitle()}
            </h2>
            <p className="text-slate-500 text-sm">{getTabDescription()}</p>
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
                  Role
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
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
                      <Shield className="w-3 h-3" />
                      {ROLE_MAP[user.role] || "User"}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-sm font-semibold text-slate-600">
                      {user.phone_no || "No Phone"}
                    </p>
                  </td>
                  <td className="px-4 py-5">{getStatusBadge(user)}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(user.created_time).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-3">
                      {!user.is_active && !user.is_deleted && (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(user.user_id, "approve")
                            }
                            className="flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                          >
                            <UserCheck className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleApprove(user.user_id, "reject")
                            }
                            className="flex items-center gap-2 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 px-5 py-2 rounded-xl text-sm font-bold transition-all"
                          >
                            <UserX className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      {user.is_active && (
                        <span className="text-xs text-slate-400 italic">
                          Active Account
                        </span>
                      )}
                      {user.is_deleted && (
                        <span className="text-xs text-slate-400 italic">
                          Account Rejected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}