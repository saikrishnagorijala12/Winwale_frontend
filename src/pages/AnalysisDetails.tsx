import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../lib/axios";
import { useAnalysis } from "../context/AnalysisContext";

import {
  Loader2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import React from "react";
import { exportAnalysisToExcel } from "../utils/exportAnalysisUtils";
import { AnalysisResultsViewer } from "../components/analysis/AnalysisResultsViewer";

export default function AnalysisDetails() {
  const { selectedJobId } = useAnalysis();
  const jobId = selectedJobId;
  const navigate = useNavigate();

  const [isFetchingJob, setIsFetchingJob] = useState(true);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setIsFetchingJob(false);
        return;
      }
      try {
        setIsFetchingJob(true);
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data);
      } finally {
        setIsFetchingJob(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const categorized = useMemo(() => {
    const base = {
      additions: [],
      deletions: [],
      priceIncreases: [],
      priceDecreases: [],
      descriptionChanges: [],
    };

    if (!job?.modifications_actions) return base;

    for (const a of job.modifications_actions) {
      switch (a.action_type) {
        case "NEW_PRODUCT":
          base.additions.push(a);
          break;
        case "REMOVED_PRODUCT":
          base.deletions.push(a);
          break;
        case "PRICE_INCREASE":
          base.priceIncreases.push(a);
          break;
        case "PRICE_DECREASE":
          base.priceDecreases.push(a);
          break;
        case "DESCRIPTION_CHANGE":
          base.descriptionChanges.push(a);
          break;
      }
    }

    return base;
  }, [job]);

  if (isFetchingJob) {
    return (
      <div className="py-120 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#24578f]" />
        <p className="mt-4 text-slate-500">Fetching modification details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-20 text-center text-slate-500">Analysis not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            {jobId ? "Analysis Details" : "No Analysis Selected"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {jobId ? `Review the analysis results of ANAL-JOB-${jobId}` : "Please select an analysis from the History page"}
          </p>
        </div>
      </div>

      <AnalysisResultsViewer
        categorized={categorized}
        onExport={() => {
          const date = new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }).replace(/\//g, "-");

          const clientName = job?.client?.replace(/\s+/g, "-") || "Client";
          const contract = job?.contract_number || "NoContract";
          const fileName = `${clientName}_${contract}_modifications_${date}.xlsx`;
          exportAnalysisToExcel(jobId, categorized, fileName);
        }}
      />

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => navigate(`/documents`)}
          className="btn-primary"
        >
          Generate Documents <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

