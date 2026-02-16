import React from "react";
import { Check } from "lucide-react";
import { Step } from "../../types/pricelist.types";

interface AnalysisStepperProps {
    steps: Step[];
    currentStep: number;
}

export const AnalysisStepper = ({ steps, currentStep }: AnalysisStepperProps) => {
    return (
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white shadow-sm overflow-x-auto">
            {steps.map((step) => (
                <div key={step.id} className="flex items-center shrink-0">
                    <div
                        className={`h-10 px-4 flex items-center gap-3 rounded-3xl transition-all ${currentStep === step.id
                                ? "bg-[#3399cc] text-white shadow-lg"
                                : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${currentStep === step.id ? "border-white/30" : "border-slate-200"
                                }`}
                        >
                            {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
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
