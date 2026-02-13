import React from "react";
import {
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  FileEdit,
} from "lucide-react";
import { ModificationSummary } from "../../types/analysis.types";

interface ModificationsSummaryProps {
  summary: ModificationSummary;
  hasModifications: boolean;
}

export default function ModificationsSummary({
  summary,
  hasModifications,
}: ModificationsSummaryProps) {
  return (
    <div className="flex items-center gap-2 text-xs flex-wrap">
      {summary.additions > 0 && (
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <Plus className="w-3 h-3" />
          {summary.additions}
        </span>
      )}

      {summary.deletions > 0 && (
        <span className="flex items-center gap-1 text-red-500 font-bold">
          <Minus className="w-3 h-3" />
          {summary.deletions}
        </span>
      )}

      {summary.priceIncreases > 0 && (
        <span className="flex items-center gap-1 text-amber-600 font-bold">
          <TrendingUp className="w-3 h-3" />
          {summary.priceIncreases}
        </span>
      )}

      {summary.priceDecreases > 0 && (
        <span className="flex items-center gap-1 text-cyan-600 font-bold">
          <TrendingDown className="w-3 h-3" />
          {summary.priceDecreases}
        </span>
      )}

      {summary.descriptionChanges > 0 && (
        <span className="flex items-center gap-1 text-blue-600 font-bold">
          <FileEdit className="w-3 h-3" />
          {summary.descriptionChanges}
        </span>
      )}

      {!hasModifications && (
        <span className="text-slate-400 text-xs italic">
          No modifications
        </span>
      )}
    </div>
  );
}