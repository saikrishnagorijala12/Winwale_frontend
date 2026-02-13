import React from "react";
import { Upload } from "lucide-react";

interface ProductsHeaderProps {
  onUploadClick: () => void;
}

export default function ProductsHeader({ onUploadClick }: ProductsHeaderProps) {
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
      <button
        onClick={onUploadClick}
        className="flex items-center justify-center gap-2 bg-[#3399cc] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#2b82ad] transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        <Upload size={18} />
        Upload GSA
      </button>
    </div>
  );
}