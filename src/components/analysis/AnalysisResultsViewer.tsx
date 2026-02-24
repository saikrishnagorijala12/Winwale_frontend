import React, { useState } from "react";
import {
    Plus,
    Minus,
    TrendingUp,
    TrendingDown,
    FileEdit,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { ModificationAction } from "../../types/analysis.types";
import { StatCard } from "../pricelist-analysis/StatCard";
import ConfirmationModal from "../shared/ConfirmationModal";

interface AnalysisResultsViewerProps {
    actions: ModificationAction[];
    actionSummary: Record<string, number>;
    totalActions: number;
    totalPages: number;
    currentPage: number;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onPageChange: (page: number) => void;
    onExport: () => void;
    isLoading?: boolean;
}

export const AnalysisResultsViewer = ({
    actions,
    actionSummary,
    totalActions,
    totalPages,
    currentPage,
    activeTab,
    onTabChange,
    onPageChange,
    onExport,
    isLoading = false,
}: AnalysisResultsViewerProps) => {
    const [isConfirmExportOpen, setIsConfirmExportOpen] = useState(false);
    const itemsPerPage = 7;

    const getPageNumbers = (totalPages: number) => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        if (currentPage > 4) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 3) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const tabs = [
        {
            id: "NEW_PRODUCT",
            label: "Additions",
            icon: Plus,
            variant: "emerald" as const,
            count: actionSummary.NEW_PRODUCT || 0,
        },
        {
            id: "REMOVED_PRODUCT",
            label: "Deletions",
            icon: Minus,
            variant: "red" as const,
            count: actionSummary.REMOVED_PRODUCT || 0,
        },
        {
            id: "PRICE_INCREASE",
            label: "Increases",
            icon: TrendingUp,
            variant: "amber" as const,
            count: actionSummary.PRICE_INCREASE || 0,
        },
        {
            id: "PRICE_DECREASE",
            label: "Decreases",
            icon: TrendingDown,
            variant: "cyan" as const,
            count: actionSummary.PRICE_DECREASE || 0,
        },
        {
            id: "DESCRIPTION_CHANGE",
            label: "Descriptions",
            icon: FileEdit,
            variant: "blue" as const,
            count: actionSummary.DESCRIPTION_CHANGE || 0,
        },
    ];

    const isDescChange = activeTab === "DESCRIPTION_CHANGE";
    const isPriceChange =
        activeTab === "PRICE_INCREASE" || activeTab === "PRICE_DECREASE";
    const isAddOrDelete =
        activeTab === "NEW_PRODUCT" || activeTab === "REMOVED_PRODUCT";

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="space-y-6">
            <ConfirmationModal
                isOpen={isConfirmExportOpen}
                onClose={() => setIsConfirmExportOpen(false)}
                onConfirm={() => {
                    setIsConfirmExportOpen(false);
                    onExport();
                }}
                title="Export Analysis Results"
                message="This will download all modification categories as an Excel file."
                confirmText="Yes, Export"
                cancelText="Cancel"
                variant="blue"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {tabs.map((tab) => (
                    <StatCard
                        key={tab.id}
                        label={tab.label}
                        value={tab.count}
                        icon={<tab.icon className="w-4 h-4" />}
                        variant={tab.variant}
                    />
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-slate-900">
                        Analysis Results
                    </h3>

                    <button
                        onClick={() => setIsConfirmExportOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-all"
                    >
                        <Download size={16} /> Export All
                    </button>
                </div>

                {/* Tab Bar */}
                <div className="px-6 pt-4">
                    <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center w-full ">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
                       ${activeTab === tab.id
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <tab.icon
                                    size={14}
                                    className={
                                        activeTab === tab.id ? `text-${tab.variant}-600` : ""
                                    }
                                />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <table className="w-full text-sm table-fixed">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left p-3 font-bold text-slate-700">
                                        Part Number
                                    </th>
                                    <th className="text-left p-3 font-bold text-slate-700">
                                        Product Name
                                    </th>

                                    {isDescChange && (
                                        <>
                                            <th className="text-left p-3 font-bold text-slate-700">
                                                Old Description
                                            </th>
                                            <th className="text-left p-3 font-bold text-slate-700">
                                                New Description
                                            </th>
                                        </>
                                    )}

                                    {isPriceChange && (
                                        <>
                                            <th className="text-right p-3 font-bold text-slate-700">
                                                Old List Price
                                            </th>
                                            <th className="text-right p-3 font-bold text-slate-700">
                                                New List Price
                                            </th>
                                        </>
                                    )}

                                    {isAddOrDelete && (
                                        <>
                                            <th className="text-left p-3 font-bold text-slate-700">
                                                Description
                                            </th>
                                            <th className="text-right p-3 font-bold text-slate-700">
                                                List Price
                                            </th>
                                        </>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                                                <p className="text-slate-400 text-sm">Loading analysis results...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : actions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-10 text-center text-slate-400 italic"
                                        >
                                            No modifications found for this category.
                                        </td>
                                    </tr>
                                ) : (
                                    actions.map((action, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-mono text-xs text-slate-500">
                                                {action.manufacturer_part_number || "N/A"}
                                            </td>
                                            <td className="p-3 font-medium text-slate-900">
                                                {action.product_name || "Unknown Product"}
                                            </td>

                                            {isDescChange && (
                                                <>
                                                    <td className="p-3 text-xs text-slate-400 truncate max-w-60">
                                                        {action.old_description || "-"}
                                                    </td>
                                                    <td className="p-3 text-xs text-slate-700">
                                                        {action.new_description || "-"}
                                                    </td>
                                                </>
                                            )}

                                            {isPriceChange && (
                                                <>
                                                    <td className="p-3 text-right text-slate-400 tabular-nums">
                                                        {action.old_price
                                                            ? `$${Number(action.old_price).toLocaleString()}`
                                                            : "-"}
                                                    </td>
                                                    <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                                                        {action.new_price
                                                            ? `$${Number(action.new_price).toLocaleString()}`
                                                            : "-"}
                                                    </td>
                                                </>
                                            )}

                                            {isAddOrDelete && (
                                                <>
                                                    <td className="p-3 text-xs text-slate-700 truncate max-w-60">
                                                        {action.new_description ||
                                                            action.old_description ||
                                                            "-"}
                                                    </td>
                                                    <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                                                        {(action.new_price ?? action.old_price)
                                                            ? `$${Number(
                                                                action.new_price ?? action.old_price,
                                                            ).toLocaleString()}`
                                                            : "-"}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalActions > itemsPerPage && (
                    <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500 font-medium">
                            Showing{" "}
                            <span className="text-slate-900 font-semibold">
                                {startIndex + 1}
                            </span>{" "}
                            to{" "}
                            <span className="text-slate-900 font-semibold">
                                {Math.min(startIndex + itemsPerPage, totalActions)}
                            </span>{" "}
                            of{" "}
                            <span className="text-slate-900 font-semibold">
                                {totalActions}
                            </span>{" "}
                            results
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => onPageChange(currentPage - 1)}
                                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center gap-1">
                                {getPageNumbers(totalPages).map((page, idx) =>
                                    page === "..." ? (
                                        <span
                                            key={idx}
                                            className="min-w-9 h-9 flex items-center justify-center text-slate-400 font-bold"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={idx}
                                            onClick={() => onPageChange(page as number)}
                                            className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
      ${currentPage === page
                                                    ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => onPageChange(currentPage + 1)}
                                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
