import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
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
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [downloads, setDownloads] = useState(mockDownloadHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = (fileName) => {
    showToast(`Downloading ${fileName}...`);
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
      doc.analysisId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredDownloads.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDownloads = filteredDownloads.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast.message}
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Analysis
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
      <div className="bg-white/80  border border-white shadow-sm rounded-[24px] p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by file name, client, or analysis ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
            />
          </div>

        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white/80  border border-white shadow-sm rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Document Info</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Analysis ID</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400">Date Generated</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedDownloads.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl border ${fileTypeStyles[doc.type] || "bg-slate-50"}`}>
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
          {totalItems > itemsPerPage && (
            <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-semibold">{startIndex + 1}</span> to{" "}
                <span className="text-slate-900 font-semibold">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="text-slate-900 font-semibold">{totalItems}</span> documents
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, idx) => (
                    <React.Fragment key={idx}>
                      {pageNum === "..." ? (
                        <span className="px-2 text-slate-400 font-medium">...</span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(Number(pageNum))}
                          className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                            ${currentPage === pageNum
                              ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
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
                This action will permanently delete all generated document history.
                This cannot be undone.
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
                    showToast("Download history cleared");
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
            <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}