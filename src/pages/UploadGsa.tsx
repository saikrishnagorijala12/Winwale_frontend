import React, { useEffect, useState, ChangeEvent } from "react";
import { useFileDrop } from "../hooks/useFileDrop";
import {
  Upload,
  AlertCircle,
  Loader2,
  ChevronLeft,
  FileSpreadsheet,
  X,
  ArrowRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { ClientDropdown } from "../components/shared/ClientDropdown";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { toast } from "sonner";

interface Client {
  client_id: number;
  company_name: string;
  contract_number?: string | null;
}

interface UploadResult {
  status_code: number;
  inserted: number;
  updated: number;
  reactivated: number;
  deleted: number;
  skipped: number;
}

type PreviewRow = Record<string, unknown>;

const UploadGsa: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);


  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async (): Promise<void> => {
    try {
      setLoadingClients(true);
      const response = await api.get<Client[]>("clients/approved");
      setClients(response.data);
    } catch {
      toast.error("Failed to load approved clients");
    } finally {
      setLoadingClients(false);
    }
  };

  const processFile = async (selectedFile: File): Promise<void> => {
    setFile(selectedFile);
    setError(null);
    await previewExcel(selectedFile);
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
    await processFile(selectedFile);
  };

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useFileDrop({
      onFileDrop: processFile,
      onInvalidFile: (reason) => setError(reason),
    });

  const previewExcel = async (file: File): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const productsSheetName = workbook.SheetNames.find(
        (name) => name.trim().toUpperCase() === "PRODUCTS"
      );
      if (!productsSheetName) {
        setPreviewData(null);
        setError("No 'PRODUCTS' tab found in the uploaded file.");
        return;
      }
      const sheet = workbook.Sheets[productsSheetName];
      const jsonData = XLSX.utils.sheet_to_json<PreviewRow>(sheet);
      setPreviewData(jsonData.slice(0, 10));
    } catch (err) {
      console.error("Preview failed:", err);
      setPreviewData(null);
    }
  };

  const handleUploadClick = () => {
    if (selectedClient === 0) {
      setError("Please select a client to associate with these products");
      return;
    }
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    setError(null);
    setIsConfirmOpen(true);
  };

  const confirmUpload = async (): Promise<void> => {

    if (selectedClient === 0) {
      setError("Please select a client to associate with these products");
      return;
    }
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<UploadResult>(
        `/upload/${selectedClient}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const { inserted, updated, reactivated, deleted, skipped } = response.data;
      toast.success(
        `Upload successful! ${inserted} inserted, ${updated} updated, ${reactivated} reactivated, ${deleted} deleted, ${skipped} skipped. Redirecting...`
      );
      setFile(null);
      setPreviewData(null);

      setTimeout(() => {
        navigate("/gsa-products");
      }, 2500);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };


  const getTableHeaders = (): string[] => {
    if (!previewData || previewData.length === 0) return [];
    return Object.keys(previewData[0]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmUpload}
        title="Confirm GSA Product Upload"
        message={
          <>
            Are you sure you want to upload the product catalog for{" "}
            <span className="font-bold text-slate-800">
              {clients.find((c) => c.client_id === selectedClient)?.company_name}
            </span>
            ?
          </>
        }
        details={[
          {
            label: "Client",
            value:
              clients.find((c) => c.client_id === selectedClient)
                ?.company_name || "",
          },
          { label: "File", value: file?.name || "" },
          { label: "Size", value: `${((file?.size || 0) / 1024).toFixed(1)} KB` },
        ]}
        warning={{
          message:
            "This action will update the product catalog for the selected client. Existing products may be updated or replaced.",
          type: "amber",
        }}
        confirmText="Yes, Upload Catalog"
        cancelText="Cancel"
        isSubmitting={loading}
        variant="emerald"
      />
      <div className=" mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Upload GSA Products Catalog
          </h1>
          <p className="text-slate-500 mt-1">
            Update your product catalog by uploading an Excel spreadsheet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-4xl shadow-sm border border-slate-200 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
              <FileSpreadsheet size={120} />
            </div>

            <div className="space-y-8 relative">
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
                  <ClientDropdown
                    clients={clients}
                    selectedClient={selectedClient}
                    onClientSelect={setSelectedClient}
                  />
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
                  <label
                    className={`group flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-4xl cursor-pointer transition-all ${isDragging
                      ? "border-[#3399cc] bg-blue-50/60 scale-[1.01]"
                      : "border-slate-200 bg-slate-50/50 hover:border-[#3399cc] hover:bg-blue-50/30"
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className={`w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 transition-transform ${isDragging ? "scale-110" : "group-hover:scale-110"
                        }`}>
                        <Upload className={`w-8 h-8 ${isDragging ? "text-[#2b82ad]" : "text-[#3399cc]"}`} />
                      </div>
                      <p className="text-base font-bold text-slate-700 mb-1">
                        {isDragging ? "Drop your file here" : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-sm text-slate-400">
                        Excel (.xlsx or .xls) files only
                      </p>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      accept=".xlsx,.xls"
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
                  onClick={handleUploadClick}

                  disabled={loading || !file || selectedClient === 0 || !previewData?.length}
                  className="w-full bg-[#3399cc] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#2b82ad] disabled:opacity-40 disabled:grayscale shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload size={20} /> Start Product Import{" "}
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
                  <tbody className="divide-y divide-slate-100">
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

export default UploadGsa;
