import React, { useState, useEffect, useRef, JSX } from "react";
import {
  UserCheck,
  UserX,
  Calendar,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Users,
  MoreVertical,
  RefreshCw,
  Phone,
  User2,
} from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import Pagination from "../components/shared/Pagination";
import { userService } from "../services/userService";
import { Role } from "../types/roles.types";
import { toast } from "sonner";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { User, UserProfile } from "../types/user.types";
import { TabType } from "../types/common.types";
import { formatPhoneNumber } from "../utils/phoneUtils";
import { useDebounce } from "../hooks/useDebounce";
import { Tooltip } from "../components/shared/Tooltip";
import { useAuth } from "../context/AuthContext";

const ROLE_MAP: Record<Role, string> = {
  admin: "Administrator",
  user: "Consultant",
};



interface ActionDropdownProps {
  user: User;
  onApprove: () => void;
  onReject: () => void;
  onChangeRole: () => void;
  isSelf?: boolean;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  user,
  onApprove,
  onReject,
  onChangeRole,
  isSelf = false,
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
        aria-label="Toggle user actions dropdown"
      >
        <MoreVertical className="w-5 h-5 text-slate-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
          {isSelf ? (
            <div className="px-4 py-2 text-xs font-medium text-slate-400 italic">
              Self-actions disabled
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface UserCardProps {
  user: User;
  onApprove: () => void;
  onReject: () => void;
  onChangeRole: () => void;
  getRoleStyle: (roleId: Role) => string;
  isSelf?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onApprove,
  onReject,
  onChangeRole,
  getRoleStyle,
  isSelf = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-bold text-sm uppercase shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start">
            <Tooltip content={user.name} position="top">
              <h3 className="font-bold text-slate-800 text-base truncate">
                {user.name} {isSelf && <span className="text-blue-500 text-xs ml-1">(You)</span>}
              </h3>
            </Tooltip>
            <Tooltip content={user.email} position="top">
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </Tooltip>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionDropdown
            user={user}
            onApprove={onApprove}
            onReject={onReject}
            onChangeRole={onChangeRole}
            isSelf={isSelf}
          />
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{formatPhoneNumber(user.phone_no || "")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-slate-400 shrink-0" />
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border capitalize ${getRoleStyle(
              user.role as Role,
            )}`}
          >
            {ROLE_MAP[user.role as Role] || "User"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {new Date(user.created_time || "").toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <StatusBadge
          status={
            user.is_deleted
              ? "rejected"
              : user.is_active
                ? "approved"
                : "pending"
          }
        />
      </div>
    </div>
  );
};

export default function UserActivation() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: User | null;
    action: "approve" | "reject";
  }>({
    isOpen: false,
    user: null,
    action: "approve",
  });
  const [roleChangeModal, setRoleChangeModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );
  const itemsPerPage = 8;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchUsers = async (page: number, query: string, tab: TabType) => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page,
        page_size: itemsPerPage,
        status: tab,
        search: query || undefined,
      });
      const { users: fetchedUsers, total_count, status_counts } = response;
      setUsers(fetchedUsers);
      setTotalItems(total_count);
      if (status_counts) {
        setStatusCounts(status_counts);
      }
    } catch (error) {
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
      setSelectedUserIds(new Set());
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchQuery, activeTab);
  }, [currentPage, debouncedSearchQuery, activeTab]);

  const openConfirmModal = (user: User, action: "approve" | "reject") => {
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

  const openRoleChangeModal = (user: User) => {
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

  const handleApprove = async (userId: number, action: "approve" | "reject") => {
    try {
      setIsActionLoading(true);

      await userService.approveUser(Number(userId), action);
      await fetchUsers(currentPage, debouncedSearchQuery, activeTab);
      toast.success(
        `User account ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
      closeConfirmModal();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || `Failed to ${action} user`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (action: "approve" | "reject") => {
    if (selectedUserIds.size === 0) return;

    try {
      setIsActionLoading(true);

      // Filter out self if accidentally selected
      const userIdsToUpdate = Array.from(selectedUserIds).filter(
        (id) => String(id) !== String(currentUser?.user_id)
      ).map(Number);

      if (userIdsToUpdate.length === 0) {
        toast.error("Cannot perform bulk actions on yourself");
        return;
      }

      await userService.bulkUpdateUserStatus(
        userIdsToUpdate,
        action,
      );
      
      const skippedCount = selectedUserIds.size - userIdsToUpdate.length;
      if (skippedCount > 0) {
        toast.info(`${skippedCount} user record (you) was skipped`);
      }

      toast.success(
        `${userIdsToUpdate.length} users ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
      setSelectedUserIds(new Set());
      await fetchUsers(currentPage, debouncedSearchQuery, activeTab);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || `Failed to bulk ${action} users`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === users.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(users.map((u) => String(u.user_id))));
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
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
      await userService.changeUserRole(Number(roleChangeModal.user.user_id));
      await fetchUsers(currentPage, debouncedSearchQuery, activeTab);

      toast.success("User role changed successfully");
      closeRoleChangeModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to change user role");
    } finally {
      setIsActionLoading(false);
    }
  };

  const getRoleStyle = (roleId: Role) => {
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

  const getEmptyStateTitle = () => {
    switch (activeTab) {
      case "pending":
        return "No pending requests";
      case "approved":
        return "No approved users";
      case "rejected":
        return "No rejected users";
      case "all":
      default:
        return "No users found";
    }
  };

  const title = getEmptyStateTitle();

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
            <span className="font-bold text-slate-700">
              {confirmModal.user?.name}
            </span>
            ?
          </>
        }
        details={[
          { label: "Email", value: confirmModal.user?.email || "" },
          { label: "Role", value: confirmModal.user ? ROLE_MAP[confirmModal.user.role as Role] : "User" },
        ]}
        warning={
          confirmModal.action === "reject"
            ? {
              message:
                "This action will reject the user's account. They won't be able to access the system.",
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
            <span className="font-bold text-slate-700">
              {roleChangeModal.user?.name}
            </span>
            ?
          </>
        }
        details={[
          {
            label: "Current Role",
            value: roleChangeModal.user ? ROLE_MAP[roleChangeModal.user.role as Role] : "User",
          },
          {
            label: "New Role",
            value:
              roleChangeModal.user?.role === "admin"
                ? "Consultant"
                : "Administrator",
          },
        ]}
        warning={{
          message:
            "This will change the user's permissions and access level in the system.",
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            label: "Total Users",
            count: statusCounts.all,
            icon: Users,
            color: "blue",
          },
          {
            label: "Pending Approvals",
            count: statusCounts.pending,
            icon: Clock,
            color: "orange",
          },
          {
            label: "Approved",
            count: statusCounts.approved,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "Rejected",
            count: statusCounts.rejected,
            icon: XCircle,
            color: "rose",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm flex items-center gap-3 sm:gap-5 border border-slate-100"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center shrink-0`}
            >
              <stat.icon
                className={`w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-${stat.color}-600`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                {stat.label}
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                {stat.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 ">
        <div className="border-b border-slate-100 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 overflow-x-auto">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {[
              {
                id: "all",
                label: "All Users",
                count: statusCounts.all,
                color: "blue",
              },
              {
                id: "pending",
                label: "Pending",
                count: statusCounts.pending,
                color: "orange",
              },
              {
                id: "approved",
                label: "Approved",
                count: statusCounts.approved,
                color: "emerald",
              },
              {
                id: "rejected",
                label: "Rejected",
                count: statusCounts.rejected,
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
              aria-label="Search users by name or email"
            />
          </div>
        </div>

        <div className="lg:hidden px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
              <p className="text-sm text-slate-500 font-medium">
                Loading users...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <User2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-500">{title}</h3>
            </div>
          ) : (
            users.map((user) => (
              <UserCard
                key={user.user_id}
                user={user}
                onApprove={() => openConfirmModal(user, "approve")}
                onReject={() => openConfirmModal(user, "reject")}
                onChangeRole={() => openRoleChangeModal(user)}
                getRoleStyle={getRoleStyle}
                isSelf={String(user.user_id) === String(currentUser?.user_id)}
              />
            ))
          )}
        </div>

        {selectedUserIds.size > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-8 border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <UserCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div className="pr-4 border-r border-slate-700/50">
                <p className="text-sm font-bold text-white">
                  {selectedUserIds.size} users selected
                </p>
                <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                  Perform bulk actions on selection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBulkStatusUpdate("approve")}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Approve {selectedUserIds.size > 1 ? "All" : ""}
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("reject")}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-900/20 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap active:scale-95"
              >
                <UserX className="w-3.5 h-3.5" />
                Reject {selectedUserIds.size > 1 ? "All" : ""}
              </button>
              <div className="w-px h-6 bg-slate-700/50 mx-1" />
              <button
                onClick={() => setSelectedUserIds(new Set())}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="hidden lg:block  px-6 pb-6">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-4 w-10 text-center">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 accent-[#24588fe1] cursor-pointer disabled:cursor-not-allowed transition-all"
                    checked={
                      users.length > 0 &&
                      selectedUserIds.size === users.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Registered Date
                </th>
                <th className="text-right px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                      <p className="text-sm text-slate-500 font-medium">
                        Loading users...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <User2 className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-slate-500">
                        {title}
                      </h3>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.user_id}
                    className={`group transition-colors ${selectedUserIds.has(String(user.user_id))
                        ? "bg-blue-50/50"
                        : "hover:bg-slate-50/30"
                      }`}
                  >
                    <td
                      className="px-4 py-4 w-10 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectUser(String(user.user_id));
                      }}
                    >
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 accent-[#24588fe1] cursor-pointer disabled:cursor-not-allowed transition-all"
                        checked={selectedUserIds.has(String(user.user_id))}
                        onChange={() => { }} // Handled by TD click
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-xs uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col items-start">
                          <Tooltip content={user.name} position="top">
                            <p className="font-bold text-sm text-slate-800 truncate max-w-37.5">
                              {user.name} {String(user.user_id) === String(currentUser?.user_id) && <span className="text-blue-500 text-xs ml-1">(You)</span>}
                            </p>
                          </Tooltip>
                          <Tooltip content={user.email} position="top">
                            <p className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-37.5">
                              {user.email}
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border capitalize ${getRoleStyle(
                          user.role as Role,
                        )}`}
                      >
                        <Shield className="w-3 h-3" />
                        {ROLE_MAP[user.role as Role] || "User"}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      {user.phone_no ? (
                        <p className="text-sm font-semibold text-slate-600">
                          {formatPhoneNumber(user.phone_no)}
                        </p>
                      ) : (
                        <span className="text-[10px] italic font-medium text-gray-400 uppercase">
                          Not provided
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <StatusBadge
                        status={
                          user.is_deleted
                            ? "rejected"
                            : user.is_active
                              ? "approved"
                              : "pending"
                        }
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_time || "").toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          user={user}
                          onApprove={() => openConfirmModal(user, "approve")}
                          onReject={() => openConfirmModal(user, "reject")}
                          onChangeRole={() => openRoleChangeModal(user)}
                          isSelf={String(user.user_id) === String(currentUser?.user_id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          label="users"
        />
      </div>
    </div>
  );
}
