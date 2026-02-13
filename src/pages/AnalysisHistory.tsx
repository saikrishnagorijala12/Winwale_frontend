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

  const clientOptions = Array.from(
    new Set(analysisHistory.map((a) => a.client).filter(Boolean)),
  );

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalysisJobs();

      const formattedData: AnalysisJob[] = data.map((job) => ({
        ...job,
        summary: processModifications(job.modifications_actions),
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

  const handleUpdateStatus = async (
    jobId: number,
    action: "approve" | "reject",
  ) => {
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
        prev.map((job) =>
          job.job_id === jobId
            ? { ...job, status: action === "approve" ? "approved" : "rejected" }
            : job,
        ),
      );
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