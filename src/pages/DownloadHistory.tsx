import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
  FilePieChart,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Pagination from "../components/shared/Pagination";

const mockDownloadHistory = [
  {
    id: "DOC-2024-101",
    analysisId: "ANL-2024-001",
    fileName: "Acme_Corp_Price_Analysis_Q4.pdf",
    client: "Acme Corp",
    type: "PDF",
    size: "2.4 MB",
    date: new Date("2024-12-18T14:30:00"),
    status: "Ready",
  },
  {
    id: "DOC-2024-102",
    analysisId: "ANL-2024-001",
    fileName: "Acme_Contract_Mod_Data.xlsx",
    client: "Acme Corp",
    type: "Excel",
    size: "1.1 MB",
    date: new Date("2024-12-18T14:35:00"),
    status: "Ready",
  },
  {
    id: "DOC-2024-103",
    analysisId: "ANL-2024-002",
    fileName: "TechVentures_Comparison_Report.pdf",
    client: "TechVentures Inc",
    type: "PDF",
    size: "3.8 MB",
    date: new Date("2024-12-17T09:15:00"),
    status: "Ready",
  },
  {
    id: "DOC-2024-104",
    analysisId: "ANL-2024-003",
    fileName: "Global_Solutions_Full_Export.csv",
    client: "Global Solutions",
    type: "CSV",
    size: "856 KB",
    date: new Date("2024-12-16T16:45:00"),
    status: "Expired",
  },
];

const fileTypeStyles = {
  PDF: "bg-rose-50 text-rose-600 border-rose-100",
  Excel: "bg-emerald-50 text-emerald-600 border-emerald-100",
  CSV: "bg-blue-50 text-blue-600 border-blue-100",
};

export default function DownloadHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [downloads, setDownloads] = useState(mockDownloadHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDownload = (fileName) => {
    toast.success(`Downloading ${fileName}...`);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredDownloads = downloads.filter(
    (doc) =>
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.analysisId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = filteredDownloads.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDownloads = filteredDownloads.slice(
    startIndex,
    startIndex + itemsPerPage,
  );


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Download History
            </h1>
            <p className="text-slate-500 font-medium">
              Access and manage your generated reports and exports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white/80  border border-white shadow-sm rounded-3xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by file name, client, or analysis ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white/80  border border-white shadow-sm rounded-4xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Document Info
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Analysis ID
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Date Generated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDownloads.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-xl border ${fileTypeStyles[doc.type] || "bg-slate-50"}`}
                      >
                        {doc.type === "Excel" || doc.type === "CSV" ? (
                          <FileSpreadsheet className="w-5 h-5" />
                        ) : (
                          <FilePieChart className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doc.fileName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-medium">{doc.size}</span>
                          <span>•</span>
                          <span>{doc.client}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {doc.analysisId}
                    </span>
                  </td>
                  <td className="p-5 text-sm text-slate-600">
                    {formatDate(doc.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            label="documents"
          />
        </div>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in">
              <div className="flex items-center gap-3">
                <Trash2 className="w-6 h-6 text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Clear download history?
                </h2>
              </div>

              <p className="text-sm text-slate-600">
                This action will permanently delete all generated document
                history. This cannot be undone.
              </p>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setDownloads([]);
                    setShowConfirm(false);
                    toast.success("Download history cleared");
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredDownloads.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No documents found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
