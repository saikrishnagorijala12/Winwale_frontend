import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FormStepperProps {
  currentStep: number;
  steps: string[];
}

export const FormStepper: React.FC<FormStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 border-b border-slate-200 shrink-0">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const active = currentStep >= stepNum;
        const completed = currentStep > stepNum;

        return (
          <div key={stepNum} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  active
                    ? "bg-[#38A1DB] text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {completed ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
              </div>
              <span
                className={`font-semibold ${
                  active ? "text-[#38A1DB]" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-1 rounded-full ${
                  completed ? "bg-[#38A1DB]" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};