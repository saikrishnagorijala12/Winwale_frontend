import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  History,
  FileSearchCorner,
  ChevronDown,
  ChevronRight,
  FileText,
  PackageCheck,
  FileCheckCorner,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Role, ROLES } from "@/src/types/roles.types";
import { Tooltip } from "../shared/Tooltip";

export const navSections = [
  {
    label: "Overview",
    items: [
      {
        to: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        roles: [ROLES.ADMIN, ROLES.USER],
      },
    ],
  },
  {
    label: "Analysis",
    items: [
      {
        to: "/pricelist-analysis",
        icon: FileSearchCorner,
        label: "Pricelist Analysis",
        roles: [ROLES.ADMIN, ROLES.USER],
      },
      {
        to: "/analyses",
        icon: History,
        label: "Analysis History",
        roles: [ROLES.ADMIN, ROLES.USER],
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        to: "/client-profiles",
        icon: FileText,
        label: "Client Profiles",
        roles: [ROLES.ADMIN, ROLES.USER],
      },
      {
        to: "/gsa-products",
        icon: PackageCheck,
        label: "GSA Products",
        roles: [ROLES.ADMIN, ROLES.USER],
      },
    ],
  },
  {
    label: "Administrative",
    items: [
      {
        to: "/user-activation",
        icon: UserCheck,
        label: "User Management",
        roles: [ROLES.ADMIN],
      },
      {
        to: "/client-activation",
        icon: FileCheckCorner,
        label: "Client Management",
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        to: "/settings",
        icon: Settings,
        label: "Settings",
        roles: [ROLES.ADMIN, ROLES.USER],
      },
    ],
  },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    Overview: true,
    Analysis: true,
    Workspace: true,
    Administrative: true,
    System: true,
  });

  const expandAllSections = () => {
    const allExpanded = Object.fromEntries(
      navSections.map((section) => [section.label, true]),
    );
    setExpandedSections(allExpanded);
  };

  const navigate = useNavigate();
  const isAdmin = user?.role === ROLES.ADMIN;

  const ROLE_MAP: Record<Role, string> = {
    admin: "Administrator",
    user: "Consultant",
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  const toggleSection = (label: string) => {
    if (!isAdmin) return;
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  useEffect(() => {
    const currentPath = location.pathname;

    navSections.forEach((section) => {
      const hasMatch = section.items.some((item) =>
        currentPath.startsWith(item.to),
      );

      if (hasMatch) {
        setExpandedSections((prev) => ({
          ...prev,
          [section.label]: true,
        }));
      }
    });
  }, [location.pathname]);

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile header  */}
      <header className="md:hidden sticky top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-40">
        <button
          onClick={(e) => {
            setOpen(true);
            e.stopPropagation();
            setIsCollapsed(false);
          }}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-50
          ${isCollapsed ? "w-20" : "w-72 md:w-64"} bg-slate-50/95 backdrop-blur-md border-r border-slate-200/60
          flex flex-col h-screen
          transform transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 overflow-hidden
        `}
      >
        <div
          className={`p-6 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            onClick={() => {
              navigate("/dashboard");
              setOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group relative"
          >
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Logo"
              className={`
        ${isCollapsed ? "w-10 h-10" : "w-8 h-8"} 
        object-contain 
        transition-opacity
        ${isCollapsed ? "group-hover:opacity-0" : ""}
      `}
            />

            {/* App Name */}
            {!isCollapsed && (
              <span className="text-2xl font-bold text-[#1e293b] tracking-tight">
                Winvale
              </span>
            )}

            {/* Hover Toggle (Collapsed only) */}
            {isCollapsed && (
              <Tooltip
                content="Open Sidebar"
                position="right"
                wrapperClassName="absolute inset-0 hidden md:inline-flex items-center justify-center"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCollapsed(false);
                  }}
                  className="
            absolute inset-0
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-all cursor-w-resize
          "
                  aria-label="Expand Sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5 text-slate-500" />
                </button>
              </Tooltip>
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>

          {/* Collapse button */}
          {!isCollapsed && (
            <Tooltip
              content="Close Sidebar"
              position="right"
              wrapperClassName="hidden md:inline-flex items-center justify-center"
            >
              <button
                onClick={() => {
                  setIsCollapsed(true);
                  expandAllSections();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all cursor-e-resize"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4">
          {navSections.map((section) => {
            const visibleItems = section.items.filter(
              (item) => user && item.roles.includes(user.role as Role),
            );

            if (visibleItems.length === 0) return null;

            const isExpanded = !isAdmin || expandedSections[section.label];

            return (
              <div key={section.label} className="mb-4">
                {/* Section Header */}
                <button
                  disabled={!isAdmin || isCollapsed}
                  onClick={() => toggleSection(section.label)}
                  className={`w-full flex items-center px-6 mb-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } ${
                    isAdmin && !isCollapsed
                      ? "hover:text-slate-900 cursor-pointer text-slate-400"
                      : "text-slate-400"
                  }`}
                >
                  {isCollapsed ? (
                    <div className="w-4 h-px bg-slate-300" />
                  ) : (
                    <>
                      <span>{section.label}</span>
                      {isAdmin &&
                        (isExpanded ? (
                          <ChevronDown size={12} />
                        ) : (
                          <ChevronRight size={12} />
                        ))}
                    </>
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                  } ${isCollapsed ? "flex flex-col items-center py-2" : ""}`}
                >
                  {visibleItems.map((item) => (
                    <Tooltip
                      key={item.to}
                      content={item.label}
                      position="right"
                      disabled={!isCollapsed}
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `group flex items-center transition-all duration-200 relative my-px ${
                            isCollapsed
                              ? "justify-center w-11 h-11 rounded-xl"
                              : "gap-3.5 px-6 py-2"
                          } ${
                            isActive
                              ? "text-[#24578f] font-semibold bg-[#e0e4eb]/90"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && !isCollapsed && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#24578f] rounded-r-full" />
                            )}
                            <item.icon
                              className={`${isCollapsed ? "w-5.5 h-5.5" : "w-5 h-5"} ${isActive ? "text-[#24578f]" : "text-slate-400 group-hover:text-slate-600"}`}
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                            {!isCollapsed && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </Tooltip>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer  */}
        <div
          className={`p-4 flex flex-col gap-3 ${isCollapsed ? "items-center" : ""}`}
        >
          <Tooltip content={`${user?.name || "User"} • ${ROLE_MAP[user?.role as Role] || "Guest"}`} position="right" disabled={!isCollapsed}>
            <Link
              to="/settings"
              className={`flex items-center ${
                isCollapsed
                  ? "justify-center w-10 h-10 p-0"
                  : "gap-3 p-2.5 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
              } rounded-xl transition-all`}
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#c3d7e7] to-[#a3c1da] flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-sm font-bold text-[#1e293b]">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                    {ROLE_MAP[user?.role as Role] || "Guest"}
                  </p>
                </div>
              )}
            </Link>
          </Tooltip>

          <Tooltip content="Sign out" position="right" disabled={!isCollapsed}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 h-10" : "gap-3 px-3 py-2.5"} text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group`}
            >
              <LogOut
                className={`w-5 h-5 group-hover:-translate-x-0.5 transition-transform ${isCollapsed ? "group-hover:translate-x-0" : ""}`}
              />
              {!isCollapsed && (
                <span className="font-semibold text-sm">Sign out</span>
              )}
            </button>
          </Tooltip>
        </div>
      </aside>

      {/*  Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Confirm Signout
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to sign out?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
