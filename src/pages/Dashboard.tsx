import React from 'react';
import {
  FileSearch,
  Users,
  TrendingUp,
  Clock,
  FileText,
  AlertCircle,
  BarChart3,
  ChevronRight,
  PlusCircle,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const colors = {
    bg: "#f5f7f9",
    fg: "#1b2531",
    primary: "#24548f",
    muted: "#627383",
    border: "#d9e0e8",
    success: "#33b17d",
    warning: "#f9ab20",
    destructive: "#df3a3a",
    secondaryBg: "#f8fafc"
  };

  const stats = [
    { label: 'Active Clients', value: '24', change: '+3 this month', trend: 'up', icon: Users },
    { label: 'Analyses Completed', value: '156', change: '+12 this week', trend: 'up', icon: FileSearch },
    { label: 'Pending Reviews', value: '8', change: '2 urgent', trend: 'warning', icon: Clock },
    { label: 'Success Rate', value: '98.5%', change: '+0.5%', trend: 'up', icon: TrendingUp },
  ];

  const recentAnalyses = [
    { id: '1', client: 'Acme Corp', contract: 'GS-35F-0001Y', status: 'Completed', add: 45, del: 12 },
    { id: '2', client: 'TechVentures Inc', contract: 'GS-07F-0123X', status: 'Completed', add: 23, del: 5 },
    { id: '3', client: 'Global Solutions', contract: 'GS-00F-0456Z', status: 'Pending', add: 67, del: 34 },
    { id: '4', client: 'Premier Services', contract: 'GS-10F-0789W', status: 'Completed', add: 12, del: 8 },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10  animate-fade-in" style={{ backgroundColor: colors.bg }}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: colors.fg }}>
            Welcome, {user?.name?.split(' ')[0] || 'Sarah'}
          </h1>
          <p className="font-medium" style={{ color: colors.muted }}>
            Overview of your current GSA contract performance.
          </p>
        </div>
        <button
          onClick={() => navigate('/pricelist-analysis')}
          className="btn-primary"

        >
          <FileSearch className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 h-40 flex flex-col justify-between rounded-2xl transition-all hover:shadow-lg " >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: colors.muted }}>
                {stat.label}
              </span>
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: colors.secondaryBg }}>
                <stat.icon className="w-5 h-5" style={{ color: colors.fg }} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tighter mb-1" style={{ color: colors.fg }}>
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: stat.trend === 'up' ? colors.success : colors.warning }}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left: Recent Analyses */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl animate-slide-up shadow-sm " >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: colors.fg }}>Recent Analyses</h2>
              <p className="text-sm font-medium" style={{ color: colors.muted }}>Latest price modifications tracked</p>
            </div>
            <button className="text-sm font-bold transition-colors" style={{ color: colors.muted }}>
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentAnalyses.map((item) => (
              <div key={item.id} className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:shadow-sm transition-all cursor-pointer" style={{ backgroundColor: `${colors.bg}80` }}>
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform" style={{ borderColor: colors.border }}>
                  <FileText className="w-5 h-5" style={{ color: colors.primary }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate" style={{ color: colors.fg }}>{item.client}</h4>
                  <p className="text-xs font-bold" style={{ color: colors.muted }}>{item.contract}</p>
                </div>

                <div className="hidden sm:flex items-center gap-6 px-4">
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase" style={{ color: colors.muted }}>Add</p>
                    <p className="text-sm font-black" style={{ color: colors.success }}>+{item.add}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase" style={{ color: colors.muted }}>Del</p>
                    <p className="text-sm font-black" style={{ color: colors.destructive }}>-{item.del}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{
                      backgroundColor: item.status === 'Completed' ? `${colors.success}1A` : `${colors.warning}1A`,
                      color: item.status === 'Completed' ? colors.success : colors.warning
                    }}>
                    {item.status}
                  </span>
                  <ChevronRight className="w-4 h-4 transition-colors" style={{ color: colors.border }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8 animate-slide-in-right">

          {/* Quick Actions Card */}
          <div className="rounded-4xl p-8 shadow-xl text-white" style={{ backgroundColor: colors.primary }}>
            <h2 className="text-xl font-bold mb-1">Quick Actions</h2>
            <p className="text-xs font-medium mb-6 opacity-70">Execute common tasks</p>

            <div className="space-y-3">
              {[
                { label: 'New Analysis', icon: PlusCircle, to: '/pricelist-analysis' },
                { label: 'Add Client', icon: UserPlus, to: '/clients' },
                { label: 'View Reports', icon: BarChart3, to: '/dashboard' }
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all group font-bold text-sm text-left border border-white/10 bg-white/10 hover:bg-white hover:text-slate-900"
                >
                  <div className="p-1.5 rounded-lg bg-white/10">
                    <action.icon className="w-4 h-4" />
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contract Status List */}
          <div className="bg-white p-8 rounded-2xl shadow-sm ">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: colors.muted }}>
              Clients Status
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Active', val: '24', color: colors.success },
                { label: 'Pending', val: '05', color: colors.warning },
                { label: 'Rejected', val: '02', color: colors.destructive }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold" style={{ color: colors.fg }}>{item.label}</span>
                  </div>
                  <span className="text-sm font-black" style={{ color: colors.fg }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// import React from "react";
// import {
//   Users,
//   ShieldCheck,
//   Package,
//   UploadCloud,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   UserPlus,
//   Building2,
//   FileSpreadsheet,
//   ChevronRight,
//   ShieldAlert,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const colors = {
//     bg: "#f5f7f9",
//     fg: "#1b2531",
//     muted: "#627383",
//     border: "#d9e0e8",
//     success: "#33b17d",
//     warning: "#f9ab20",
//     destructive: "#df3a3a",
//     secondaryBg: "#f8fafc",
//   };

//   const stats = [
//     {
//       label: "Pending Approvals",
//       value: "14",
//       change: "5 users, 9 clients",
//       trend: "warning",
//       icon: ShieldAlert,
//     },
//     {
//       label: "Total Active Users",
//       value: "182",
//       change: "+12 this month",
//       trend: "up",
//       icon: Users,
//     },
//     {
//       label: "GSA Products",
//       value: "12.4k",
//       change: "Last update: 2d ago",
//       trend: "up",
//       icon: Package,
//     },
//     {
//       label: "System Status",
//       value: "Optimal",
//       change: "All services live",
//       trend: "up",
//       icon: ShieldCheck,
//     },
//   ];

//   const pendingQueue = [
//     {
//       id: "1",
//       name: "James Wilson",
//       type: "User Request",
//       detail: "Senior Consultant",
//       date: "10m ago",
//     },
//     {
//       id: "2",
//       name: "Global Logistics Inc",
//       type: "Client Profile",
//       detail: "New GSA Schedule",
//       date: "1h ago",
//     },
//     {
//       id: "3",
//       name: "Enterprise Solutions",
//       type: "Client Profile",
//       detail: "Profile Update",
//       date: "3h ago",
//     },
//     {
//       id: "4",
//       name: "Sarah Chen",
//       type: "User Request",
//       detail: "Junior Analyst",
//       date: "Yesterday",
//     },
//   ];

//   return (
//     <div
//       className="min-h-screen p-6 lg:p-10 animate-fade-in"
//       style={{ backgroundColor: colors.bg }}
//     >
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
//         <div className="space-y-1">
//           <h1
//             className="text-3xl font-extrabold tracking-tight"
//             style={{ color: colors.fg }}
//           >
//             Welcome, {user?.name?.split(" ")[0] || "Sarah"}
//           </h1>
//           <p className="font-medium" style={{ color: colors.muted }}>
//             System-wide management of users, client profiles, and GSA catalogs.
//           </p>
//         </div>
//         <button
//           className="btn-primary"
//         >
//           <UploadCloud className="w-4 h-4" />
//           Bulk Upload GSA Data
//         </button>
//       </div>

//       {/* Admin Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="bg-white p-6 h-40 flex flex-col justify-between rounded-2xl transition-all hover:shadow-lg shadow-sm"
//           >
//             <div className="flex justify-between items-start">
//               <span
//                 className="text-[11px] font-black uppercase tracking-widest"
//                 style={{ color: colors.muted }}
//               >
//                 {stat.label}
//               </span>
//               <div
//                 className="p-2.5 rounded-xl"
//                 style={{ backgroundColor: colors.secondaryBg }}
//               >
//                 <stat.icon
//                   className="w-5 h-5 text-[#24548f]"
//                   strokeWidth={2.5}
//                 />
//               </div>
//             </div>
//             <div>
//               <div
//                 className="text-3xl font-black tracking-tighter mb-1"
//                 style={{ color: colors.fg }}
//               >
//                 {stat.value}
//               </div>
//               <div
//                 className="flex items-center gap-1.5 text-[11px] font-bold"
//                 style={{
//                   color: stat.trend === "up" ? colors.success : colors.warning,
//                 }}
//               >
//                 {stat.change}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//         {/* Left: Pending Approvals Queue */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-2xl animate-slide-up shadow-sm">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2
//                 className="text-xl font-extrabold"
//                 style={{ color: colors.fg }}
//               >
//                 Verification Queue
//               </h2>
//               <p
//                 className="text-sm font-medium"
//                 style={{ color: colors.muted }}
//               >
//                 Review requests requiring administrative action
//               </p>
//             </div>
//             <button
//               className="text-sm font-bold"
//               style={{ color: colors.muted }}
//             >
//               View Archive
//             </button>
//           </div>

//           <div className="space-y-3">
//             {pendingQueue.map((item) => (
//               <div
//                 key={item.id}
//                 className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:shadow-sm transition-all"
//                 style={{ backgroundColor: `${colors.bg}80` }}
//               >
//                 <div
//                   className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-sm"
//                   style={{ borderColor: colors.border }}
//                 >
//                   {item.type === "User Request" ? (
//                     <UserPlus
//                       className="w-5 h-5 text-[#24548f]"
//                     />
//                   ) : (
//                     <Building2
//                       className="w-5 h-5"
//                       style={{ color: colors.success }}
//                     />
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     <h4
//                       className="font-bold truncate"
//                       style={{ color: colors.fg }}
//                     >
//                       {item.name}
//                     </h4>
//                     <span
//                       className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md"
//                       style={{
//                         backgroundColor: colors.border,
//                         color: colors.muted,
//                       }}
//                     >
//                       {item.type}
//                     </span>
//                   </div>
//                   <p
//                     className="text-xs font-bold"
//                     style={{ color: colors.muted }}
//                   >
//                     {item.detail} • {item.date}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     className="p-2 rounded-xl transition-colors hover:bg-red-50"
//                     style={{ color: colors.destructive }}
//                   >
//                     <XCircle className="w-6 h-6" />
//                   </button>
//                   <button
//                     className="p-2 rounded-xl transition-colors hover:bg-green-50"
//                     style={{ color: colors.success }}
//                   >
//                     <CheckCircle2 className="w-6 h-6" />
//                   </button>
//                   <ChevronRight
//                     className="w-4 h-4 ml-2"
//                     style={{ color: colors.border }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Sidebar */}
//         <div className="space-y-8 animate-slide-in-right">
//           {/* Catalog Upload Card */}
//           <div
//             className="rounded-4xl p-8 shadow-xl text-white bg-[#24548f]"
//           >
//             <h2 className="text-xl font-bold mb-1">GSA Product Import</h2>
//             <p className="text-xs font-medium mb-6 opacity-70">
//               Update master price lists
//             </p>

//             <div className="space-y-4">
//               <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center">
//                 <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 opacity-50" />
//                 <p className="text-xs font-bold">Drop CSV/Excel file here</p>
//               </div>

//               <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl transition-all font-bold text-sm bg-white text-slate-900 hover:bg-slate-100">
//                 <UploadCloud className="w-4 h-4" />
//                 Start Processing
//               </button>
//             </div>
//           </div>

//           {/* User Management Quick Links */}
//           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-50">
//             <h3
//               className="text-xs font-black uppercase tracking-widest mb-6"
//               style={{ color: colors.muted }}
//             >
//               Admin Actions
//             </h3>
//             <div className="space-y-5">
//               {[
//                 {
//                   label: "Role Permissions",
//                   val: "Edit",
//                   color: "#24548f",
//                 },
//                 { label: "Audit Logs", val: "View", color: colors.muted },
//                 {
//                   label: "Export System Data",
//                   val: "Run",
//                   color: colors.success,
//                 },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   className="flex items-center justify-between cursor-pointer group"
//                 >
//                   <span
//                     className="text-sm font-bold group-hover:underline"
//                     style={{ color: colors.fg }}
//                   >
//                     {item.label}
//                   </span>
//                   <span
//                     className="text-[10px] font-black uppercase px-2 py-1 rounded bg-slate-100"
//                     style={{ color: item.color }}
//                   >
//                     {item.val}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
