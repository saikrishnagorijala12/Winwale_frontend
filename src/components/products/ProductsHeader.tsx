import React from "react";
import { Download, Upload } from "lucide-react";

interface ProductsHeaderProps {
  onUploadClick: () => void;
  onExportClick?: () => void;
  isExporting?: boolean;
  totalCount?: number;
}

export default function ProductsHeader({
  onUploadClick,
  onExportClick,
  isExporting = false,
  totalCount,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center md:justify-between gap-6 mb-12 mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Products
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Catalog management and inventory overview
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onUploadClick}
          className="flex items-center justify-center gap-2 bg-[#3399cc] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#2b82ad] transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Upload size={18} />
          Upload GSA
        </button>
        {onExportClick && (
          <button
            onClick={onExportClick}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export
          </button>
        )}
      </div>
    </div>
  );
}
