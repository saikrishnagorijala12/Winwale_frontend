import React from "react";

interface AnalysisHistoryHeaderProps {
  onDownloadHistory: () => void;
}

export default function AnalysisHistoryHeader({
  onDownloadHistory,
}: AnalysisHistoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Analysis History
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          View and manage all past price list analyses
        </p>
      </div>

      {/* <button
        onClick={onDownloadHistory}
        className="flex items-center justify-center gap-2 bg-[#38A1DB] hover:bg-[#2D8BBF] text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
      >
        Download History
      </button> */}
    </div>
  );
}