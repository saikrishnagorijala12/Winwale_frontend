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
    <div className="flex flex-col md:flex-row justify-between md:items-center md:justify-between gap-6 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          GSA Products
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Products catalog management and overview
        </p>
      </div>
      <div className="flex items-center gap-3">
        {onExportClick && (
          <button
            onClick={onExportClick}
            disabled={isExporting || totalCount === 0}
            className="btn-secondary"
          >
            <Download size={18} />
            Export Products
          </button>
        )}
        <button
          onClick={onUploadClick}
          className="btn-primary"
        >
          <Upload size={18} />
          Upload GSA Products
        </button>
      </div>
    </div>
  );
}
