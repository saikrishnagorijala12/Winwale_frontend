import { useDocument } from "@/src/context/DocumentContext";
import { DocumentTypeCard } from "../components/document/DocumentTypeSelector";
import DocumentFormRenderer from "../components/document/DocumentFormRenderer";
import { DocumentPreview } from "../components/document/DocumentPreview";
import { Loader2 } from "lucide-react";
import { documentConfigs } from "../types/documentConfigs";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAnalysis } from "../context/AnalysisContext";

export const DocumentWorkflowRenderer = () => {
  const {
    currentStep,
    selectedDocumentType,
    loadDocumentConfig,
    setCurrentStep,
    analysisSummary,
  } = useDocument();

  const [searchParams] = useSearchParams();
  const { selectedJobId, setSelectedJobId } = useAnalysis();
  const urlJobId = searchParams.get("job_id");
  const jobId = urlJobId ? Number(urlJobId) : selectedJobId;

  useEffect(() => {
    if (urlJobId && Number(urlJobId) !== selectedJobId) {
      setSelectedJobId(Number(urlJobId));
    }
  }, [urlJobId, selectedJobId, setSelectedJobId]);

  useEffect(() => {
    if (!selectedDocumentType && documentConfigs.length > 0) {
      loadDocumentConfig(documentConfigs[0].id, jobId || undefined);
      setCurrentStep("form-entry");
    }
  }, [selectedDocumentType, loadDocumentConfig, jobId, setCurrentStep]);

  const handleSelect = (configId: string) => {
    loadDocumentConfig(configId, jobId || undefined);
    setCurrentStep("form-entry");
  };

  const getModificationMessage = () => {
    if (!jobId || !selectedDocumentType || !analysisSummary) return null;

    const counts: Record<string, number> = {
      "add-product": Number(analysisSummary.products_added || 0),
      "delete-product": Number(analysisSummary.products_deleted || 0),
      "price-increase": Number(analysisSummary.price_increased || 0),
      "price-decrease": Number(analysisSummary.price_decreased || 0),
      "description-change": Number(analysisSummary.description_changed || 0),
    };

    const count = counts[selectedDocumentType];
    if (count === 0) {
      const names: Record<string, string> = {
        "add-product": "additions",
        "delete-product": "deletions",
        "price-increase": "price increases",
        "price-decrease": "price decreases",
        "description-change": "description changes",
      };
      return `No ${names[selectedDocumentType] || "modifications"} were detected in the analysis for this document type.`;
    }
    return null;
  };

  const modificationMessage = getModificationMessage();

  if (currentStep === "preview") {
    return <DocumentPreview />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8 animate-fade-in">
      <div className="mx-auto  space-y-10">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Generate Documents
          </h1>
          <p className="text-slate-500 font-medium">
            Select a document type to pre-fill and generate
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {documentConfigs.map((config) => {
            const counts: Record<string, number> = {
              "add-product": Number(analysisSummary?.products_added || 0),
              "delete-product": Number(analysisSummary?.products_deleted || 0),
              "price-increase": Number(analysisSummary?.price_increased || 0),
              "price-decrease": Number(analysisSummary?.price_decreased || 0),
              "description-change": Number(analysisSummary?.description_changed || 0),
            };

            return (
              <DocumentTypeCard
                key={config.id}
                config={config}
                isSelected={selectedDocumentType === config.id}
                onSelect={() => handleSelect(config.id)}
                count={analysisSummary ? (counts[config.id] ?? 0) : undefined}
                variant="horizontal"
              />
            );
          })}
        </div>

        <div className="pt-2">
          {currentStep === "load-config" ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin m-auto text-[#24548f]" />
              <p className="text-sm text-slate-500 font-medium">
                Loading configuration...
              </p>
            </div>
          ) : modificationMessage ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm animate-fade-in">
              {/* <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center m-auto mb-6 border border-slate-100 shadow-inner">
                <span className="text-3xl">info</span>
              </div> */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No Modifications Found
              </h3>
              <p className="text-slate-500 font-medium max-w-md m-auto px-6 whitespace-pre-line">
                {modificationMessage}
              </p>
            </div>
          ) : (
            <DocumentFormRenderer />
          )}
        </div>
      </div>
    </div>
  );
};
