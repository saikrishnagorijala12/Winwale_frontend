import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  User,
  FileText,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  exportPriceModifications,
  fetchAnalysisJobById,
} from "../services/analysisService";
import { AnalysisJob } from "../types/analysis.types";
import { AnalysisResultsViewer } from "../components/analysis/AnalysisResultsViewer";
import StatusBadge from "../components/shared/StatusBadge";
import { toast } from "sonner";
import { downloadBlob } from "../utils/downloadUtils";
import { processModifications } from "../utils/analysisUtils";

export default function AnalysisDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("id");

  const [job, setJob] = useState<AnalysisJob | null>(null);
  const [isFetchingJob, setIsFetchingJob] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("NEW_PRODUCT");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setIsFetchingJob(false);
        return;
      }
      try {
        setIsFetchingJob(true);
        const data = await fetchAnalysisJobById(Number(jobId), {
          page: currentPage,
          page_size: itemsPerPage,
          action_type: activeTab,
        });
        const jobData: AnalysisJob = {
          ...data,
          summary: processModifications(data.action_summary),
        };
        setJob(jobData);
      } catch (error: any) {
        if (error?.status !== 404) {
          toast.error("Failed to load analysis details");
        }
      } finally {
        setIsFetchingJob(false);
      }
    };

    fetchJob();
  }, [jobId, currentPage, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // if (isFetchingJob && !job) {
  //   return (
  //     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24548F]"></div>
  //     </div>
  //   );
  // }

  if (!isFetchingJob && !job) {
    return (
      <div className="py-20 text-center text-slate-500 font-bold">
        Analysis not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              Analysis Details
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            {jobId
              ? `Reviewing results for ANAL-JOB-${jobId}`
              : "Please select an analysis from history"}
          </p>
        </div>

        {job && (
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm ring-1 ring-slate-200/50">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-100 last:border-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                <User size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Client
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {job.client || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-100 last:border-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                <FileText size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Contract
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {job.contract_number || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <AnalysisResultsViewer
          actions={job?.modifications_actions || []}
          actionSummary={job?.action_summary || {}}
          totalActions={job?.total_actions || 0}
          totalPages={job?.total_pages || 0}
          currentPage={currentPage}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPageChange={handlePageChange}
          isLoading={isFetchingJob}
          isExporting={isExporting}
          onExport={async (selectedTypes) => {
            try {
              setIsExporting(true);
              const date = new Date()
                .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-");

              const clientName = job?.client?.replace(/\s+/g, "-") || "Client";
              const contract = job?.contract_number || "NoContract";
              const fileName = `${clientName}_${contract}_modifications_${date}.xlsx`;

              const blob = await exportPriceModifications({
                job_id: Number(jobId),
                types: selectedTypes,
              });
              downloadBlob(blob, fileName);
              toast.success("Analysis export complete");
            } catch (error) {
              console.error("Export failed:", error);
              toast.error("Failed to export analysis");
            } finally {
              setIsExporting(false);
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        <button
          onClick={() => navigate(`/documents?job_id=${jobId}`)}
          className="group flex items-center gap-2 px-8 py-3 bg-[#3399cc] hover:bg-[#2980b9] text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          Generate Documents
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
