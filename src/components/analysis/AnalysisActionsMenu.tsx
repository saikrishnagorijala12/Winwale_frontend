// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, CheckCircle2, XCircle, Loader2, FileText } from "lucide-react";
// import { normalizeStatus } from "../../utils/statusUtils";

// interface AnalysisActionsMenuProps {
//   item: any;
//   updatingId: number | null;
//   onUpdateStatus: (jobId: number, action: "approve" | "reject") => void;
//   onClose: () => void;
// }

// export default function AnalysisActionsMenu({
//   item,
//   updatingId,
//   onUpdateStatus,
//   onClose,
// }: AnalysisActionsMenuProps) {
//   const navigate = useNavigate();
//    const handleGenerate = (jobId: any) => {
//     navigate(`/documents?job_id=${jobId}`);
//   };
//   return (
//     <div
//       className="absolute right-12 top-4 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-100"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           navigate(`/analyses/${item.job_id}`);
//         }}
//         className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
//       >
//         <Eye className="w-4 h-4 text-slate-400" />
//         View Details
//       </button>
//       {/* <button
//         onClick={(e) => {
//           e.stopPropagation();
//           handleGenerate(item.job_id);
//         }}
//         className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
//       >
//         <FileText className="w-4 h-4 text-slate-400" />
//         Generate Docs
//       </button> */}

//       {normalizeStatus(item.status) === "pending" && (
//         <>
//           <div className="my-1 border-t border-slate-100" />
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onUpdateStatus(item.job_id, "approve");
//               onClose();
//             }}
//             disabled={updatingId === item.job_id}
//             className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold disabled:opacity-50"
//           >
//             {updatingId === item.job_id ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <CheckCircle2 className="w-4 h-4" />
//             )}
//             Approve Analysis
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onUpdateStatus(item.job_id, "reject");
//               onClose();
//             }}
//             disabled={updatingId === item.job_id}
//             className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold disabled:opacity-50"
//           >
//             {updatingId === item.job_id ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <XCircle className="w-4 h-4" />
//             )}
//             Reject Analysis
//           </button>
//         </>
//       )}
//     </div>
//   );
// }
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { normalizeStatus } from "../../utils/statusUtils";
import { AnalysisJob } from "../../types/analysis.types";
import { useAnalysis } from "../../context/AnalysisContext";

interface AnalysisActionsMenuProps {
  item: AnalysisJob;
  updatingId: number | null;
  onUpdateStatus: (jobId: number, action: "approve" | "reject") => void;
  onClose: () => void;
  openUpwards?: boolean;
}

export default function AnalysisActionsMenu({
  item,
  updatingId,
  onUpdateStatus,
  onClose,
  openUpwards = false,
}: AnalysisActionsMenuProps) {
  const navigate = useNavigate();
  const { setSelectedJobId } = useAnalysis();
  const handleGenerate = (jobId: any) => {
    navigate(`/documents?job_id=${jobId}`);
  };

  return (
    <div
      className={`absolute right-12 ${openUpwards ? "bottom-4" : "top-4"
        } w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-100`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/analyses/details?id=${item.job_id}`);
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
      >
        <Eye className="w-4 h-4 text-slate-400" />
        View Details
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleGenerate(item.job_id);
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
      >
        <FileText className="w-4 h-4 text-slate-400" />
        Generate Docs
      </button>

      {normalizeStatus(item.status) === "pending" && (
        <>
          <div className="my-1 border-t border-slate-100" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(item.job_id, "approve");
              onClose();
            }}
            disabled={updatingId === item.job_id}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold disabled:opacity-50"
          >
            {updatingId === item.job_id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Approve Analysis
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(item.job_id, "reject");
              onClose();
            }}
            disabled={updatingId === item.job_id}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold disabled:opacity-50"
          >
            {updatingId === item.job_id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Reject Analysis
          </button>
        </>
      )}
    </div>
  );
}