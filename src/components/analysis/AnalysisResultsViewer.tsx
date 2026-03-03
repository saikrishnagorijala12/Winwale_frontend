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
import Pagination from "../shared/Pagination";

const tabs = [
    {
        id: "NEW_PRODUCT",
        label: "Additions",
        icon: Plus,
        variant: "emerald" as const,
    },
    {
        id: "REMOVED_PRODUCT",
        label: "Deletions",
        icon: Minus,
        variant: "red" as const,
    },
    {
        id: "PRICE_INCREASE",
        label: " Price Increases",
        icon: TrendingUp,
        variant: "amber" as const,
    },
    {
        id: "PRICE_DECREASE",
        label: "Price Decreases",
        icon: TrendingDown,
        variant: "cyan" as const,
    },
    {
        id: "DESCRIPTION_CHANGE",
        label: "Description Changes",
        icon: FileEdit,
        variant: "blue" as const,
    },
];

interface AnalysisResultsViewerProps {
    actions: ModificationAction[];
    actionSummary: Record<string, number>;
    totalActions: number;
    totalPages: number;
    currentPage: number;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onPageChange: (page: number) => void;
    onExport: (selectedTypes: string[]) => Promise<void>;
    isLoading?: boolean;
    isExporting?: boolean;
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
    isExporting = false,
}: AnalysisResultsViewerProps) => {
    const [isConfirmExportOpen, setIsConfirmExportOpen] = useState(false);
    const [selectedExportTypes, setSelectedExportTypes] = useState<string[]>([]);
    const itemsPerPage = 7;

    React.useEffect(() => {
        const nonZeroTypes = tabs
            .filter((t) => (actionSummary[t.id] || 0) > 0)
            .map((t) => t.id);

        if (nonZeroTypes.length > 0 && selectedExportTypes.length === 0) {
            setSelectedExportTypes(nonZeroTypes);
        }
    }, [actionSummary]);

    const totalModifications = Object.values(actionSummary).reduce(
        (sum, count) => sum + count,
        0,
    );

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
                onConfirm={async () => {
                    await onExport(selectedExportTypes);
                    setIsConfirmExportOpen(false);
                }}
                title="Export Analysis Results"
                message={
                    <div className="space-y-3 pt-1">
                        <p className="text-xs text-slate-400 text-left">
                            Select modification categories to export as Excel.
                        </p>

                        <div className="space-y-1">
                            {tabs.map((tab) => {
                                const hasItems = (actionSummary[tab.id] || 0) > 0;
                                const isChecked = selectedExportTypes.includes(tab.id);

                                return (
                                    <label
                                        key={tab.id}
                                        className={`
            flex items-center justify-between
            px-3 py-2
            rounded-lg
            transition-colors
            ${hasItems ? "cursor-pointer hover:bg-slate-50" : "opacity-40 cursor-not-allowed"}
            ${isChecked ? "bg-slate-50" : "bg-transparent"}
          `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`
                w-8 h-8
                rounded-md
                flex items-center justify-center
                ${isChecked ? `text-${tab.variant}-600` : "text-slate-400"}
              `}
                                            >
                                                <tab.icon size={16} />
                                            </div>

                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-medium text-slate-700">
                                                    {tab.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {actionSummary[tab.id] || 0} items
                                                </span>
                                            </div>
                                        </div>

                                        <input
                                            type="checkbox"
                                            className="
              w-3.5 h-3.5
              rounded
              border-slate-300
              accent-[#24588fe1]
              cursor-pointer
              disabled:cursor-not-allowed
            "
                                            checked={isChecked}
                                            disabled={!hasItems}
                                            onChange={() => {
                                                if (!hasItems) return;
                                                setSelectedExportTypes((prev) =>
                                                    prev.includes(tab.id)
                                                        ? prev.filter((id) => id !== tab.id)
                                                        : [...prev, tab.id],
                                                );
                                            }}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                }
                confirmText="Yes, Export"
                cancelText="Cancel"
                isSubmitting={isExporting}
                confirmDisabled={selectedExportTypes.length === 0}
                variant="blue"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {tabs.map((tab) => (
                    <StatCard
                        key={tab.id}
                        label={tab.label}
                        value={actionSummary[tab.id] || 0}
                        icon={<tab.icon className="w-4 h-4" />}
                        variant={tab.variant}
                    />
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-slate-900">Analysis Results</h3>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsConfirmExportOpen(true)}
                            disabled={isExporting || totalModifications === 0}
                            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <Download
                                size={16}
                                className="text-slate-400 group-hover:text-slate-600 transition-colors"
                            />
                            Export Data
                        </button>
                    </div>
                </div>

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
                                                <p className="text-sm text-slate-500 font-medium">
                                                    Loading analysis results...
                                                </p>
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

                <Pagination
                    currentPage={currentPage}
                    totalItems={totalActions}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};
