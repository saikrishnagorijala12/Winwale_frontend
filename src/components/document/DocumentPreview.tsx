import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Edit3,
} from "lucide-react";

import { useDocument } from "@/src/context/DocumentContext";
import { DocumentBodyRenderer } from "./DocumentBodyRenderer";
import { RichTextEditor } from "./RichTextEditor";
import { convertTiptapToDocx } from "../../utils/documentExportUtils";

export const DocumentPreview = () => {
  const {
    documentConfig,
    formData,
    setCurrentStep,
    validationErrors,
    resetWorkflow,
  } = useDocument();

  const previewRef = useRef<HTMLDivElement>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showReDownloadModal, setShowReDownloadModal] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const [editorJson, setEditorJson] = useState<any>(null);
  const [initialContent, setInitialContent] = useState<string>("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (previewRef.current) {
        setInitialContent(previewRef.current.innerHTML);
        setIsEditorReady(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const colors = {
    bg: "#f5f7f9",
    fg: "#1b2531",
    primary: "#24548f",
    muted: "#627383",
    border: "#d9e0e8",
    success: "#33b17d",
    warning: "#f9ab20",
    destructive: "#df3a3a",
    secondaryBg: "#f8fafc",
  };

  if (!documentConfig) return null;

  const isValid = validationErrors.length === 0;

  const fetchImageBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    return response.arrayBuffer();
  };

  const performDownload = async () => {
    if (!editorJson) return;
    setIsGenerating(true);

    try {
      await convertTiptapToDocx(editorJson, {
        logoUrl: "/logo.png",
        fileName: documentConfig.name,
      });
      setHasDownloaded(true);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDOCX = () => {
    if (hasDownloaded) {
      setShowReDownloadModal(true);
    } else {
      performDownload();
    }
  };

  return (
    <div
      className="min-h-screen p-6 lg:p-10 animate-fade-in"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
        <div className="space-y-1">
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: colors.fg }}
          >
            Document Preview
          </h1>
          <p className="font-medium" style={{ color: colors.muted }}>
            Review the generated content and field values before final export.
          </p>
        </div>
      </div>

      {/* Validation Warning */}
      {!isValid && (
        <div
          className="flex items-center gap-4 p-4 mb-8 rounded-2xl border animate-slide-up"
          style={{
            backgroundColor: `${colors.destructive}0D`,
            borderColor: `${colors.destructive}40`,
          }}
        >
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <AlertTriangle
              className="w-5 h-5"
              style={{ color: colors.destructive }}
              strokeWidth={2.5}
            />
          </div>
          <span className="text-sm font-bold" style={{ color: colors.fg }}>
            Warning: Some required fields are missing or invalid. Please fix
            them before generating.
          </span>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: Field Values (2/5 width) */}
        <div className="lg:col-span-2 bg-white  shadow-sm border border-transparent overflow-hidden animate-slide-up">
          <div
            className="px-6 py-5.5 border-b"
            style={{
              backgroundColor: colors.secondaryBg,
              borderColor: colors.border,
            }}
          >
            <h3
              className="text-sm font-black uppercase tracking-widest"
              style={{ color: colors.muted }}
            >
              Field Summary
            </h3>
          </div>

          <div className="p-6 max-h-288.75 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentConfig.fields.map((field) => (
                <div key={field.id} className="group">
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: colors.muted }}
                  >
                    {field.label}
                  </p>

                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: colors.fg }}
                  >
                    {formData[field.id] || (
                      <span className="opacity-30">—</span>
                    )}
                  </p>

                  <div
                    className="h-px w-full mt-3"
                    style={{ backgroundColor: colors.bg }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Document Preview (3/5 width) */}
        <div className="lg:col-span-3 bg-white shadow-sm border border-transparent overflow-hidden animate-slide-up">
          <div
            className="px-8 py-3 border-b flex items-center justify-between gap-3"
            style={{
              backgroundColor: colors.secondaryBg,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3399cc]" />
              <h3
                className="text-sm font-black uppercase tracking-widest"
                style={{ color: colors.muted }}
              >
                Preview
              </h3>
            </div>
            <button
              onClick={() => setIsEditingContent(!isEditingContent)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all active:scale-95 font-bold text-sm shadow-sm
            ${
              isEditingContent
                ? "btn-primary"
                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            }`}
            >
              {isEditingContent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Done
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>

          <div className="p-0 relative">
            {!isEditorReady && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24548f]" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Preparing Editor...
                  </p>
                </div>
              </div>
            )}

            {/* Hidden renderer to capture initial HTML */}
            <div ref={previewRef} className="hidden">
              <DocumentBodyRenderer
                documentId={documentConfig.id}
                data={{
                  ...formData,
                  submissionDate: new Date().toLocaleDateString("en-US"),
                  gsaOfficeCityStateZip: `${formData.gsaOfficeCity || ""}, ${formData.gsaOfficeState || ""}, ${formData.gsaOfficeZip || ""}`,
                }}
              />
            </div>

            {isEditorReady && initialContent && (
              <RichTextEditor
                content={initialContent}
                onChange={(json) => setEditorJson(json)}
                editable={isEditingContent}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-10 flex items-center justify-between pb-10 animate-slide-up">
        <button
          onClick={() => setCurrentStep("form-entry")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold transition-all hover:bg-slate-50 active:scale-95 shadow-sm hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          Back to Form
        </button>

        <button
          onClick={() =>
            isConfirmed ? downloadDOCX() : setShowConfirmModal(true)
          }
          disabled={isGenerating || isEditingContent}
          className="btn-primary"
        >
          {isGenerating ? (
            "Processing..."
          ) : (
            <>
              <Download className="w-4 h-4" strokeWidth={3} />
              Download Cover Letter
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3399cc]" />
              <h2 className="text-lg font-bold text-slate-900">
                Ready to generate ?
              </h2>
            </div>

            <p className="text-sm text-slate-600">
              Please ensure all field values are accurate. This will finalize
              the formatting and download the document.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#3399cc] text-white hover:bg-[#287ab0] transition-colors"
                onClick={async () => {
                  setShowConfirmModal(false);
                  setIsConfirmed(true);
                  await performDownload();
                }}
              >
                Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-Download Confirmation Modal */}
      {showReDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Download Again?
              </h2>
            </div>

            <p className="text-sm text-slate-600">
              You have already downloaded this document recently. Would you like
              to download a new copy?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setShowReDownloadModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                onClick={() => {
                  setShowReDownloadModal(false);
                  performDownload();
                }}
              >
                Yes, Download Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
