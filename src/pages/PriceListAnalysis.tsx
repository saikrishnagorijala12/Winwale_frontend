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
  Hammer,
  Clock,
  Hash,
} from "lucide-react";
import api from "../lib/axios";
import * as XLSX from "xlsx";

interface Client {
  client_id: string;
  company_name: string;
  contract_number: string;
}

const steps = [
  { id: 1, title: "Select Client", description: "Choose a client" },
  { id: 2, title: "Upload Pricelist", description: "Upload Excel file" },
  { id: 3, title: "Run Analysis", description: "Feature in progress" },
];

export default function PriceListAnalysis() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await api.get<Client[]>("clients/approved");
      setClients(response.data);
    } catch {
      setError("Failed to load approved clients");
    } finally {
      setLoadingClients(false);
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
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedClient}
                  className="px-10 h-12 rounded-full bg-[#3399cc] text-white font-semibold flex items-center gap-2 disabled:opacity-40 transition-all shadow-lg"
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
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${file ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-[#3399cc] hover:bg-cyan-50/50"}`}
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
                    <div className="w-16 h-16 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Click to upload or drag and drop <br />
                        <span className="text-slate-400 text-xs">(Only Excel Files allowed)</span>
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

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData(null);
                    setCurrentStep(1);
                  }}
                  className="px-6 h-11 rounded-full border border-slate-300 text-slate-700 font-medium flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!file}
                  className="px-6 h-11 rounded-full bg-[#3399cc] text-white font-medium flex items-center gap-2 disabled:opacity-50"
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
                <div className="p-2.5 bg-amber-50 rounded-xl shadow-sm ring-1 ring-amber-100">
                  <Hammer className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Run Analysis
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Review selection and start comparison
              </p>
            </div>

            <div className="p-8 flex flex-col items-center">
              {/* Analysis Summary Grid */}
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
                    <p className="text-sm font-semibold text-slate-700 truncate max-w-50">
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

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-slate-400 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="text-lg font-bold text-slate-900">
                    Analysis Under Progress
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We are currently optimizing the comparison engine. This
                    automated analysis feature will be available shortly.
                  </p>
                </div>
              </div>

              <div className="pt-10 w-full flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 h-11 rounded-full border border-slate-300 text-slate-700 font-medium flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Upload
                </button>
                <div className="px-6 h-11 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center gap-2 cursor-not-allowed border border-slate-200">
                  <Sparkles className="w-4 h-4" /> Coming Soon
                </div>
              </div>
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
              className={`h-10 px-4 flex items-center gap-3 rounded-3xl transition-all ${currentStep === step.id ? "bg-[#3399cc] text-white shadow-lg" : "text-slate-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${currentStep === step.id ? "border-white/30" : "border-slate-200"}`}
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
            {step.id < 3 && <div className="w-4 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="w-full mx-auto">{renderStepContent()}</div>
    </div>
  );
}
