import React, { useEffect, useState } from "react";
import {
  FileSearch,
  TrendingUp,
  Clock,
  FileText,
  BarChart3,
  ChevronRight,
  UserPlus,
  TrendingDown,
  FileEdit,
  Upload,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "@/src/lib/axios";
import { useAnalysis } from "../../context/AnalysisContext";
import StatusBadge from "../../components/shared/StatusBadge";
import { fetchAnalysisJobs } from "../../services/analysisService";
import { AnalysisJobResponse } from "../../types/analysis.types";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

interface Client {
  client_id: number;
  status: string;
  is_deleted: boolean;
  created_time: string;
  updated_time: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedJobId } = useAnalysis();

  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<AnalysisJobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    bg: "#f5f7f9",
    fg: "#1b2531",
    primary: "#24548f",
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
      setLoading(true);
      const [clientsRes, jobsData] = await Promise.all([
        api.get("clients"),
        fetchAnalysisJobs({ page: 1, page_size: 50 }),
      ]);

      setClients(clientsRes.data);
      setJobs(jobsData.items || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalClients = clients.length;
    const completedJobs = jobs.filter((job) => job.status === "approved").length;
    const pendingJobs = jobs.filter((job) => job.status === "pending").length;

    const totalJobsCompleted = jobs.filter((job) => job.status === "approved").length;
    const totalJobs = jobs.length;
    const successRate = totalJobs > 0
      ? ((totalJobsCompleted / (totalJobs - pendingJobs)) * 100).toFixed(1)
      : "0.0";

    return { totalClients, completedJobs, pendingJobs, successRate };
  };

  const stats_data = calculateStats();

  const stats = [
    { label: "All Clients", value: stats_data.totalClients.toString(), icon: Building2 },
    { label: "Analyses Completed", value: stats_data.completedJobs.toString(), icon: FileSearch },
    { label: "Pending Reviews", value: stats_data.pendingJobs.toString(), icon: Clock },
    { label: "Success Rate", value: `${stats_data.successRate}%`, icon: TrendingUp },
  ];

  const recentAnalyses = jobs
    .sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
    .slice(0, 5)
    .map((job) => ({
      id: job.job_id,
      client: job.client,
      contract: job.contract_number,
      status: job.status,
      add: job.action_summary?.["NEW_PRODUCT"] || 0,
      del: job.action_summary?.["REMOVED_PRODUCT"] || 0,
      incr: job.action_summary?.["PRICE_INCREASE"] || 0,
      decr: job.action_summary?.["PRICE_DECREASE"] || 0,
      desc: job.action_summary?.["DESCRIPTION_CHANGE"] || 0,
    }));

  return (
    <div
      className="min-h-screen p-6 lg:p-10 animate-fade-in"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
        <div className="space-y-1">
          {loading ? (
            <>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: colors.fg }}>
                Welcome, {user?.name?.split(" ")[0] || "Guest"}
              </h1>
              <p className="font-medium" style={{ color: colors.muted }}>
                Overview of clients and recent analyses.
              </p>
            </>
          )}
        </div>
        {!loading && (
          <button onClick={() => navigate("/pricelist-analysis")} className="btn-primary">
            <FileSearch className="w-4 h-4" />
            New Analysis
          </button>
        )}
      </div>

      {/* Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {loading
          ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl h-32 flex flex-col justify-between">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
          ))
          : stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 flex flex-col justify-between rounded-2xl transition-all hover:shadow-lg ">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: colors.muted }}>{stat.label}</span>
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: colors.secondaryBg }}>
                  <stat.icon className="w-5 h-5 text-[#24548f]" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black tracking-tighter mb-1" style={{ color: colors.fg }}>{stat.value}</div>
              </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Recent Analyses */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl animate-slide-up shadow-sm ">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: colors.fg }}>Recent Analyses</h2>
              <p className="text-sm font-medium" style={{ color: colors.muted }}>Latest price modifications tracked</p>
            </div>
            {!loading && (
              <button onClick={() => navigate("/analyses")} className="text-sm font-bold transition-colors" style={{ color: colors.muted }}>
                View all
              </button>
            )}
          </div>

          <div className="space-y-3">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-slate-50/50">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="hidden sm:flex gap-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))
            ) : (
              <>
                {recentAnalyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedJobId(item.id);
                      navigate(`/analyses/details`);
                    }}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:shadow-sm transition-all cursor-pointer"
                    style={{ backgroundColor: `${colors.bg}80` }}
                  >
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
                      <div className="text-center">
                        <p className="text-[9px] font-black uppercase" style={{ color: colors.muted }}>Incr</p>
                        <p className="flex items-center gap-1 text-amber-600 text-sm font-bold"><TrendingUp className="w-3 h-3" />{item.incr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black uppercase" style={{ color: colors.muted }}>Decr</p>
                        <p className="flex items-center gap-1 text-blue-600 text-sm font-bold"><TrendingDown className="w-3 h-3" />{item.decr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black uppercase" style={{ color: colors.muted }}>Desc</p>
                        <p className="flex items-center gap-1 text-indigo-600 text-sm font-bold"><FileEdit className="w-3 h-3" />{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} />
                      <ChevronRight className="w-4 h-4" style={{ color: colors.border }} />
                    </div>
                  </div>
                ))}
                {recentAnalyses.length === 0 && (
                  <p className="text-center py-8" style={{ color: colors.muted }}>No analyses found</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8 animate-slide-in-right">
          <div className="rounded-4xl p-8 shadow-xl text-white" style={{ backgroundColor: colors.primary }}>
            <h2 className="text-xl font-bold mb-1">Quick Actions</h2>
            <p className="text-xs font-medium mb-6 opacity-70">Perform common tasks</p>
            <div className="space-y-3">
              {[
                { label: "Add Client", icon: UserPlus, to: "/clients" },
                { label: "Upload Product Catalog", icon: Upload, to: "/gsa-products/upload" },
                { label: "View Reports", icon: BarChart3, to: "/analyses" },
              ].map((action) => (
                <button key={action.label} onClick={() => navigate(action.to)} className="w-full flex items-center gap-3 p-4 rounded-xl transition-all group font-bold text-sm text-left border border-white/10 bg-white/10 hover:bg-white hover:text-slate-900">
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
            <h3 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: colors.muted }}>Clients Overview</h3>
            <div className="space-y-5">
              {[
                { label: "Active", key: "approved", color: colors.success },
                { label: "Pending", key: "pending", color: colors.warning },
                { label: "Rejected", key: "rejected", color: colors.destructive },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold" style={{ color: colors.fg }}>{item.label}</span>
                  </div>
                  {loading ? (
                    <Skeleton className="h-4 w-6" />
                  ) : (
                    <span className="text-sm font-black" style={{ color: colors.fg }}>
                      {clients.filter((c) => c.status === item.key).length}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}