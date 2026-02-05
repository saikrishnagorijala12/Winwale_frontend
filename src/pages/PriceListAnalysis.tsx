import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  FileEdit,
  FileText,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  FileSpreadsheet,
  Sparkles,
  ArrowRight,
  Loader2,
  ChevronDownIcon,
  AlertCircle,
  CheckCircle,
  X,
  Play,
  FileSearch,
  Hash,
} from "lucide-react";
import api from "../lib/axios";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { exportAnalysisToExcel } from "../utils/exportAnalysisUtils";

interface Client {
  client_id: string;
  company_name: string;
  contract_number: string;
}

const steps = [
  { id: 1, title: "Select Client", description: "Choose a client" },
  { id: 2, title: "Upload Pricelist", description: "Upload Excel file" },
  { id: 3, title: "Run Analysis", description: "Process data" },
  { id: 4, title: "Review Results", description: "Review and export" },
];

export default function PriceListAnalysis() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("additions");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isFetchingJob, setIsFetchingJob] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await api.get<Client[]>("clients/approved");
      setClients(response.data);
    } catch {
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchJobDetails = async (jobId: number) => {
    setIsFetchingJob(true);
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJobDetails(response.data);
    } catch (err) {
      setError("Failed to fetch detailed job results.");
    } finally {
      setIsFetchingJob(false);
    }
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement> | React.MouseEvent,
  ) => {
    if (e.type === "click") {
      document.getElementById("file-upload-input")?.click();
      return;
    }
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files?.[0] ?? null;
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".xlsx")) {
      setError("Invalid format. Please select an Excel (.xlsx) file");
      return;
    }

    setFile(selectedFile);
    setUploadedFileName(selectedFile.name);
    setError(null);

    const arrayBuffer = await selectedFile.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    setTotalRows(jsonData.length);
    setPreviewData(jsonData);
  };

  const handleRunAnalysis = async () => {
    if (!file || !selectedClient) {
      setError("Missing file or client selection");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(`/cpl/${selectedClient}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadResult(response.data);
      await fetchJobDetails(response.data.job_id);
      setIsAnalyzing(false);
    } catch (err: any) {
      setIsAnalyzing(false);
      setError(
        err?.response?.data?.detail ?? "Analysis failed. Please try again.",
      );
    }
  };

  const getCategorizedActions = () => {
    const actions = jobDetails?.modifications_actions || [];
    return {
      additions: actions.filter(
        (a: any) =>
          a.action_type === "NEW_PRODUCT" || a.action_type === "ADD_PRODUCT",
      ),
      deletions: actions.filter(
        (a: any) => a.action_type === "REMOVED_PRODUCT",
      ),
      priceIncreases: actions.filter(
        (a: any) => a.action_type === "PRICE_INCREASE",
      ),
      priceDecreases: actions.filter(
        (a: any) => a.action_type === "PRICE_DECREASE",
      ),
      descriptionChanges: actions.filter(
        (a: any) => a.action_type === "DESCRIPTION_CHANGE",
      ),
    };
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedClient("");
    setFile(null);
    setUploadedFileName("");
    setUploadResult(null);
    setJobDetails(null);
    setPreviewData(null);
    setTotalRows(0);
    setError(null);
    setActiveTab("additions");
    setCurrentPage(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
                  <Building2 className="w-5 h-5 text-[#3399cc]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                  Select Client
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Choose the client for analysis
              </p>
            </div>
            <div className="p-8 space-y-8">
              <div className="relative group/select">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <select
                  value={selectedClient}
                  onChange={(e) => {
                    setSelectedClient(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:border-[#3399cc] outline-none appearance-none font-medium cursor-pointer"
                >
                  <option value="">-- Choose an approved client --</option>
                  {clients.map((c) => (
                    <option key={c.client_id} value={c.client_id}>
                      {c.company_name} ({c.contract_number || "No Contract"})
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setCurrentStep(2);
                    setError(null);
                  }}
                  disabled={!selectedClient}
                  className="btn-primary"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
                  <FileSpreadsheet className="w-5 h-5 text-[#3399cc]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Upload Commercial Pricelist
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Upload the updated commercial pricelist (Excel format)
              </p>
            </div>

            <div className="p-6 space-y-6">
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                accept=".xlsx"
                onChange={handleFileChange}
              />
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                  file
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 hover:border-[#3399cc] hover:bg-cyan-50/50"
                }`}
                onClick={handleFileChange}
              >
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {uploadedFileName}
                      </p>
                      <p className="text-sm text-slate-500">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-[#3399cc]" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        Click to browse and upload
                      </p>
                      <p className="text-sm text-slate-500">
                        Excel files (.xlsx)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {previewData && (
                <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Data Preview ({totalRows} rows)
                    </span>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreviewData(null);
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-100 overflow-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-100 border-b border-slate-200">
                          {Object.keys(previewData[0]).map((h) => (
                            <th
                              key={h}
                              className="px-4 py-2 font-bold text-slate-700 whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr
                            key={i}
                            className="bg-white hover:bg-slate-50 border-b border-slate-50 transition-colors"
                          >
                            {Object.values(row).map((val: any, j) => (
                              <td
                                key={j}
                                className="px-4 py-2 text-slate-600 whitespace-nowrap"
                              >
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFile(null);
                    setPreviewData(null);
                    setError(null);
                  }}
                  className="h-11 flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    setError(null);
                  }}
                  disabled={!file}
                  className="btn-primary"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        const activeClient = clients.find(
          (c) => String(c.client_id) === String(selectedClient),
        );
        return (
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
                  <Sparkles className="w-5 h-5 text-[#3399cc]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Run Analysis
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Compare uploaded data with GSA contract data
              </p>
            </div>

            <div className="p-6 space-y-6">
              {!uploadResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Building2 className="w-5 h-5 text-[#3399cc]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Client Name
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {activeClient?.company_name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <FileSearch className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Contract Number
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {activeClient?.contract_number || "No Contract"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        File Name
                      </p>
                      <p className="text-sm font-semibold text-slate-700 max-w-70">
                        {uploadedFileName}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Hash className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Total Rows
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {totalRows.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 px-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">
                      Analysis Complete (Analysis #{uploadResult.job_id})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      label="Additions"
                      value={uploadResult.summary.new_products}
                      icon={<Plus className="w-4 h-4" />}
                      variant="emerald"
                    />
                    <StatCard
                      label="Deletions"
                      value={uploadResult.summary.removed_products}
                      icon={<Minus className="w-4 h-4" />}
                      variant="red"
                    />
                    <StatCard
                      label="Increases"
                      value={uploadResult.summary.price_increase}
                      icon={<TrendingUp className="w-4 h-4" />}
                      variant="amber"
                    />
                    <StatCard
                      label="Decreases"
                      value={uploadResult.summary.price_decrease}
                      icon={<TrendingDown className="w-4 h-4" />}
                      variant="cyan"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => {
                    setCurrentStep(2);
                    setUploadResult(null);
                    setError(null);
                  }}
                  disabled={isAnalyzing}
                  className="h-11 flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {!uploadResult ? (
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="btn-primary"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />{" "}
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Run Analysis
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentStep(4);
                      setError(null);
                    }}
                    className="btn-primary"
                  >
                    Review Details <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        if (isFetchingJob)
          return (
            <div className="py-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#3399cc]" />
              <p className="mt-4 text-slate-500">
                Fetching modification details...
              </p>
            </div>
          );

        const categorized = getCategorizedActions();
        const activeActions =
          categorized[activeTab as keyof typeof categorized] || [];

        // Pagination logic
        const totalItems = activeActions.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedActions = activeActions.slice(
          startIndex,
          startIndex + itemsPerPage,
        );

        const getPageNumbers = (totalPages: number) => {
          const pages: (number | "...")[] = [];

          if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
              pages.push(i);
            }
            return pages;
          }

          pages.push(1);

          if (currentPage > 4) {
            pages.push("...");
          }

          const start = Math.max(2, currentPage - 1);
          const end = Math.min(totalPages - 1, currentPage + 1);

          for (let i = start; i <= end; i++) {
            pages.push(i);
          }

          if (currentPage < totalPages - 3) {
            pages.push("...");
          }

          pages.push(totalPages);

          return pages;
        };

        const tabs = [
          {
            id: "additions",
            label: "Additions",
            icon: Plus,
            variant: "emerald" as const,
            count: categorized.additions.length,
          },
          {
            id: "deletions",
            label: "Deletions",
            icon: Minus,
            variant: "red" as const,
            count: categorized.deletions.length,
          },
          {
            id: "priceIncreases",
            label: "Increases",
            icon: TrendingUp,
            variant: "amber" as const,
            count: categorized.priceIncreases.length,
          },
          {
            id: "priceDecreases",
            label: "Decreases",
            icon: TrendingDown,
            variant: "cyan" as const,
            count: categorized.priceDecreases.length,
          },
          {
            id: "descriptionChanges",
            label: "Descriptions",
            icon: FileEdit,
            variant: "blue" as const,
            count: categorized.descriptionChanges.length,
          },
        ];

        const isDescChange = activeTab === "descriptionChanges";
        const isPriceChange =
          activeTab === "priceIncreases" || activeTab === "priceDecreases";
        const isAddOrDelete =
          activeTab === "additions" || activeTab === "deletions";

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {tabs.map((tab) => (
                <StatCard
                  key={tab.id}
                  label={tab.label}
                  value={tab.count}
                  icon={<tab.icon className="w-4 h-4" />}
                  variant={tab.variant}
                />
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Analysis Results
                </h3>

                <button
                  onClick={() =>
                    exportAnalysisToExcel(uploadResult.job_id, categorized)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-all"
                >
                  <Download size={16} /> Export All
                </button>
              </div>

              {/* Tab Bar */}
              <div className="px-6 pt-4">
                <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center w-full ">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setCurrentPage(1);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
                         ${
                           activeTab === tab.id
                             ? "bg-white text-slate-900 shadow-sm"
                             : "text-slate-500 hover:text-slate-700"
                         }`}
                    >
                      <tab.icon
                        size={14}
                        className={
                          activeTab === tab.id ? `text-${tab.variant}-600` : ""
                        }
                      />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm table-fixed">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="text-left p-3 font-bold text-slate-700">
                          Part Number
                        </th>
                        <th className="text-left p-3 font-bold text-slate-700">
                          Product Name
                        </th>

                        {isDescChange && (
                          <>
                            <th className="text-left p-3 font-bold text-slate-700">
                              Old Description
                            </th>
                            <th className="text-left p-3 font-bold text-slate-700">
                              New Description
                            </th>
                          </>
                        )}

                        {isPriceChange && (
                          <>
                            <th className="text-right p-3 font-bold text-slate-700">
                              Old Price
                            </th>
                            <th className="text-right p-3 font-bold text-slate-700">
                              New Price
                            </th>
                          </>
                        )}

                        {isAddOrDelete && (
                          <>
                            <th className="text-left p-3 font-bold text-slate-700">
                              Description
                            </th>
                            <th className="text-right p-3 font-bold text-slate-700">
                              Price
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedActions.map((action: any, i: number) => (
                        <tr
                          key={i}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3 font-mono text-xs text-slate-500">
                            {action.manufacturer_part_number || "N/A"}
                          </td>
                          <td className="p-3 font-medium text-slate-900">
                            {action.product_name || "Unknown Product"}
                          </td>

                          {isDescChange && (
                            <>
                              <td className="p-3 text-xs text-slate-400 truncate max-w-60">
                                {action.old_description || "-"}
                              </td>
                              <td className="p-3 text-xs text-slate-700">
                                {action.new_description || "-"}
                              </td>
                            </>
                          )}

                          {isPriceChange && (
                            <>
                              <td className="p-3 text-right text-slate-400 tabular-nums">
                                {action.old_price
                                  ? `$${Number(action.old_price).toLocaleString()}`
                                  : "-"}
                              </td>
                              <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                                {action.new_price
                                  ? `$${Number(action.new_price).toLocaleString()}`
                                  : "-"}
                              </td>
                            </>
                          )}

                          {isAddOrDelete && (
                            <>
                              <td className="p-3 text-xs text-slate-700 truncate max-w-60">
                                {action.description ||
                                  action.new_description ||
                                  "-"}
                              </td>
                              <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                                {(action.price ?? action.new_price)
                                  ? `$${Number(
                                      action.price ?? action.new_price,
                                    ).toLocaleString()}`
                                  : "-"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {activeActions.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-10 text-center text-slate-400 italic"
                          >
                            No modifications found for this category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalItems > itemsPerPage && (
                <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-500 font-medium">
                    Showing{" "}
                    <span className="text-slate-900 font-semibold">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-slate-900 font-semibold">
                      {Math.min(startIndex + itemsPerPage, totalItems)}
                    </span>{" "}
                    of{" "}
                    <span className="text-slate-900 font-semibold">
                      {totalItems}
                    </span>{" "}
                    results
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
                      {getPageNumbers(totalPages).map((page, idx) =>
                        page === "..." ? (
                          <span
                            key={idx}
                            className="min-w-9 h-9 flex items-center justify-center text-slate-400 font-bold"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
        ${
          currentPage === page
            ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                Start New Analysis
              </button>
              <button className="btn-primary">
                Generate All Documents <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Price List Analysis
        </h1>
        <p className="text-slate-500 font-medium">
          Compare commercial pricelists with GSA contract data
        </p>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white shadow-sm overflow-x-auto">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center shrink-0">
            <div
              className={`h-10 px-4 flex items-center gap-3 rounded-3xl transition-all ${
                currentStep === step.id
                  ? "bg-[#3399cc] text-white shadow-lg"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  currentStep === step.id
                    ? "border-white/30"
                    : "border-slate-200"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-3 h-3" />
                ) : (
                  step.id
                )}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest hidden sm:block">
                {step.title}
              </p>
            </div>
            {step.id < 4 && <div className="w-4 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="w-full">{renderStepContent()}</div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  icon,
  variant = "blue",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "emerald" | "red" | "amber" | "cyan" | "blue";
}) => {
  const themes = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      iconBg: "bg-emerald-100/50",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-100",
      iconBg: "bg-red-100/50",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      iconBg: "bg-amber-100/50",
    },
    cyan: {
      bg: "bg-cyan-50",
      text: "text-[#3399cc]",
      border: "border-cyan-100",
      iconBg: "bg-cyan-100/50",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      iconBg: "bg-blue-100/50",
    },
  };
  const theme = themes[variant];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center ${theme.text}`}
        >
          {React.cloneElement(icon as React.ReactElement, { size: 20 } as any)}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
            {value.toLocaleString()}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};
