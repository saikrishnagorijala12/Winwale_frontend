import React from "react";
import { Sparkles, Building2, FileSearch, FileText, Hash, ChevronLeft, Loader2, Play, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Client } from "../../types/pricelist.types";

interface RunAnalysisStepProps {
    activeClient: Client | undefined;
    uploadedFileName: string;
    totalRows: number;
    isAnalyzing: boolean;
    error: React.ReactNode;
    errorVariant?: "error" | "warning" | "info";
    onBack: () => void;
    onRunAnalysis: () => void;
}

export const RunAnalysisStep = ({
    activeClient,
    uploadedFileName,
    totalRows,
    isAnalyzing,
    error,
    errorVariant = "error",
    onBack,
    onRunAnalysis,
}: RunAnalysisStepProps) => {
    return (
        <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
                        <Sparkles className="w-5 h-5 text-[#3399cc]" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Run Analysis</h3>
                </div>
                <p className="text-sm text-slate-500">
                    Compare uploaded data with GSA contract data
                </p>
            </div>

            <div className="p-6 space-y-6">
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

                {error && (
                    <div
                        className={`p-4 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${errorVariant === "warning"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : errorVariant === "info"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                    >
                        {errorVariant === "warning" ? (
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                        ) : errorVariant === "info" ? (
                            <Info className="w-5 h-5 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <button
                        onClick={onBack}
                        disabled={isAnalyzing}
                        className="btn-secondary"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                        onClick={onRunAnalysis}
                        disabled={isAnalyzing}
                        className="btn-primary"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" /> Run Analysis
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
