import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  FileSpreadsheet,
  X,
  ArrowRight,
  Building2,
} from "lucide-react";
import * as XLSX from "xlsx";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";

interface Client {
  client_id: string;
  company_name: string;
}

interface UploadResult {
  job_id: number;
  client_id: number;
  status: string;
  summary: {
    new_products: number;
    removed_products: number;
    price_increase: number;
    price_decrease: number;
    description_changed: number;
  };
  next_step: string;
}

// type PreviewRow = Record<string, unknown>;

export const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async (): Promise<void> => {
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
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setPreviewData(null);
      return;
    }

    if (!selectedFile.name.endsWith(".xlsx")) {
      setError("Invalid format. Please select an Excel (.xlsx) file");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadResult(null);
    await previewExcel(selectedFile);
  };

  const previewExcel = async (file: File): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
            defval: "",
          });
      setPreviewData(jsonData.slice(0, 10));
    } catch (err) {
      console.error("Preview failed:", err);
      setPreviewData(null);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedClient) {
      setError("Please select a client to associate with these products");
      return;
    }
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<UploadResult>(
        `/cpl/${selectedClient}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setUploadResult(response.data);
      setFile(null);
      setPreviewData(null);

      
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? err?.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const getTableHeaders = (): string[] => {
    if (!previewData || previewData.length === 0) return [];
    return Object.keys(previewData[0]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className=" mx-auto">
        

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Upload Commercial Price List
          </h1>
          <p className="text-slate-500 mt-1">
            Update your commercial pricelist for comaprision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Upload Form Card */}
          <div className="bg-white rounded-4xl shadow-sm border border-slate-200 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
              <FileSpreadsheet size={120} />
            </div>

            <div className="space-y-8 relative">
              {/* Step 1: Select Client */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#3399cc] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Select Client
                  </label>
                </div>

                {loadingClients ? (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-[#24578f]" />
                    <span className="text-slate-500 text-sm font-medium">
                      Fetching approved clients...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all text-slate-900 appearance-none font-medium"
                    >
                      <option value="">-- Choose an approved client --</option>
                      {clients.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </div>
                )}
              </div>

              {/* Step 2: File Dropzone */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#3399cc] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Upload Spreadsheet
                  </label>
                </div>

                {!file ? (
                  <label className="group flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-200 rounded-4xl cursor-pointer hover:border-[#3399cc] hover:bg-blue-50/30 transition-all bg-slate-50/50">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-[#3399cc]" />
                      </div>
                      <p className="text-base font-bold text-slate-700 mb-1">
                        Click to browse and upload
                      </p>
                      <p className="text-sm text-slate-400">
                        Microsoft Excel (.xlsx) files only
                      </p>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#3399cc] rounded-xl flex items-center justify-center text-white">
                        <FileSpreadsheet size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-50 md:max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB • Ready to upload
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreviewData(null);
                      }}
                      className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleUpload}
                  disabled={loading || !file || !selectedClient}
                  className="w-full bg-[#3399cc] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#2b82ad] disabled:opacity-40 disabled:grayscale shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload size={20} /> Start Pricelist Upload{" "}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {uploadResult && (
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-300">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-emerald-800 w-full">
                    <p className="font-black text-base uppercase tracking-tight">
                      Upload Successful (Job #{uploadResult.job_id})
                    </p>

                    {/* CHANGE 2: Updated to display the new summary categories */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 font-medium opacity-90">
                      <div className="bg-white/50 p-2 rounded-lg">
                        New:{" "}
                        <strong>{uploadResult.summary.new_products}</strong>
                      </div>
                      <div className="bg-white/50 p-2 rounded-lg">
                        Removed:{" "}
                        <strong>{uploadResult.summary.removed_products}</strong>
                      </div>
                      <div className="bg-white/50 p-2 rounded-lg">
                        Price Inc:{" "}
                        <strong>{uploadResult.summary.price_increase}</strong>
                      </div>
                      <div className="bg-white/50 p-2 rounded-lg">
                        Price Dec:{" "}
                        <strong>{uploadResult.summary.price_decrease}</strong>
                      </div>
                      <div className="bg-white/50 p-2 rounded-lg">
                        Desc Mod:{" "}
                        <strong>
                          {uploadResult.summary.description_changed}
                        </strong>
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Next Step: {uploadResult.next_step}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Table Section */}
          {previewData && previewData.length > 0 && (
            <div className="bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                  Data Preview (First 10 Rows)
                </h2>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">
                  Read Only
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white">
                      {getTableHeaders().map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {previewData.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {getTableHeaders().map((header) => (
                          <td
                            key={header}
                            className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap"
                          >
                            {row[header] != null ? String(row[header]) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChevronDownIcon = () => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
