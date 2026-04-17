import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner"; // Added toast import

import * as XLSX from "xlsx";
import {
  fetchAnalysisJobById,
  uploadCpl,
  startPriceModificationsExport,
} from "../services/analysisService";
import { clientService } from "../services/clientService";
import { downloadBlob } from "../utils/downloadUtils";
import { useSSE } from "../hooks/useSSE";
import { useExportTask } from "../hooks/useExportTask";
import { processModifications } from "../utils/analysisUtils";
import {
  findHeaderRow,
  validateHeaders,
  getDisplayColumnName,
} from "../utils/headerValidationUtils";

import { AnalysisStepper } from "../components/pricelist-analysis/AnalysisStepper";
import { ClientSelectionStep } from "../components/pricelist-analysis/ClientSelectionStep";
import { FileUploadStep } from "../components/pricelist-analysis/FileUploadStep";
import { RunAnalysisStep } from "../components/pricelist-analysis/RunAnalysisStep";
import { ReviewResultsStep } from "../components/pricelist-analysis/ReviewResultsStep";
import { Step } from "../types/analysis.types";
import { ClientMinimal } from "../types/product.types";
import { useAnalysis } from "../context/AnalysisContext";

const steps: Step[] = [
  { id: 1, title: "Select Client", description: "Choose a client" },
  { id: 2, title: "Upload Pricelist", description: "Upload Excel file" },
  { id: 3, title: "Run Analysis", description: "Process data" },
  { id: 4, title: "Review Results", description: "Review and export" },
];

export default function PriceListAnalysis() {
  const navigate = useNavigate();
  const { setSelectedJobId } = useAnalysis();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clients, setClients] = useState<ClientMinimal[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const { startExport, isExporting: isJobExporting, progress: exportProgress, message: exportMessage } = useExportTask();
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [errorVariant, setErrorVariant] = useState<
    "error" | "warning" | "info"
  >("error");

  const [files, setFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isFetchingJob, setIsFetchingJob] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [fileWarnings, setFileWarnings] = useState<Record<string, string>>({});
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const { data: sseData, disconnect: disconnectSSE } = useSSE<any>(
    selectedClient && isAnalyzing ? `/cpl/${selectedClient}/events` : null
  );

  useEffect(() => {
    if (sseData) {
      if (sseData.status === "completed") {
        setUploadResult(sseData.result);
        setSelectedJobId(sseData.result.job_id);
        setIsAnalyzing(false);
        setCurrentStep(4);
        disconnectSSE();
      } else if (sseData.status === "failed") {
        setIsAnalyzing(false);
        setError(sseData.message || "Analysis failed");
        disconnectSSE();
      }
    }
  }, [sseData, setSelectedJobId, disconnectSSE]);

  const [activeTab, setActiveTab] = useState<string>("NEW_PRODUCT");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    if (currentStep === 4 && uploadResult?.job_id) {
      fetchJobDetails(uploadResult.job_id);
    }
  }, [currentStep, activeTab, currentPage, uploadResult?.job_id]);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const data = await clientService.getApprovedClients();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchJobDetails = async (jobId: number) => {
    try {
      setIsFetchingJob(true);
      const data = await fetchAnalysisJobById(jobId, {
        page: currentPage,
        page_size: itemsPerPage,
        action_type: activeTab,
      });
      const jobData = {
        ...data,
        summary: processModifications(data.action_summary),
      };
      setJobDetails(jobData);
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      toast.error("Failed to load analysis results");
    } finally {
      setIsFetchingJob(false);
    }
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement> | React.MouseEvent,
  ) => {
    if (e.type === "click") {
      const input = document.getElementById("file-upload-input");
      if (input) (input as HTMLInputElement).click();
      return;
    }
    const target = e.target as HTMLInputElement;
    const selectedFiles = Array.from(target.files ?? []);
    if (selectedFiles.length === 0) return;
    await processFiles(selectedFiles);
    target.value = '';
  };

  const handleFileDrop = async (droppedFiles: File[]) => {
    await processFiles(droppedFiles);
  };

  const generatePreview = async (file: File) => {
    setIsParsingFile(true);
    setPreviewData(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
      let headerIdx = findHeaderRow(rows);
      const actualHeaderIdx = headerIdx === -1 ? 0 : headerIdx;

      if (rows.length > actualHeaderIdx) {
        const previewRows = rows.slice(actualHeaderIdx, actualHeaderIdx + 11);
        const headers = (previewRows[0] || []).map((h: any, i: number) =>
          String(h || "").trim() || `Column ${i + 1}`
        );

        const jsonData = previewRows.slice(1).map((row) => {
          const obj: any = {};
          headers.forEach((h: string, idx: number) => {
            obj[h] = row[idx] !== undefined ? row[idx] : "";
          });
          return obj;
        });

        if (jsonData.length > 0) setPreviewData(jsonData);
      }
    } catch (err) {
      console.error("Error generating preview:", err);
    } finally {
      setIsParsingFile(false);
    }
  };

  const processFiles = async (newFiles: File[]) => {
    setError(null);
    setErrorVariant("error");
    setIsParsingFile(true);

    try {
      const excelFiles = newFiles.filter(f => f.name.match(/\.(xlsx|xls)$/i));
      if (excelFiles.length < newFiles.length) {
        toast.warning("Some files were ignored. Only Excel files are allowed.");
      }
      if (excelFiles.length === 0) {
        return;
      }

      const uniqueFiles = excelFiles.filter(newFile =>
        !files.some(existing => existing.name === newFile.name && existing.size === newFile.size)
      );
      if (uniqueFiles.length < excelFiles.length) {
        toast.info("Duplicate files were ignored.");
      }
      if (uniqueFiles.length === 0) {
        return;
      }

      const validFiles: File[] = [];
      const newFileWarnings: Record<string, string> = { ...fileWarnings };

      for (const file of uniqueFiles) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
          }) as any[][];

          if (rows.length === 0) {
            newFileWarnings[`${file.name}-${file.size}`] = "File is empty";
            validFiles.push(file);
            continue;
          }

          const headerIdx = findHeaderRow(rows);
          if (headerIdx === -1) {
            newFileWarnings[`${file.name}-${file.size}`] = "Could not detect a valid header row";
            validFiles.push(file);
            continue;
          }

          const headers = rows[headerIdx].map((h) => String(h || "").trim());
          const validation = validateHeaders(headers);
          if (!validation.isValid) {
            const missingNames = validation.missing.map(getDisplayColumnName).join(", ");
            newFileWarnings[`${file.name}-${file.size}`] = `Missing columns: ${missingNames}`;
            validFiles.push(file);
            continue;
          }

          delete newFileWarnings[`${file.name}-${file.size}`];

          validFiles.push(file);
        } catch {
          newFileWarnings[`${file.name}-${file.size}`] = "Failed to read file";
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        setFiles(prev => {
          const updatedFiles = [...prev, ...validFiles];
          if (previewIndex === null) {
            let idx = updatedFiles.findIndex(
              (f) => !newFileWarnings[`${f.name}-${f.size}`],
            );
            if (idx === -1) idx = 0;
            setPreviewIndex(idx);
            generatePreview(updatedFiles[idx]);
          }
          return updatedFiles;
        });
        setFileWarnings(newFileWarnings);
      }

      setFileWarnings(newFileWarnings);
    } catch (err) {
      console.error("Error processing files:", err);
      setError("An error occurred while processing the files. Please try again.");
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleRemoveFile = async (index: number) => {
    const removedFile = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    const newFileWarnings = { ...fileWarnings };
    delete newFileWarnings[`${removedFile.name}-${removedFile.size}`];
    setFileWarnings(newFileWarnings);

    if (newFiles.length === 0) {
      setPreviewData(null);
      setPreviewIndex(null);
      return;
    }

    if (previewIndex === index) {
      setPreviewData(null);
      let nextIdx = newFiles.findIndex(
        (f) => !newFileWarnings[`${f.name}-${f.size}`],
      );
      if (nextIdx === -1) nextIdx = 0;
      setPreviewIndex(nextIdx);
      generatePreview(newFiles[nextIdx]);
    } else if (previewIndex !== null && previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const handlePreviewFile = (index: number) => {
    const file = files[index];
    setPreviewIndex(index);
    generatePreview(file);
  };


  const handleClearAllFiles = () => {
    setFiles([]);
    setPreviewData(null);
    setError(null);
    setFileWarnings({});
    setPreviewIndex(null);
  };

  const handleRunAnalysis = async () => {
    const hasWarnings = Object.keys(fileWarnings).length > 0;
    if (files.length === 0 || !selectedClient || (error && errorVariant === "error") || hasWarnings) {
      if (!error) setError("Missing file or client selection");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setErrorVariant("error");

    try {
      const response = await uploadCpl(selectedClient, files);

      // After starting the job, we stay on Step 3 and wait for SSE
      // Capture job_id if returned (backend refactor planned)
      if (response.job_id) {
        setSelectedJobId(response.job_id);
      }

    } catch (err: any) {
      setIsAnalyzing(false);
      toast.error(err?.message ?? "Analysis failed. Please try again.");
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedClient(null);
    setFiles([]);
    setUploadResult(null);
    setSelectedJobId(null);
    setJobDetails(null);

    setPreviewData(null);
    setError(null);
    setErrorVariant("error");
    setActiveTab("NEW_PRODUCT");
    setCurrentPage(1);
  };

  const activeClient = clients.find((c) => c.client_id === selectedClient);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientSelectionStep
            clients={clients}
            selectedClient={selectedClient ?? 0}
            onClientSelect={(id) => {
              setSelectedClient(id);
              setError(null);
              setErrorVariant("error");
            }}
            onContinue={() => {
              if (!activeClient) {
                setError("Please select a client.");
                return;
              }
              if (!activeClient.has_products) {
                setError(
                  <span>
                    Please complete uploading initial GSA products for selected
                    client before running Price List Analysis.{" "}
                    <Link
                      to="/gsa-products/upload"
                      className="underline font-semibold hover:text-yellow-800 transition-colors"
                    >
                      Click here to upload
                    </Link>
                  </span>,
                );
                setErrorVariant("warning");
                return;
              }
              setError(null);
              setErrorVariant("error");
              setCurrentStep(2);
            }}
            error={error}
            errorVariant={errorVariant}
            isLoading={loadingClients}
          />
        );
      case 2:
        return (
          <FileUploadStep
            files={files}
            fileWarnings={fileWarnings}
            previewData={previewData}
            previewIndex={previewIndex}
            isParsingFile={isParsingFile}
            error={error}
            errorVariant={errorVariant}
            onFileChange={handleFileChange}
            onFileDrop={handleFileDrop}
            onInvalidFile={(reason) => setError(reason)}
            onBack={() => {
              setCurrentStep(1);
              setFiles([]);
              setPreviewData(null);
              setError(null);
              setFileWarnings({});
              setPreviewIndex(null);
            }}
            onContinue={() => {
              setCurrentStep(3);
            }}
            onRemoveFile={handleRemoveFile}
            onClearAllFiles={handleClearAllFiles}
            onPreviewFile={handlePreviewFile}
          />
        );
      case 3:
        return (
          <RunAnalysisStep
            activeClient={activeClient}
            uploadedFileName={files.length > 0 ? `${files.length} files selected` : ""}
            totalRows={files.length}
            isAnalyzing={isAnalyzing}
            percent={sseData?.percent}
            message={sseData?.message}
            error={error}
            errorVariant={errorVariant}
            onBack={() => {
              setCurrentStep(2);
              setUploadResult(null);
            }}
            onRunAnalysis={handleRunAnalysis}
            disableRun={(!!error && errorVariant === "error") || Object.keys(fileWarnings).length > 0}
          />
        );
      case 4:
        return (
          <ReviewResultsStep
            actions={jobDetails?.modifications_actions || []}
            actionSummary={jobDetails?.action_summary || {}}
            totalActions={jobDetails?.total_actions || 0}
            totalPages={jobDetails?.total_pages || 0}
            currentPage={currentPage}
            activeTab={activeTab}
            isLoading={isFetchingJob}
            isExporting={isJobExporting}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            onPageChange={(page) => setCurrentPage(page)}
            onExport={async (selectedTypes) => {
              await startExport(() => startPriceModificationsExport({
                job_id: uploadResult?.job_id,
                types: selectedTypes,
              }));
            }}
            onReset={handleReset}
            onGenerateDocuments={() =>
              navigate(`/documents?job_id=${uploadResult?.job_id}`, { state: { from: 'pricelist' } })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-10 space-y-8 lg:space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Price List Analysis
        </h1>
        <p className="text-slate-500 font-medium">
          Compare commercial pricelists with GSA contract data
        </p>
      </div>

      <AnalysisStepper steps={steps} currentStep={currentStep} />

      {isJobExporting && (
        <div className="w-full bg-white border border-blue-100 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Exporting Data...</p>
                <p className="text-xs text-slate-500 font-medium">{exportMessage}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-blue-600 tabular-nums">{exportProgress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="w-full">{renderStepContent()}</div>
    </div>
  );
}
