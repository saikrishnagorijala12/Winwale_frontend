import React from "react";
import { ArrowRight } from "lucide-react";
import { ModificationAction } from "../../types/analysis.types";
import { AnalysisResultsViewer } from "../analysis/AnalysisResultsViewer";

interface ReviewResultsStepProps {
    actions: ModificationAction[];
    actionSummary: Record<string, number>;
    totalActions: number;
    totalPages: number;
    currentPage: number;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onPageChange: (page: number) => void;
    onExport: () => Promise<void>;
    onReset: () => void;
    onGenerateDocuments: () => void;
    isLoading?: boolean;
}

export const ReviewResultsStep = ({
    actions,
    actionSummary,
    totalActions,
    totalPages,
    currentPage,
    activeTab,
    onTabChange,
    onPageChange,
    onExport,
    onReset,
    onGenerateDocuments,
    isLoading = false,
}: ReviewResultsStepProps) => {
    return (
        <div className="space-y-6">
            <AnalysisResultsViewer
                actions={actions}
                actionSummary={actionSummary}
                totalActions={totalActions}
                totalPages={totalPages}
                currentPage={currentPage}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onPageChange={onPageChange}
                onExport={onExport}
                isLoading={isLoading}
            />

            <div className="flex justify-between items-center pt-4">
                <button
                    onClick={onReset}
                    className="btn-secondary"
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

