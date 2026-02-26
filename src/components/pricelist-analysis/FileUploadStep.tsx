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

interface FileUploadStepProps {
    file: File | null;
    uploadedFileName: string;
    previewData: any[] | null;
    totalRows: number;
    isParsingFile: boolean;
    error: React.ReactNode;
    errorVariant?: "error" | "warning" | "info";
    onFileChange: (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => void;
    onFileDrop: (file: File) => void;
    onInvalidFile?: (reason: string) => void;
    onBack: () => void;
    onContinue: () => void;
    onClearFile: () => void;
}

export const FileUploadStep = ({
    file,
    uploadedFileName,
    previewData,
    totalRows,
    isParsingFile,
    error,
    errorVariant = "error",
    onFileChange,
    onFileDrop,
    onInvalidFile,
    onBack,
    onContinue,
    onClearFile,
}: FileUploadStepProps) => {
    const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
        useFileDrop({
            onFileDrop,
            onInvalidFile,
        });
    return (
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

            <div className="p-6 space-y-6">
                <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={onFileChange}
                />
                <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${file
                        ? "border-emerald-500 bg-emerald-50"
                        : isDragging
                            ? "border-[#3399cc] bg-cyan-50/70 scale-[1.01]"
                            : "border-slate-300 hover:border-[#3399cc] hover:bg-cyan-50/50"
                        }`}
                    onClick={onFileChange}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{uploadedFileName}</p>
                                <p className="text-sm text-slate-500">Click to replace</p>
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
                                    {isDragging ? "Drop your file here" : "Drag & drop or click to browse"}
                                </p>
                                <p className="text-sm text-slate-500">Excel (.xlsx or .xls) files only</p>
                            </div>
                        </div>
                    )}
                </div>

                {isParsingFile && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-[#24578f] shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-600 mb-1.5">Parsing file, please wait…</p>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#3399cc] rounded-full animate-[progress_1.2s_ease-in-out_infinite]" style={{ width: "60%" }} />
                            </div>
                        </div>
                    </div>
                )}

                {!isParsingFile && previewData && previewData.length > 0 && (
                    <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                                Data Preview (10 of {totalRows} rows)
                            </span>
                            <button
                                onClick={onClearFile}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="max-h-105 overflow-auto">
                            <table className="w-full text-[11px] text-left border-collapse">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-slate-100 border-b border-slate-200">
                                        {Object.keys(previewData[0]).map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-2 font-bold text-slate-700 whitespace-nowrap"
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
                                            className="bg-white hover:bg-slate-50 border-b border-slate-50 transition-colors"
                                        >
                                            {Object.values(row).map((val: any, j) => (
                                                <td
                                                    key={j}
                                                    className="px-4 py-2 text-slate-600 whitespace-nowrap"
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
                )}

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

                <div className="flex justify-between">
                    <button
                        onClick={onBack}
                        className="btn-secondary"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                        onClick={onContinue}
                        disabled={!file || isParsingFile || !previewData}
                        className="btn-primary"
                    >
                        Continue <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
