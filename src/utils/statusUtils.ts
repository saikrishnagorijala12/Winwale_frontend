// src/constants/status.ts
import { StatusMapItem } from "../types/client.types";

export const STATUS_MAP: StatusMapItem[] = [
  { label: "Pending", slug: "pending" },
  { label: "Active", slug: "active" },
  { label: "Inactive", slug: "inactive" },
  { label: "Approved", slug: "approved" },
  { label: "Rejected", slug: "rejected" },
];

export const getStatusLabel = (status: string): string => {
  return (
    STATUS_MAP.find((item) => item.slug === status)?.label || "Unknown"
  );
};

export const normalizeStatus = (status?: string): string => {
  if (!status) return "Unknown";

  const normalized = status.toLowerCase();

  return STATUS_MAP.some((item) => item.slug === normalized)
    ? normalized
    : "Unknown";
};



export const getStatusStyles = (slug: string): string => {
  switch (slug) {
    case "active":
      return "bg-[#DCFCE7] text-[#15803D]";
    case "pending":
      return "bg-[#FEF9C3] text-[#A16207]";
    case "inactive":
      return "bg-[#E5E7EB] text-[#374151]";
    case "approved":
      return "bg-[#DBEAFE] text-[#1D4ED8]";
    case "rejected":
      return "bg-[#FEE2E2] text-[#B91C1C]";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
