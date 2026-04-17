import React, { useEffect, useState, ChangeEvent } from "react";
import { useFileDrop } from "../hooks/useFileDrop";
import {
  Upload,
  AlertCircle,
  Loader2,
  ChevronLeft,
  FileSpreadsheet,
  Inbox,
  X,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import * as XLSX from "xlsx";
import { clientService } from "../services/clientService";
import { productService } from "../services/productService";
import { useNavigate, Link, useSearchParams, useParams, useLocation } from "react-router-dom";
import { ClientDropdown } from "../components/shared/ClientDropdown";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { toast } from "sonner";
import { useSSE } from "../hooks/useSSE";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";

const loaderStyles = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes pulseLight {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.95; transform: scale(0.98); }
  }
  @keyframes successBounce {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-scan { animation: scan 2s ease-in-out infinite; }
  .animate-progress { animation: progress 2s ease-in-out infinite; }
  .animate-pulse-light { animation: pulseLight 3s ease-in-out infinite; }
  .animate-success { animation: successBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
`;
import { ClientMinimal, UploadResult, UploadStatus, PreviewRow } from "../types/product.types";

const GSA_BASE_HEADERS = [
  "item_type", "manufacturer", "manufacturer_part_number",
  "vendor_part_number", "sin", "item_name", "item_description",
  "recycled_content_percent", "uom", "quantity_per_pack",
  "quantity_unit_uom", "commercial_price", "mfc_name", "mfc_price",
  "govt_price_no_fee", "govt_price_with_fee", "country_of_origin",
  "delivery_days", "lead_time_code", "fob_us", "fob_ak",
  "fob_hi", "fob_pr", "nsn", "upc", "unspsc",
  "sale_price_with_fee", "start_date", "stop_date",
  "default_photo", "photo_2", "photo_3", "photo_4",
  "product_url", "warranty_period", "warranty_unit_of_time",
  "length", "width", "height", "physical_uom", "weight_lbs",
  "product_info_code", "url_508", "hazmat",
  "dealer_cost", "mfc_markup_percentage",
  "govt_markup_percentage",
];

const UploadGsa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const clientIdFromParam = searchParams.get("client_id");

  // Determine if we are on a client-specific route
  const isClientRoute = location.pathname.includes("/clients/");

  const [clients, setClients] = useState<ClientMinimal[]>([]);
  const [selectedClient, setSelectedClient] = useState<number>(
    id ? parseInt(id) : clientIdFromParam ? parseInt(clientIdFromParam) : 0
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [pollError, setPollError] = useState<boolean>(false);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

  // Sync selectedClient with URL parameters
  useEffect(() => {
    const newId = id ? parseInt(id) : clientIdFromParam ? parseInt(clientIdFromParam) : 0;
    if (newId !== selectedClient) {
      setSelectedClient(newId);
    }
  }, [id, clientIdFromParam]);


  useEffect(() => {
    fetchClients();
  }, []);

  const { data: sseData, error: sseError, connect: connectSSE, disconnect: disconnectSSE } = useSSE<UploadStatus>(
    selectedClient !== 0 && loading ? `/upload/${selectedClient}/events` : null
  );

  useEffect(() => {
    if (sseData) {
      setUploadStatus(sseData);
      if (sseData.status === "completed") {
        setLoading(false);
        setShowSuccess(true);
        disconnectSSE();
      } else if (sseData.status === "failed") {
        setLoading(false);
        setError(sseData.message || "Upload failed");
        disconnectSSE();
      }
    }
  }, [sseData, disconnectSSE]);

  useEffect(() => {
    if (sseError) {
      setPollError(true);
    }
  }, [sseError]);

  // Check initial status when client changes
  useEffect(() => {
    if (selectedClient !== 0) {
      const checkInitialStatus = async () => {
        try {
          const data = await productService.getGsaUploadStatus(selectedClient);
          setUploadStatus(data);
          if (data.status === "processing") {
            setLoading(true);
            if (data.upload_id) {
              setCurrentUploadId(data.upload_id);
            }
          }
        } catch (err) {
          console.error("Initial status check failed", err);
        }
      };
      checkInitialStatus();
    }
  }, [selectedClient]);

  const fetchClients = async (): Promise<void> => {
    try {
      setLoadingClients(true);
      const data = await clientService.getApprovedClients();
      setClients(data);
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
      onFileDrop: (files) => {
        if (files.length > 0) {
          processFile(files[0]);
        }
      },
      onInvalidFile: (reason) => setError(reason),
    });

  const previewExcel = async (file: File): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const productsSheetName = workbook.SheetNames.find(
        (name) => name.trim().toUpperCase() === "PRODUCTS",
      );

      if (!productsSheetName) {
        setPreviewData(null);
        setError("No 'PRODUCTS' tab found in the uploaded file.");
        return;
      }

      const sheet = workbook.Sheets[productsSheetName];

      const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
        header: 1,
        defval: "",
        range: { s: { r: 0, c: 0 }, e: { r: 100, c: 50 } },
      });

      if (rows.length === 0) {
        setPreviewData(null);
        setError("The uploaded file is empty.");
        return;
      }

      let headerRowIndex = -1;

      for (let i = 0; i < Math.min(rows.length, 2); i++) {
        const row = rows[i];
        if (!Array.isArray(row)) continue;

        const actualHeaders = row.map((h) => String(h).trim().toLowerCase());
        const missingHeaders = GSA_BASE_HEADERS.filter(
          (h) => !actualHeaders.includes(h),
        );

        if (missingHeaders.length === 0) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        setPreviewData(null);
        setError(
          "Required headers are missing or incorrect. Please ensure your GSA headers are present.",
        );
        return;
      }

      const dataStartIndex = headerRowIndex + 1;

      const dataRows = rows.slice(dataStartIndex);
      const hasData = dataRows.some((row) =>
        row.some((cell) => cell !== null && String(cell).trim() !== ""),
      );

      if (!hasData) {
        setPreviewData(null);
        setError(
          "The file contains headers but no product data was found.",
        );
        return;
      }

      const headers = rows[headerRowIndex] as any[];
      const jsonData = dataRows.slice(0, 10).map((row) => {
        const obj: PreviewRow = {};
        headers.forEach((header, index) => {
          const key = String(header || `Column ${index + 1}`).trim();
          obj[key] = row[index] !== undefined ? row[index] : "";
        });
        return obj;
      });
      setPreviewData(jsonData);
    } catch (err) {
      console.error("Preview failed:", err);
      setError("Failed to process the Excel file. Please try again.");
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

    setIsConfirmOpen(false);
    setLoading(true);
    setError(null);
    setShowSuccess(false);
    setUploadStatus(null);
    setCurrentUploadId(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await productService.uploadGsaProducts(selectedClient, file);

      setCurrentUploadId(data.upload_id);
      setFile(null);
      setPreviewData(null);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message ?? "Upload initiation failed");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewData(null);
    setError(null);
    setSelectedClient(0);
    setShowSuccess(false);
  };

  const handleResetStatus = async () => {
    if (selectedClient === 0) return;
    try {
      await productService.resetGsaUploadStatus(selectedClient);
      setLoading(false);
      setUploadStatus(null);
      setPollError(false);
      toast.success("Upload status reset successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to reset upload status");
    }
  };


  const getTableHeaders = (): string[] => {
    if (!previewData || previewData.length === 0) return [];
    return Object.keys(previewData[0]);
  };

  const activeClient = clients.find((c) => c.client_id === selectedClient);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 lg:p-10 font-sans transition-colors duration-500">
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmUpload}
        title="Confirm GSA Product Upload"
        message={
          <>
            Are you sure you want to upload the product catalog for{" "}
            <span className="font-bold text-slate-800">
              {activeClient?.company_name}
            </span>
            ?
          </>
        }
        details={[
          {
            label: "Client",
            value: activeClient?.company_name || "",
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
      <style>{loaderStyles}</style>
      <div className="mx-auto">


        <Breadcrumbs
          items={
            isClientRoute || id || clientIdFromParam
              ? [
                  { label: "Client Profiles", path: "/client-profiles" },
                  { label: activeClient?.company_name || "Client" },
                  { label: "Products", path: `/clients/${selectedClient}/products` },
                  { label: "Upload Catalog" },
                ]
              : [
                  { label: "GSA Products", path: "/gsa-products" },
                  { label: "Upload Catalog" },
                ]
          }
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Upload GSA Products Catalog
          </h1>
          <p className="text-slate-500 mt-1">
            Update your product catalog by uploading an Excel spreadsheet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10 relative overflow-hidden transition-all duration-500 min-h-[520px] flex flex-col justify-center">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500 bg-white z-20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3399cc]/5 to-transparent animate-scan" />
                <div className="relative z-10 flex flex-col items-center animate-pulse-light w-full max-w-md mx-auto">
                  {pollError ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 ring-4 ring-red-50/50">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Connection Lost</h4>
                      <p className="text-sm text-slate-500 mb-8 px-4">
                        We're having trouble connecting to the server. Your upload is likely still processing in the background.
                      </p>
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => {
                            setPollError(false);
                          }}
                          className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100"
                        >
                          Retry Connection
                        </button>
                        <button
                          onClick={() => setLoading(false)}
                          className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-8 mt-2">
                        <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-cyan-100 flex items-center justify-center relative z-10 border border-cyan-50">
                          <Upload className="w-12 h-12 text-[#3399cc] animate-pulse" />
                        </div>
                        <div className="absolute inset-0 bg-[#3399cc]/20 rounded-3xl animate-ping opacity-75" style={{ animationDuration: '2.5s' }} />
                        <div className="absolute -inset-6 border-[3px] border-[#3399cc]/20 rounded-full animate-spin" style={{ animationDuration: '3s', borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
                        <div className="absolute -inset-10 border-[2px] border-[#3399cc]/10 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
                      </div>
                      <h4 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight text-center">
                        {uploadStatus?.status === "processing" ? "Processing Catalog Data" : "Uploading GSA Catalog"}
                      </h4>
                      <div className="flex flex-col items-center gap-4 w-full px-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Loader2 className="w-5 h-5 animate-spin text-[#3399cc]" />
                          <span>
                            {uploadStatus?.status === "processing"
                              ? `Processed ${uploadStatus.processed_count?.toLocaleString() || 0}${uploadStatus.total_count ? ` of ${uploadStatus.total_count.toLocaleString()}` : ""} rows...`
                              : "Transferring product data securely..."}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50 relative">
                          <div
                            className={`h-full bg-gradient-to-r from-[#3399cc] via-cyan-400 to-[#3399cc] transition-all duration-500 rounded-full ${!uploadStatus?.total_count ? "w-full animate-progress" : ""}`}
                            style={uploadStatus?.total_count ? { width: `${Math.min(100, ((uploadStatus.processed_count || 0) / uploadStatus.total_count) * 100)}%` } : {}}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 text-center">
                          {uploadStatus?.status === "processing"
                            ? "The catalog is being parsed and validated in the background."
                            : "Background processing will begin shortly after upload completes"}
                        </p>
                      </div>

                      {/* Troubleshooting reset */}
                      {(uploadStatus?.status === "processing" || pollError) && (
                        <div className="mt-8 pt-5 border-t border-slate-50 w-64 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-700">
                          <p className="text-[9px] text-slate-300 mb-2 uppercase tracking-[0.2em] font-black">Troubleshooting</p>
                          <button
                            onClick={handleResetStatus}
                            className="text-[11px] text-slate-400 hover:text-red-400 font-bold flex items-center gap-1.5 transition-all group"
                          >
                            <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
                            Force Reset Stuck Status
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : showSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 animate-success">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center tracking-tight">Upload Complete!</h3>

                <div className="max-w-md w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6">
                  <p className="text-slate-600 text-sm text-center leading-relaxed mb-4">
                    The product catalog for <span className="font-bold text-slate-900">{activeClient?.company_name}</span> has been processed successfully.
                  </p>

                  {uploadStatus?.result && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">New Products</p>
                        <p className="text-base font-bold text-emerald-600">{uploadStatus.result.inserted}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Updated Products</p>
                        <p className="text-base font-bold text-blue-600">{uploadStatus.result.updated}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Restored Items</p>
                        <p className="text-base font-bold text-amber-600">{uploadStatus.result.reactivated}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">No Changes</p>
                        <p className="text-base font-bold text-slate-500">{uploadStatus.result.skipped}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <button
                    onClick={resetUpload}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                  >
                    Upload Another Catalog
                  </button>
                  <Link
                    to={`/clients/${selectedClient}/products`}
                    className="flex-1 bg-[#3399cc] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2b82ad] transition-all shadow-lg shadow-blue-100 active:scale-95"
                  >
                    View Client Products
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
                  <FileSpreadsheet size={120} />
                </div>

                <div className="space-y-8 relative py-2">
                  {!isClientRoute && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-[#3399cc] text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-200">
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
                          onClientSelect={(id) => setSelectedClient(id || 0)}
                        />
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-7 h-7 rounded-full bg-[#3399cc] text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-200">
                        {isClientRoute ? "1" : "2"}
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
                            setError(null);
                          }}
                          className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-all"
                          aria-label="Remove selected file"
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
                      className="w-full bg-[#3399cc] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#2b82ad] disabled:opacity-40 disabled:grayscale shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98] text-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing Upload...
                        </>
                      ) : (
                        <>
                          <Upload size={20} /> Start Product Import <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 mt-6">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>


          {!showSuccess && previewData && previewData.length > 0 && (
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
