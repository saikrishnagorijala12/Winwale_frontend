import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../lib/axios";
import * as XLSX from "xlsx";
import {
  exportPriceModifications,
  fetchAnalysisJobById,
} from "../services/analysisService";
import { downloadBlob } from "../utils/downloadUtils";
import { useAnalysis } from "../context/AnalysisContext";
import { toast } from "sonner";
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
import { Client, Step, CategorizedActions } from "../types/pricelist.types";

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
  const [isExporting, setIsExporting] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
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
      const res = await api.get("/clients/approved");
      setClients(res.data);
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
      document.getElementById("file-upload-input")?.click();
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
      let firstValidPreviewFile: File | null = null;

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

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const response = await api.post(`/cpl/${selectedClient}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadResult(response.data);
      setSelectedJobId(response.data.job_id);
      setCurrentStep(4);

      setIsAnalyzing(false);
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
            isExporting={isExporting}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            onPageChange={(page) => setCurrentPage(page)}
            onExport={async (selectedTypes) => {
              try {
                setIsExporting(true);
                const date = new Date()
                  .toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })
                  .replace(/\//g, "-");

                const clientName =
                  activeClient?.company_name.replace(/\s+/g, "-") || "Client";
                const contract = activeClient?.contract_number || "NoContract";
                const fileName = `${clientName}_${contract}_modifications_${date}.xlsx`;

                const blob = await exportPriceModifications({
                  job_id: uploadResult?.job_id,
                  types: selectedTypes,
                });
                downloadBlob(blob, fileName);
                toast.success("Analysis export complete");
              } catch (error) {
                console.error("Export failed:", error);
                toast.error("Failed to export analysis");
              } finally {
                setIsExporting(false);
              }
            }}
            onReset={handleReset}
            onGenerateDocuments={() =>
              navigate(`/documents?job_id=${uploadResult?.job_id}`)
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

      <div className="w-full">{renderStepContent()}</div>
    </div>
  );
}
