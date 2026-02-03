import { useDocument } from "@/src/context/DocumentContext";
import { DocumentTypeSelector } from "../components/document/DocumentTypeSelector";
import DocumentFormRenderer from "../components/document/DocumentFormRenderer";
import { DocumentPreview } from "../components/document/DocumentPreview";
import { GenerationConfirmation } from "../components/document/GenerationConfirmation";
import { WorkflowStepper } from "../components/document/WorkflowStepper";
import { Loader2 } from "lucide-react";

export const DocumentWorkflowRenderer = () => {
  const { currentStep } = useDocument();

  switch (currentStep) {
    case "select-type":
      return <DocumentTypeSelector />;

    case "load-config":
      return (
            <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin m-auto top-50 text-[#38A1DB]" />
          </div>
      );

    case "form-entry":
      return <DocumentFormRenderer />;

    case "preview":
      return <DocumentPreview />;

    case "generate":
      return <GenerationConfirmation />;

    default:
      return <DocumentTypeSelector />;
  }
};
