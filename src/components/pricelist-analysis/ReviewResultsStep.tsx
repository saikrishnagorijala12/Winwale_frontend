import React from "react";
import { ArrowRight } from "lucide-react";
import { CategorizedActions } from "../../types/pricelist.types";
import { AnalysisResultsViewer } from "../analysis/AnalysisResultsViewer";

interface ReviewResultsStepProps {
    categorized: CategorizedActions;
    onExport: () => void;
    onReset: () => void;
    onGenerateDocuments: () => void;
}

export const ReviewResultsStep = ({
    categorized,
    onExport,
    onReset,
    onGenerateDocuments,
}: ReviewResultsStepProps) => {
    return (
        <div className="space-y-6">
            <AnalysisResultsViewer
                categorized={categorized}
                onExport={onExport}
            />

            <div className="flex justify-between items-center pt-4">
                <button
                    onClick={onReset}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    Start New Analysis
                </button>
                <button onClick={onGenerateDocuments} className="btn-primary">
                    Generate Documents <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

