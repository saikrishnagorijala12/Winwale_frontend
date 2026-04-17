import React from "react";
import { Check } from "lucide-react";
import { Step } from "../../types/analysis.types";

interface AnalysisStepperProps {
    steps: Step[];
    currentStep: number;
}

export const AnalysisStepper = ({ steps, currentStep }: AnalysisStepperProps) => {
    return (
        <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white shadow-sm overflow-x-auto custom-scrollbar">
            {steps.map((step) => (
                <div key={step.id} className="flex items-center shrink-0">
                    <div
                        className={`h-8 sm:h-10 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 rounded-3xl transition-all ${currentStep === step.id
                                ? "bg-[#3399cc] text-white shadow-lg"
                                : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border ${currentStep === step.id ? "border-white/30" : "border-slate-200"
                                }`}
                        >
                            {currentStep > step.id ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : step.id}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest hidden sm:block">
                            {step.title}
                        </p>
                    </div>
                    {step.id < 4 && <div className="w-4 h-px bg-slate-200 mx-1" />}
                </div>
            ))}
        </div>
    );
};
