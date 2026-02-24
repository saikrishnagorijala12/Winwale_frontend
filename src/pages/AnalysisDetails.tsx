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
      } catch (error) {
        console.error("Failed to fetch job:", error);
        toast.error("Failed to load analysis details");
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

  if (isFetchingJob && !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isFetchingJob && !job) {
    return (
      <div className="py-20 text-center text-slate-500 font-bold">
        Analysis not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Analysis Details
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            {jobId
              ? `Review the analysis results of ANAL-JOB-${jobId}`
              : "Please select an analysis from the History page"}
          </p>
        </div>
        {job && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm bg-white p-6 rounded-3xl border border-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Client
                </p>
                <p className="font-bold text-slate-700">
                  {job.client || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Contract
                </p>
                <p className="font-bold text-slate-700">
                  {job.contract_number || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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
        onExport={async () => {
          try {
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
            });
            downloadBlob(blob, fileName);
            toast.success("Analysis export complete");
          } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export analysis");
          }
        }}
      />

      <div className="flex items-center justify-between ">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={() => navigate(`/documents?job_id=${jobId}`)} className="btn-primary">
          Generate Documents <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
