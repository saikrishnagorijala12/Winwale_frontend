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
import { Client } from "../types/pricelist.types";
import api from "../lib/axios";
import { useDebounce } from "../hooks/useDebounce";

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisJob[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    job: null as AnalysisJob | null,
    action: "approve" as "approve" | "reject",
  });

  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await api.get<Client[]>("clients/approved");
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalysisJobs({
        page: currentPage,
        page_size: itemsPerPage,
        search: debouncedSearchQuery || undefined,
        client_id: clientFilter === "All" ? undefined : clients.find(c => c.company_name === clientFilter)?.client_id,
        status: statusFilter === "All" ? undefined : statusFilter,
        date_from: dateFrom?.toISOString(),
        date_to: dateTo?.toISOString(),
      });

      const formattedData: AnalysisJob[] = data.items.map((job) => ({
        ...job,
        summary: processModifications(job.action_summary),
      }));

      setAnalysisHistory(formattedData);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch analysis history:", error);
      toast.error("Failed to load analysis history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchAnalysisHistory();
  }, [currentPage, debouncedSearchQuery, clientFilter, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, clientFilter, statusFilter, dateFrom, dateTo]);

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
      toast.error(error.message || "Failed to update status");
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
        clients={clients}
        onClearFilters={clearFilters}
        isLoading={loadingClients}
      />

      <AnalysisTable
        analysisHistory={analysisHistory}
        totalItems={totalItems}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        sortConfig={sortConfig}
        onSort={handleSort}
        updatingId={updatingId}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
