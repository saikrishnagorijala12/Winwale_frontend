import React from "react";
import { useFileDrop } from "../../hooks/useFileDrop";
import {
    FileSpreadsheet,
    Check,
    Upload,
    X,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    AlertTriangle,
    Info,
    Loader2,
} from "lucide-react";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`;

interface FileUploadStepProps {
    files: File[];
    fileWarnings: Record<string, string>;
    previewData: any[] | null;
    previewIndex: number | null;
    isParsingFile: boolean;
    parsingMessage?: string;
    error: React.ReactNode;
    errorVariant?: "error" | "warning" | "info";
    onFileChange: (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => void;
    onFileDrop: (files: File[]) => void;
    onInvalidFile?: (reason: string) => void;
    onBack: () => void;
    onContinue: () => void;
    onRemoveFile: (index: number) => void;
    onClearAllFiles: () => void;
    onPreviewFile: (index: number) => void;
}

export const FileUploadStep = ({
    files,
    fileWarnings,
    previewData,
    previewIndex,
    isParsingFile,
    parsingMessage = "Parsing file data...",
    error,
    errorVariant = "error",
    onFileChange,
    onFileDrop,
    onInvalidFile,
    onBack,
    onContinue,
    onRemoveFile,
    onClearAllFiles,
    onPreviewFile,
}: FileUploadStepProps) => {
    const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
        useFileDrop({
            onFileDrop,
            onInvalidFile,
        });
    return (
        <>
            <style>{scrollbarStyles}</style>
            <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
                            <FileSpreadsheet className="w-5 h-5 text-[#3399cc]" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">
                            Upload Commercial Pricelist
                        </h3>
                    </div>
                    <p className="text-sm text-slate-500">
                        Upload the updated commercial pricelist (Excel format)
                    </p>
                </div>

                <div className="p-5 flex flex-col gap-6">
                    <input
                        id="file-upload-input"
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls"
                        multiple
                        onChange={onFileChange}
                    />

                    {/* Top Row: Full-width Upload Zone */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${files.length > 0
                            ? Object.keys(fileWarnings).length > 0
                                ? "border-amber-400 bg-amber-50/30"
                                : "border-emerald-500 bg-emerald-50"
                            : isDragging
                                ? "border-[#3399cc] bg-cyan-50/70 scale-[1.01]"
                                : "border-slate-300 hover:border-[#3399cc] hover:bg-cyan-50/50"
                            }`}
                        onClick={onFileChange}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {files.length > 0 ? (
                            <div className="space-y-4">
                                <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center ${Object.keys(fileWarnings).length > 0 ? "bg-amber-100" : "bg-emerald-100"}`}>
                                    {Object.keys(fileWarnings).length > 0 ? (
                                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                                    ) : (
                                        <Check className="w-8 h-8 text-emerald-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
                                    <p className="text-sm text-slate-500">Click or drag & drop to add more files</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className={`w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto transition-transform ${isDragging ? "scale-110" : ""
                                    }`}>
                                    <Upload className={`w-8 h-8 ${isDragging ? "text-[#2b82ad]" : "text-[#3399cc]"}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">
                                        {isDragging ? "Drop your files here" : "Drag & drop or click to browse"}
                                    </p>
                                    <p className="text-sm text-slate-500">Excel (.xlsx or .xls) files only</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Row: Two-column grid for File List and Preview */}
                    {files.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* File List Column */}
                            <div className="lg:col-span-4 space-y-3 bg-slate-50/50 rounded-2xl p-3 sm:p-4 border border-slate-100 h-fit">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Selected Files</span>
                                    <button onClick={onClearAllFiles} className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 transition-colors">
                                        <X className="w-3 h-3" /> Clear All
                                    </button>
                                </div>
                                <ul className="space-y-2 max-h-100 overflow-y-auto custom-scrollbar pr-1">
                                    {files.map((f, i) => {
                                        const warning = fileWarnings[`${f.name}-${f.size}`];
                                        const isActive = previewIndex === i;
                                        return (
                                            <li key={i} className={`group relative flex justify-between items-center border p-3.5 rounded-2xl transition-all cursor-pointer ${isActive
                                                ? warning
                                                    ? "border-amber-400 bg-amber-50/50 z-10"
                                                    : "border-[#3399cc] bg-cyan-50/30 z-10"
                                                : warning
                                                    ? "border-amber-200 bg-amber-50/20 hover:border-amber-400/40"
                                                    : "border-slate-200 bg-white hover:border-[#3399cc]/40 hover:bg-cyan-50/10"
                                                }`}
                                                onClick={() => onPreviewFile(i)}
                                            >
                                                <div className="flex items-center gap-3.5 overflow-hidden">
                                                    <div className={`p-2.5 rounded-xl transition-colors ${warning
                                                        ? isActive ? "bg-amber-100" : "bg-amber-100/50"
                                                        : isActive ? "bg-[#3399cc] text-white" : "bg-slate-50 group-hover:bg-cyan-50"
                                                        }`}>
                                                        {warning ? (
                                                            <AlertTriangle className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-700" : "text-amber-500"}`} />
                                                        ) : (
                                                            <FileSpreadsheet className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-500 group-hover:text-[#3399cc]"}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-xs truncate font-bold ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                                                            {f.name}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {isActive && (
                                                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${warning ? "bg-amber-100 text-amber-700" : "bg-cyan-100 text-[#3399cc]"
                                                                    }`}>
                                                                    Viewing
                                                                </span>
                                                            )}
                                                            <span className={`text-[9px] font-bold truncate ${warning
                                                                ? isActive ? "text-amber-700" : "text-amber-600"
                                                                : isActive ? "text-[#3399cc]" : "text-slate-400"
                                                                }`}>
                                                                {warning || `${(f.size / 1024).toFixed(1)} KB`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveFile(i);
                                                }} className={`transition-all p-1.5 rounded-lg ${isActive
                                                    ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                    : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                    }`}>
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Preview Area Column */}
                            <div className="lg:col-span-8">
                                {isParsingFile ? (
                                    <div className="flex-1 flex flex-col items-center justify-center min-h-100 bg-white/50 rounded-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center relative z-10 border border-cyan-100">
                                                <Loader2 className="w-8 h-8 text-[#3399cc] animate-spin" />
                                            </div>
                                            <div className="absolute inset-0 bg-[#3399cc]/10 rounded-2xl animate-pulse" />
                                        </div>
                                        <h4 className="text-base font-bold text-slate-800 mb-1">{parsingMessage}</h4>
                                        <p className="text-[11px] text-slate-500">This will only take a moment</p>
                                    </div>
                                ) : previewData && previewData.length > 0 ? (
                                    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Data Preview • {files[previewIndex ?? 0]?.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Showing first 10 rows</span>
                                        </div>
                                        <div className="overflow-x-auto custom-scrollbar max-h-100">
                                            <table className="w-full text-[11px] text-left border-collapse">
                                                <thead className="sticky top-0 z-20">
                                                    <tr className="bg-slate-100/80 backdrop-blur-sm border-b border-slate-200">
                                                        {Object.keys(previewData[0]).map((h) => (
                                                            <th
                                                                key={h}
                                                                className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap bg-slate-100/50"
                                                            >
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {previewData.slice(0, 10).map((row, i) => (
                                                        <tr
                                                            key={i}
                                                            className="bg-white hover:bg-cyan-50/30 border-b border-slate-50 transition-colors"
                                                        >
                                                            {Object.values(row).map((val: any, j) => (
                                                                <td
                                                                    key={j}
                                                                    className="px-4 py-2.5 text-slate-600 whitespace-nowrap"
                                                                >
                                                                    {String(val)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center min-h-100 bg-slate-50/30 rounded-2xl border border-slate-100 border-dashed p-8 text-center">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                            <Info className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-500">Select a file to see its preview</p>
                                        <p className="text-[11px] text-slate-400 mt-1">Previewing helps identify mapping issues early</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div
                            className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 ${errorVariant === "warning"
                                ? "bg-amber-50 text-amber-700 border border-amber-100/50 shadow-sm shadow-amber-100"
                                : errorVariant === "info"
                                    ? "bg-blue-50 text-blue-700 border border-blue-100/50 shadow-sm shadow-blue-100"
                                    : "bg-red-50 text-red-700 border border-red-100/50 shadow-sm shadow-red-100"
                                }`}
                        >
                            <div className={`p-1.5 rounded-lg ${errorVariant === "warning" ? "bg-amber-100" : errorVariant === "info" ? "bg-blue-100" : "bg-red-100"}`}>
                                {errorVariant === "warning" ? (
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                ) : errorVariant === "info" ? (
                                    <Info className="w-4 h-4 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                )}
                            </div>
                            <span className="text-xs font-semibold leading-relaxed">{error}</span>
                        </div>
                    )}

                    {/* Bottom Row: Actions */}
                    <div className="flex justify-between items-center pt-4 mt-2">
                        <button
                            onClick={onBack}
                            className="btn-secondary"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={onContinue}
                            disabled={files.length === 0 || isParsingFile || !previewData || Object.keys(fileWarnings).length > 0}
                            className="btn-primary"
                        >
                            Continue <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
