import React from "react";
import { Sparkles, Building2, FileSearch, FileText, Hash, ChevronLeft, Loader2, Play, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Client } from "../../types/pricelist.types";

const loaderStyles = `
  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes analyzePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.95; transform: scale(0.98); }
  }
  .animate-scan { animation: scan 2s ease-in-out infinite; }
  .animate-progress { animation: progress 2s ease-in-out infinite; }
  .animate-analyze { animation: analyzePulse 3s ease-in-out infinite; }
`;

interface RunAnalysisStepProps {
    activeClient: Client | undefined;
    uploadedFileName: string;
    totalRows: number;
    isAnalyzing: boolean;
    error: React.ReactNode;
    errorVariant?: "error" | "warning" | "info";
    onBack: () => void;
    onRunAnalysis: () => void;
    disableRun?: boolean;
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
    disableRun = false,
}: RunAnalysisStepProps) => {
    return (
        <>
            <style>{loaderStyles}</style>
            <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden relative">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center p-12 sm:p-20 min-h-[450px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3399cc]/5 to-transparent animate-scan" />

                        <div className="relative z-10 flex flex-col items-center animate-analyze">
                            <div className="relative mb-12">
                                <div className="w-24 h-24 rounded-[32px] bg-white shadow-2xl shadow-cyan-100 flex items-center justify-center relative z-10 border border-cyan-50">
                                    <Sparkles className="w-12 h-12 text-[#3399cc] animate-pulse" />
                                </div>
                                {/* Rings */}
                                <div className="absolute inset-0 bg-[#3399cc]/20 rounded-[32px] animate-ping opacity-75" style={{ animationDuration: '2.5s' }} />
                                <div className="absolute -inset-8 border-[3px] border-[#3399cc]/20 rounded-full animate-spin" style={{ animationDuration: '3s', borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
                                <div className="absolute -inset-12 border-[2px] border-indigo-400/20 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
                                <div className="absolute -inset-16 border border-emerald-400/20 rounded-full animate-spin" style={{ animationDuration: '6s', borderTopColor: 'transparent' }} />
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight text-center">Running Deep Analysis</h3>

                            <div className="flex flex-col items-center gap-5 w-full max-w-sm">
                                <div className="flex items-center gap-3 text-sm sm:text-base text-slate-600 font-medium">
                                    <Loader2 className="w-5 h-5 animate-spin text-[#3399cc]" />
                                    <span>Comparing {totalRows.toLocaleString()} File(s) with GSA contract...</span>
                                </div>

                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                    <div className="h-full bg-gradient-to-r from-[#3399cc] via-cyan-400 to-[#3399cc] w-full animate-progress rounded-full" />
                                </div>
                                <p className="text-xs text-slate-400 font-medium text-center">Please wait, this might take a moment depending on file size</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
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

                        <div className="p-4 sm:p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
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
                                            Files
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
                                    disabled={isAnalyzing || disableRun}
                                    className={`btn-primary ${disableRun ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
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
                    </>
                )}
            </div>
        </>
    );
};
