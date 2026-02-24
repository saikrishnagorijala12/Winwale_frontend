import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../lib/axios";
import * as XLSX from "xlsx";
import { exportPriceModifications, fetchAnalysisJobById } from "../services/analysisService";
import { downloadBlob } from "../utils/downloadUtils";
import { useAnalysis } from "../context/AnalysisContext";
import { toast } from "sonner";
import { processModifications } from "../utils/analysisUtils";


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
  const [isParsingFile, setIsParsingFile] = useState(false);

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
      const res = await api.get("/clients/approved");
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
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
    const selectedFile = target.files?.[0] ?? null;
    if (!selectedFile) return;
    await processFile(selectedFile);
  };

  const handleFileDrop = async (droppedFile: File) => {
    await processFile(droppedFile);
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError("Invalid format. Please select an Excel (.xlsx or .xls) file");
      return;
    }
    setFile(selectedFile);
    setUploadedFileName(selectedFile.name);
    setError(null);
    setPreviewData(null);
    setIsParsingFile(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      if (jsonData.length === 0) {
        setError("The uploaded Excel file contains no data rows.");
        setFile(null);
        setPreviewData(null);
        setTotalRows(0);
        return;
      }
      setTotalRows(jsonData.length);
      setPreviewData(jsonData);
    } finally {
      setIsParsingFile(false);
    }
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
      setSelectedJobId(response.data.job_id);
      // fetchJobDetails will be called by the useEffect when currentStep changes to 4
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
    setFile(null);
    setUploadedFileName("");
    setUploadResult(null);
    setSelectedJobId(null);
    setJobDetails(null);

    setPreviewData(null);
    setTotalRows(0);
    setError(null);
    setActiveTab("NEW_PRODUCT"); // Reset active tab
    setCurrentPage(1); // Reset current page
  };

  const activeClient = clients.find(
    (c) => c.client_id === selectedClient,
  );

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
            }}
            onContinue={() => {
              if (!activeClient) {
                setError("Please select a client.");
                return;
              }
              if (!activeClient.has_products) {
                setError(
                  "No products found for this client. Please upload initial GSA products for selected client before running Price List Analysis.",
                );
                return;
              }
              setError(null);
              setCurrentStep(2);
            }}
            error={error}
          />
        );
      case 2:
        return (
          <FileUploadStep
            file={file}
            uploadedFileName={uploadedFileName}
            previewData={previewData}
            totalRows={totalRows}
            isParsingFile={isParsingFile}
            error={error}
            onFileChange={handleFileChange}
            onFileDrop={handleFileDrop}
            onInvalidFile={(reason) => setError(reason)}
            onBack={() => {
              setCurrentStep(1);
              setFile(null);
              setPreviewData(null);
              setError(null);
            }}
            onContinue={() => {
              setCurrentStep(3);
              setError(null);
            }}
            onClearFile={() => {
              setFile(null);
              setPreviewData(null);
            }}
          />
        );
      case 3:
        return (
          <RunAnalysisStep
            activeClient={activeClient}
            uploadedFileName={uploadedFileName}
            totalRows={totalRows}
            isAnalyzing={isAnalyzing}
            error={error}
            onBack={() => {
              setCurrentStep(2);
              setUploadResult(null);
              setError(null);
            }}
            onRunAnalysis={handleRunAnalysis}
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
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            onPageChange={(page) => setCurrentPage(page)}
            isLoading={isFetchingJob}
            onExport={async () => {
              try {
                const date = new Date().toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }).replace(/\//g, "-");

                const clientName =
                  activeClient?.company_name.replace(/\s+/g, "-") || "Client";
                const contract = activeClient?.contract_number || "NoContract";
                const fileName = `${clientName}_${contract}_modifications_${date}.xlsx`;

                const blob = await exportPriceModifications({
                  client_id: selectedClient,
                  job_id: uploadResult?.job_id,
                });
                downloadBlob(blob, fileName);
                toast.success("Analysis export complete");
              } catch (error) {
                console.error("Export failed:", error);
                toast.error("Failed to export analysis");
              }
            }}
            onReset={handleReset}
            onGenerateDocuments={() => navigate(`/documents?job_id=${uploadResult?.job_id}`)}
          />
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

      <AnalysisStepper steps={steps} currentStep={currentStep} />

      <div className="w-full">{renderStepContent()}</div>
    </div>
  );
}
