import { ModificationAction, ModificationSummary } from "../types/analysis.types";

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return date.toLocaleTimeString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const processModifications = (
  actionSummary?: Record<string, number>
): ModificationSummary => {
  const summary: ModificationSummary = {
    additions: 0,
    deletions: 0,
    priceIncreases: 0,
    priceDecreases: 0,
    descriptionChanges: 0,
  };

  if (!actionSummary) return summary;

  summary.additions = actionSummary["NEW_PRODUCT"] || 0;
  summary.deletions = actionSummary["REMOVED_PRODUCT"] || 0;
  summary.priceIncreases = actionSummary["PRICE_INCREASE"] || 0;
  summary.priceDecreases = actionSummary["PRICE_DECREASE"] || 0;
  summary.descriptionChanges = actionSummary["DESCRIPTION_CHANGE"] || 0;

  return summary;
};