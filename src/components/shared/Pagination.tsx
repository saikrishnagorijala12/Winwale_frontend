import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  label = "results",
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  if (totalPages < 1) return null;

  return (
    <div className="px-6 py-5 border-t border-slate-100 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-500 font-medium">
        Showing{" "}
        <span className="text-slate-900 font-semibold">{startIndex + 1}</span>{" "}
        to{" "}
        <span className="text-slate-900 font-semibold">
          {Math.min(startIndex + itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="text-slate-900 font-semibold">{totalItems}</span>{" "}
        {label}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) => (
              <React.Fragment key={idx}>
                {pageNum === "..." ? (
                  <span className="px-2 text-slate-400 font-medium">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(Number(pageNum))}
                    className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                        ${
                                          currentPage === pageNum
                                            ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
