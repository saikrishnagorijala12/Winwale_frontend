import { useState, useRef } from "react";
import { useDocument } from "@/src/context/DocumentContext";
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  FileDown,
  ChevronLeft,
  Loader2,
  Clock,
  User,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DocumentMetadata,
  resolveTemplateType,
} from "@/src/types/document.types";
import { AdditionTemplate } from "../templates/AdditionTemplate";
import { DeletionTemplate } from "../templates/DeletionTemplate";
import { PriceIncreaseEpaTemplate } from "../templates/PriceIncreaseEpaTemplate";





const resolveTemplate = (templateId: string, data: any) => {
  switch (templateId) {
    case 'addition':
      console.log('adedd');

      return <AdditionTemplate data={data} />;
    case 'deletion':
      return <DeletionTemplate data={data} />;
    case 'price-increase-epa':
      return <PriceIncreaseEpaTemplate data={data} />;
    default:
      return null;
  }
};
export const GenerationConfirmation = () => {
  const navigate = useNavigate();
  const {
    documentConfig,
    formData,
    generateDocument,
    addToHistory,
    resetWorkflow,
    setCurrentStep,
  } = useDocument();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<"pdf" | "doc" | null>(
    null
  );
  const [generatedDoc, setGeneratedDoc] =
    useState<DocumentMetadata | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  if (!documentConfig) return null;

  const templateType = resolveTemplateType(documentConfig.id);

  /* -------------------------------
     Handlers
  -------------------------------- */

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));

    const doc = generateDocument();
    setGeneratedDoc(doc);
    addToHistory(doc);
    setIsGenerating(false);
  };

  const handleDownload = async (format: "pdf" | "doc") => {
    if (!generatedDoc || !documentConfig) return;

    setIsDownloading(format);

    try {
      toast.success(
        `${format.toUpperCase()} downloaded successfully!`
      );
    } catch (err) {
      console.error(err);
      toast.error(`Failed to download ${format.toUpperCase()}`);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText("Share link copied");
    alert("Share link copied to clipboard!");
  };

  // const handleApprove = () => {
  //   if (!generatedDoc) return;
  //   setGeneratedDoc({ ...generatedDoc, status: "approved" as const });
  //   setIsApproved(true);
  // };

  const handleNewDocument = () => {
    resetWorkflow();
    navigate("/documents");
  };

  /* -------------------------------
     UI
  -------------------------------- */

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* SINGLE SOURCE TEMPLATE (PDF / DOC) */}
      <div
        id="document-preview-content"
        ref={previewRef}
        className="fixed left-[-9999px] top-0 w-[794px] bg-white text-black"
      >
        {templateType &&
          resolveTemplate(templateType, {
            ...formData,
            ...generatedDoc,
          })}
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          {generatedDoc ? "Document Generated" : "Generate Document"}
        </h2>
        <p className="text-muted-foreground">
          {generatedDoc
            ? "Your document has been successfully created."
            : "Confirm generation to create your document files."}
        </p>
      </div>

      {!generatedDoc ? (
        /* PRE-GENERATION */
        <div className="border rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>

          <h3 className="text-xl font-semibold mb-6">
            {documentConfig.name}
          </h3>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentStep("preview")}
              className="flex items-center gap-2 border rounded px-5 py-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Preview
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 text-white rounded px-6 py-2 transition-all ${isGenerating
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#3399cc] hover:bg-[#2980b9] shadow-md hover:shadow-lg'
                }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Generate Document
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* POST-GENERATION */
        <div className="space-y-6">
          {/* Success */}
          <div className="border border-green-300 bg-green-50 rounded-lg p-6 flex items-center gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-700">
                Document Successfully Generated
              </h3>
              <p className="text-sm text-green-600">
                Ready for download and distribution.
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Document Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {generatedDoc.id}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {generatedDoc.version}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {generatedDoc.generatedBy}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(generatedDoc.generatedAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-4">
              Status:{" "}
              <span className="font-medium">
                {isApproved ? "Approved" : "Generated"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleDownload("pdf")}
              disabled={isDownloading !== null}
              className="border rounded py-4 flex flex-col items-center gap-2"
            >
              {isDownloading === "pdf" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download />
              )}
              Download PDF
            </button>

            <button
              onClick={() => handleDownload("doc")}
              disabled={isDownloading !== null}
              className="border rounded py-4 flex flex-col items-center gap-2"
            >
              {isDownloading === "doc" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download />
              )}
              Download DOC
            </button>

            <button
              onClick={handleShare}
              className="border rounded py-4 flex flex-col items-center gap-2"
            >
              <Share2 />
              Share
            </button>

            {/* <button
              onClick={handleApprove}
              disabled={isApproved}
              className={`border rounded py-4 flex flex-col items-center gap-2 ${
                isApproved ? "bg-green-50 text-green-700" : ""
              }`}
            >
              <CheckCircle2 />
              {isApproved ? "Approved" : "Approve"}
            </button> */}
          </div>

          {/* Generate More Documents Confirmation */}
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Would you like to generate another document?
              </h3>
              <p className="text-sm text-slate-500">
                You can create additional modification documents or return to the dashboard
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleNewDocument}
                className="flex items-center justify-center gap-2 bg-[#3399cc] hover:bg-[#2980b9] text-white rounded-lg px-6 py-3 font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <FileText className="w-5 h-5" />
                Generate Another Document
              </button>

              <button
                onClick={() => navigate("/analysis-history")}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg px-6 py-3 font-semibold transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
