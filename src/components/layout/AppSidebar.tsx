import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  File,
  Building2Icon,
  ListCheckIcon,
  History,
  FileSearchCorner,
} from "lucide-react";
import { Role, ROLES } from "@/src/types/roles.types";

/*  NAV CONFIG ORGANIZED BY SECTIONS  */
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
        roles: [ROLES.USER],
      },
      {
        to: "/analyses",
        icon: History,
        label: "Analysis History",
        roles: [ROLES.USER],
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        to: "/clients",
        icon: Building2Icon,
        label: "Clients",
        roles: [ROLES.USER],
      },
      {
        to: "/contracts",
        icon: File,
        label: "Contracts",
        roles: [ROLES.USER],
      },
      {
        to: "/gsa-products",
        icon: ListCheckIcon,
        label: "GSA Products",
        roles: [ROLES.USER],
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
        icon: Building2Icon,
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

/*  SIDEBAR  */
export default function AppSidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const ROLE_MAP: Record<Role, string> = {
    admin: "Administrator",
    user: "Consultant",
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    setOpen(false);
  };

  return (
    <>
      {/*  Mobile header  */}
      <header className="md:hidden sticky top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-40 bg-white border-b border-slate-200">
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      {/*  Mobile Overlay  */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/*  SIDEBAR  */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-50
          w-72 md:w-64 bg-[#f8fafc] border-r border-slate-200
          flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="logo.png"
              alt="Winvale Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold text-[#1e293b] tracking-tight">
              Winvale
            </span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4">
          {navSections.map((section) => {
            // Filter items in this section based on the user's role
            const visibleItems = section.items.filter(
              (item) => user && item.roles.includes(user.role as Role)
            );

            // If no items in this section are visible to the user, don't render the section at all
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label} className="mb-6">
                <h3 className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {section.label}
                </h3>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3.5 px-6 py-2 transition-all duration-200 relative ${
                          isActive
                            ? "text-[#24578f] font-semibold bg-[#e0e4eb]"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#24578f] rounded-r-full" />
                          )}

                          <item.icon
                            className={`w-5 h-5 ${
                              isActive
                                ? "text-[#24578f]"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                          <span className="">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-50/50 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm mb-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#c3d7e7] to-[#a3c1da] flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-[#1e293b]">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                {ROLE_MAP[user?.role as Role] || "Guest"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-semibold text-sm">Sign out</span>
          </button>
        </div>
      </aside>

      {/*  Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
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
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}