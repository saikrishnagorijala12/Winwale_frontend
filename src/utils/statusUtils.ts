import {
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";


export type StatusSlug =
  | "pending"
  | "active"
  | "inactive"
  | "approved"
  | "rejected";

export type StatusConfig = {
  slug: StatusSlug;
  label: string;
  styles: string;
  icon: LucideIcon;
};


export const STATUS_BADGE_BASE =
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border";


export const STATUS_MAP: Record<StatusSlug, StatusConfig> = {
  pending: {
    slug: "pending",
    label: "Pending",
    styles: "bg-orange-50 text-orange-600 border-orange-100",
    icon: Clock,
  },
  active: {
    slug: "active",
    label: "Active",
    styles: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    icon: PlayCircle,
  },
  inactive: {
    slug: "inactive",
    label: "Inactive",
    styles: "bg-[#E5E7EB] text-[#374151] border-[#D1D5DB]",
    icon: PauseCircle,
  },
  approved: {
    slug: "approved",
    label: "Approved",
    styles: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle2,
  },
  rejected: {
    slug: "rejected",
    label: "Rejected",
    styles: "bg-rose-50 text-rose-600 border-rose-100",
    icon: XCircle,
  },
};


export const normalizeStatus = (status?: string): StatusSlug | "unknown" => {
  if (!status) return "unknown";

  const normalized = status.toLowerCase() as StatusSlug;
  return normalized in STATUS_MAP ? normalized : "unknown";
};

export const getStatusLabel = (status: string): string => {
  const slug = normalizeStatus(status);
  return slug === "unknown" ? "Unknown" : STATUS_MAP[slug].label;
};

export const getStatusStyles = (status: string): string => {
  const slug = normalizeStatus(status);
  return slug === "unknown"
    ? "bg-slate-100 text-slate-700 border-slate-200"
    : STATUS_MAP[slug].styles;
};
