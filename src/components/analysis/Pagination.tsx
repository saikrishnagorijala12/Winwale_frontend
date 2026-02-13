import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
}

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  startIndex,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-500 font-medium">
        Showing{" "}
        <span className="text-slate-900 font-semibold">
          {startIndex + 1}
        </span>{" "}
        to{" "}
        <span className="text-slate-900 font-semibold">
          {Math.min(startIndex + itemsPerPage, totalItems)}
        </span>{" "}
        of{" "}
        <span className="text-slate-900 font-semibold">{totalItems}</span>{" "}
        analyses
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {(() => {
            const pages = [];
            const delta = 1;
            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
              ) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
              }
            }
            return pages.map((pageNum, idx) => (
              <React.Fragment key={idx}>
                {pageNum === "..." ? (
                  <span className="px-2 text-slate-400 font-medium">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(Number(pageNum))}
                    className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                      ${
                        currentPage === pageNum
                          ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ));
          })()}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}