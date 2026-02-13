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
  actions?: ModificationAction[]
): ModificationSummary => {
  const summary: ModificationSummary = {
    additions: 0,
    deletions: 0,
    priceIncreases: 0,
    priceDecreases: 0,
    descriptionChanges: 0,
  };

  if (!actions || !Array.isArray(actions)) return summary;

  actions.forEach((a) => {
    switch (a.action_type) {
      case "NEW_PRODUCT":
        summary.additions++;
        break;
      case "REMOVED_PRODUCT":
        summary.deletions++;
        break;
      case "PRICE_INCREASE":
        summary.priceIncreases++;
        break;
      case "PRICE_DECREASE":
        summary.priceDecreases++;
        break;
      case "DESCRIPTION_CHANGE":
        summary.descriptionChanges++;
        break;
      default:
        break;
    }
  });

  return summary;
};