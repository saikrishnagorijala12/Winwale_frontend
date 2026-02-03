import { Check } from "lucide-react";
import { Step, WorkflowStep } from "@/src/types/document.types";
import { useDocument } from "@/src/context/DocumentContext";

const steps: Step[] = [
  {
    id: "select-type",
    label: "Select Type",
    description: "Choose document type",
  },
  {
    id: "load-config",
    label: "Load Config",
    description: "Fetch configuration",
  },
  {
    id: "form-entry",
    label: "Enter Data",
    description: "Complete required fields",
  },
  { id: "preview", label: "Preview", description: "Review document" },
];

const stepOrder: WorkflowStep[] = [
  "select-type",
  "load-config",
  "form-entry",
  "preview",
];

export const WorkflowStepper = () => {
  const { currentStep } = useDocument();
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => {
            const isComplete = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center min-w-[120px] group">
                  <div
                    className={`
                      w-11 h-11 rounded-full flex items-center justify-center
                      text-sm font-semibold
                      transition-all duration-300 ease-out
                      ${
                        isComplete
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md"
                          : isActive
                          ? "text-white ring-4 shadow-lg scale-105"
                          : "bg-white border border-slate-300 text-slate-400"
                      }
                      group-hover:scale-105
                    `}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, #38A1DB 0%, #2F8FC5 100%)",
                            boxShadow: "0 0 0 4px rgba(56, 161, 219, 0.25)",
                          }
                        : undefined
                    }
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : index + 1}
                  </div>

                  <div className="mt-4 text-center">
                    <p
                      className={`text-sm font-semibold tracking-wide ${
                        isActive
                          ? "text-[#38A1DB]"
                          : isComplete
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div className="relative h-[3px] rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: isComplete ? "100%" : "0%",
                          background: isComplete
                            ? "linear-gradient(to right, #38A1DB, #2F8FC5)"
                            : undefined,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
