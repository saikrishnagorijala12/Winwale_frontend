import React, { useState, useEffect, useRef, JSX } from "react";
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
  AlertTriangle,
  MoreVertical,
  RefreshCw,
  User,
  Phone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import api from "../lib/axios";
import { Role } from "../types/roles.types";
import { toast } from "sonner";
import ConfirmationModal from "../components/shared/ConfirmationModal";

const ROLE_MAP: Record<Role, string> = {
  admin: "Administrator",
  user: "Consultant",
};

type TabType = "all" | "pending" | "approved" | "rejected";


interface ActionDropdownProps {
  user: any;
  onApprove: () => void;
  onReject: () => void;
  onChangeRole: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  user,
  onApprove,
  onReject,
  onChangeRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isPending = !user.is_active && !user.is_deleted;
  const isApproved = user.is_active && !user.is_deleted;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-slate-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
          {isPending && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <UserX className="w-4 h-4" />
                Reject
              </button>
            </>
          )}

          {isApproved && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeRole();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm  text-slate-700 font-medium  hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#3399cc]" />
                Change Role
              </button>
              <div className="border-t border-slate-100 my-2"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <UserX className="w-4 h-4" />
                Reject
              </button>
            </>
          )}

          {user.is_deleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface UserCardProps {
  user: any;
  onApprove: () => void;
  onReject: () => void;
  onChangeRole: () => void;
  getRoleStyle: (roleId: string) => string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onApprove,
  onReject,
  onChangeRole,
  getRoleStyle,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-bold text-sm uppercase shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-base truncate">
              {user.name}
            </h3>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionDropdown
            user={user}
            onApprove={onApprove}
            onReject={onReject}
            onChangeRole={onChangeRole}
          />
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{user.phone_no || "No Phone"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-slate-400 shrink-0" />
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border capitalize ${getRoleStyle(
              user.role,
            )}`}
          >
            {ROLE_MAP[user.role] || "User"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {new Date(user.created_time).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <StatusBadge status={user.is_deleted ? "rejected" : user.is_active ? "approved" : "pending"} />
      </div>
    </div>
  );
};

export default function UserActivation() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    user: null,
    action: "approve" as "approve" | "reject",
  });
  const [roleChangeModal, setRoleChangeModal] = useState({
    isOpen: false,
    user: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/all");
      const data = response.data;
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (error) {
      toast.error("Failed to load users. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const pendingUsers = users.filter((u) => !u.is_active && !u.is_deleted);
  const approvedUsers = users.filter((u) => u.is_active && !u.is_deleted);
  const rejectedUsers = users.filter((u) => u.is_deleted);

  const openConfirmModal = (user, action: "approve" | "reject") => {
    setConfirmModal({
      isOpen: true,
      user,
      action,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      user: null,
      action: "approve",
    });
  };

  const openRoleChangeModal = (user) => {
    setRoleChangeModal({
      isOpen: true,
      user,
    });
  };

  const closeRoleChangeModal = () => {
    setRoleChangeModal({
      isOpen: false,
      user: null,
    });
  };

  const handleApprove = async (userId, action) => {
    try {
      setIsActionLoading(true);

      await api.patch(`/users/${userId}/approve`, null, {
        params: { action },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.user_id === userId) {
            return {
              ...user,
              is_active: action === "approve",
              is_deleted: action === "reject",
            };
          }
          return user;
        }),
      );
      toast.success(
        `User account ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
      closeConfirmModal();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const confirmStatusChange = () => {
    if (confirmModal.user) {
      handleApprove(confirmModal.user.user_id, confirmModal.action);
    }
  };

  const handleRoleChange = async () => {
    if (!roleChangeModal.user) return;

    try {
      setIsActionLoading(true);
      await api.put(`/users/change_role/${roleChangeModal.user.user_id}`);
      await fetchUsers();

      toast.success("User role changed successfully");
      closeRoleChangeModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to change user role");
    } finally {
      setIsActionLoading(false);
    }
  };

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
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const filteredUsers = getFilteredUsers();

  const totalItems = filteredUsers.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const getUserStatus = (user: any): string => {
    if (user.is_deleted) return "rejected";
    if (user.is_active) return "approved";
    return "pending";
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




  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmStatusChange}
        title={`Confirm ${confirmModal.action === "approve" ? "Approval" : "Rejection"}`}
        message={
          <>
            Are you sure you want to {confirmModal.action}{" "}
            <span className="font-bold text-slate-700">{confirmModal.user?.name}</span>?
          </>
        }
        details={[
          { label: "Email", value: confirmModal.user?.email || "" },
          { label: "Role", value: ROLE_MAP[confirmModal.user?.role] || "User" },
        ]}
        warning={
          confirmModal.action === "reject"
            ? {
              message: "This action will reject the user's account. They won't be able to access the system.",
              type: "rose",
            }
            : undefined
        }
        variant={confirmModal.action === "approve" ? "emerald" : "rose"}
        confirmText={confirmModal.action === "approve" ? "Approve" : "Reject"}
        isSubmitting={isActionLoading}
      />

      <ConfirmationModal
        isOpen={roleChangeModal.isOpen}
        onClose={closeRoleChangeModal}
        onConfirm={handleRoleChange}
        title="Change User Role"
        message={
          <>
            Are you sure you want to change the role of{" "}
            <span className="font-bold text-slate-700">{roleChangeModal.user?.name}</span>?
          </>
        }
        details={[
          { label: "Current Role", value: ROLE_MAP[roleChangeModal.user?.role] || "User" },
          {
            label: "New Role",
            value: roleChangeModal.user?.role === "admin" ? "Consultant" : "Administrator",
          },
        ]}
        warning={{
          message: "This will change the user's permissions and access level in the system.",
          type: "amber",
        }}
        variant="blue"
        confirmText="Change Role"
        isSubmitting={isActionLoading}
      />

      <div className="mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          User Management
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage user accounts, approvals, and permissions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            label: "Total Users",
            count: users.length,
            icon: Users,
            color: "blue",
          },
          {
            label: "Pending Approvals",
            count: pendingUsers.length,
            icon: Clock,
            color: "orange",
          },
          {
            label: "Approved",
            count: approvedUsers.length,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "Rejected",
            count: rejectedUsers.length,
            icon: XCircle,
            color: "rose",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 border border-slate-100"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-${stat.color}-50 rounded-full flex items-center justify-center shrink-0`}
            >
              <stat.icon
                className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-${stat.color}-600`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {stat.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 ">
        {/* Tabs */}
        <div className="border-b border-slate-100 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 overflow-x-auto">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {[
              {
                id: "all",
                label: "All Users",
                count: users.length,
                color: "blue",
              },
              {
                id: "pending",
                label: "Pending",
                count: pendingUsers.length,
                color: "orange",
              },
              {
                id: "approved",
                label: "Approved",
                count: approvedUsers.length,
                color: "emerald",
              },
              {
                id: "rejected",
                label: "Rejected",
                count: rejectedUsers.length,
                color: "rose",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                  ? `bg-${tab.color}-50 text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Table Header Area */}
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Card View  */}
        <div className="lg:hidden px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
              <p className="text-slate-400 text-sm">Loading users...</p>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No users found.
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <UserCard
                key={user.user_id}
                user={user}
                onApprove={() => openConfirmModal(user, "approve")}
                onReject={() => openConfirmModal(user, "reject")}
                onChangeRole={() => openRoleChangeModal(user)}
                getRoleStyle={getRoleStyle}
              />
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block  px-6 pb-6">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Registered Date
                </th>
                <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                      <p className="text-slate-400 text-sm">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
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
                          user.role,
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
                    <td className="px-4 py-5"><StatusBadge status={user.is_deleted ? "rejected" : user.is_active ? "approved" : "pending"} /></td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          user={user}
                          onApprove={() => openConfirmModal(user, "approve")}
                          onReject={() => openConfirmModal(user, "reject")}
                          onChangeRole={() => openRoleChangeModal(user)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalItems > itemsPerPage && (
          <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 font-medium">
              Showing{" "}
              <span className="text-slate-900 font-semibold">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-900 font-semibold">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 font-semibold">{totalItems}</span>{" "}
              users
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const delta = 1;
                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= currentPage - delta && i <= currentPage + delta)
                    ) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== "...") {
                      pages.push("...");
                    }
                  }
                  return pages.map((pageNum, idx) => (
                    <React.Fragment key={idx}>
                      {pageNum === "..." ? (
                        <span className="px-2 text-slate-400 font-medium">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(Number(pageNum))}
                          className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                            ${currentPage === pageNum
                              ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ));
                })()}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
