import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AnalysisHistoryHeader from "../components/analysis/AnalysisHistoryHeader";
import AnalysisFilters from "../components/analysis/AnalysisFilters";
import AnalysisTable from "../components/analysis/AnalysisTable";
import { processModifications } from "../utils/analysisUtils";
import {
  fetchAnalysisJobs,
  approveAnalysisJob,
  rejectAnalysisJob,
} from "../services/analysisService";
import { AnalysisJob, SortConfig, StatusFilter } from "../types/analysis.types";
import ConfirmationModal from "../components/shared/ConfirmationModal";


export default function AnalysisHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisJob[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    job: null as AnalysisJob | null,
    action: "approve" as "approve" | "reject",
  });

  const clientOptions = Array.from(
    new Set(analysisHistory.map((a) => a.client).filter(Boolean)),
  );

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalysisJobs();

      const formattedData: AnalysisJob[] = data.map((job) => ({
        ...job,
        summary: processModifications(job.action_summary),
      }));

      setAnalysisHistory(formattedData);
    } catch (error) {
      console.error("Failed to fetch analysis history:", error);
      toast.error("Failed to load analysis history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, clientFilter, dateFrom, dateTo]);

  const handleUpdateStatus = (jobId: number, action: "approve" | "reject") => {
    const job = analysisHistory.find((j) => j.job_id === jobId);
    if (!job) return;

    setConfirmModal({
      isOpen: true,
      job,
      action,
    });
  };

  const confirmUpdateStatus = async () => {
    if (!confirmModal.job) return;

    const { job, action } = confirmModal;
    const jobId = job.job_id;

    try {
      setUpdatingId(jobId);

      if (action === "approve") {
        await approveAnalysisJob(jobId);
      } else {
        await rejectAnalysisJob(jobId);
      }

      toast.success(
        `Analysis ${action === "approve" ? "approved" : "rejected"} successfully`,
      );

      setAnalysisHistory((prev) =>
        prev.map((j) =>
          j.job_id === jobId
            ? { ...j, status: action === "approve" ? "approved" : "rejected" }
            : j,
        ),
      );
      setConfirmModal({ ...confirmModal, isOpen: false });
    } catch (error: any) {
      console.error("Status update failed:", error);
      toast.error(error.response?.data?.detail || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setClientFilter("All");
    setStatusFilter("All");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleDownloadHistory = () => {
    navigate("/downloads");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-10">
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmUpdateStatus}
        title={`Confirm ${confirmModal.action === "approve" ? "Approval" : "Rejection"}`}
        message={
          <>
            Are you sure you want to {confirmModal.action}{" "}
            <span className="font-bold text-slate-700">
              ANAL-JOB-{confirmModal.job?.job_id}
            </span>
            ?
          </>
        }
        details={[
          { label: "Client", value: confirmModal.job?.client || "" },
          { label: "Contract", value: confirmModal.job?.contract_number || "" },
        ]}
        warning={{
          message:
            confirmModal.action === "approve"
              ? "This will approve the analysis and update the product catalog. This action cannot be undone."
              : "This will reject the analysis and the product catalog won’t be updated. This action cannot be undone.",
          type: confirmModal.action === "approve" ? "emerald" : "rose",
        }}
        variant={confirmModal.action === "approve" ? "emerald" : "rose"}
        confirmText={confirmModal.action === "approve" ? "Approve" : "Reject"}
        isSubmitting={updatingId === confirmModal.job?.job_id}
      />
      <AnalysisHistoryHeader onDownloadHistory={handleDownloadHistory} />

      <AnalysisFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clientFilter={clientFilter}
        setClientFilter={setClientFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        clientOptions={clientOptions}
        onClearFilters={clearFilters}
      />

      <AnalysisTable
        analysisHistory={analysisHistory}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        sortConfig={sortConfig}
        onSort={handleSort}
        statusFilter={statusFilter}
        clientFilter={clientFilter}
        searchQuery={searchQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        updatingId={updatingId}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
