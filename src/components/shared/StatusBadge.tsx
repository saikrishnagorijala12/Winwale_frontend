import React from "react";
import {
    STATUS_MAP,
    STATUS_BADGE_BASE,
    normalizeStatus,
} from "../../utils/statusUtils";

interface StatusBadgeProps {
    status: string;
}

/**
 * Renders a status badge pill using the shared STATUS_MAP config.
 * Works for: pending, active, inactive, approved, rejected.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const slug = normalizeStatus(status);
    const config = slug !== "unknown" ? STATUS_MAP[slug] : null;
    const styles =
        slug !== "unknown"
            ? STATUS_MAP[slug].styles
            : "bg-slate-100 text-slate-700 border-slate-200";
    const Icon = config?.icon;
    const label = config?.label ?? "Unknown";

    return (
        <span className={`${STATUS_BADGE_BASE} ${styles}`}>
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </span>
    );
};

export default StatusBadge;
