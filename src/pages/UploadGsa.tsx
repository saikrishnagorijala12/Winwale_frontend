import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import api from "../lib/axios";


interface Client {
  client_id: string;
  company_name: string;
}

interface UploadResult {
  inserted: number;
  updated: number;
}

type PreviewRow = Record<string, unknown>;

const UploadGsa: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[] | null>(null);


  useEffect(() => {
    fetchClients();
  }, []);


  const fetchClients = async (): Promise<void> => {
    try {
      setLoadingClients(true);
      const response = await api.get<Client[]>("clients");
      setClients(response.data);
    } catch {
      setError("Failed to load clients");
    } finally {
      setLoadingClients(false);
    }
  };


  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setPreviewData(null);
      return;
    }

    if (!selectedFile.name.endsWith(".xlsx")) {
      setError("Please select an Excel (.xlsx) file");
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
      const jsonData = XLSX.utils.sheet_to_json<PreviewRow>(sheet);

      setPreviewData(jsonData.slice(0, 10));
    } catch (err) {
      console.error("Preview failed:", err);
      setPreviewData(null);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedClient) {
      setError("Please select a client");
      return;
    }

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<UploadResult>(
        `/upload/${selectedClient}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadResult(response.data);
      setFile(null);
      setPreviewData(null);

      const input = document.getElementById(
        "file-input"
      ) as HTMLInputElement | null;

      if (input) input.value = "";
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
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans text-slate-900">
        {/* Header */}
        <div className="mb-10">
          <div className="text-3xl font-bold text-[#0f172a]">
            {" "}
            Product Excel Upload
          </div>
          <p className="text-slate-500 mt-1">
            Upload GSA price list files for clients
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Client Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Client *
            </label>

            {loadingClients ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#3399cc]" />
                <span>Loading clients...</span>
              </div>
            ) : (
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              >
                <option value="">-- Choose a client --</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.company_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File (.xlsx) *
            </label>

            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all bg-white">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-base font-medium text-gray-700 mb-1">
                  {file ? file.name : "Choose file or drag here"}
                </p>
                <p className="text-sm text-gray-500">
                  Only .xlsx files are supported
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
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file || !selectedClient}
            className="w-full btn-primary t"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Products
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-semibold">Upload successful!</p>
                <p className="mt-0.5">
                  {uploadResult.inserted} products inserted,{" "}
                  {uploadResult.updated} products updated
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Preview Table */}
        {previewData && previewData.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Preview (First 10 rows)
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {getTableHeaders().map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {getTableHeaders().map((header) => (
                        <td
                          key={header}
                          className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                        >
                          {row[header] != null ? String(row[header]) : "-"}
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
  );
};

export default UploadGsa;
