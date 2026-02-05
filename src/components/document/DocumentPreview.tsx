import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Edit3,
} from "lucide-react";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
} from "docx";

import { saveAs } from "file-saver";
import { useDocument } from "@/src/context/DocumentContext";
import { DocumentBodyRenderer } from "./DocumentBodyRenderer";

export const DocumentPreview = () => {
  const { documentConfig, formData, setCurrentStep, validationErrors, resetWorkflow } =
    useDocument();

  const previewRef = useRef<HTMLDivElement>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showReDownloadModal, setShowReDownloadModal] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  // Dashboard Color Palette
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
    if (!previewRef.current) return;
    setIsGenerating(true);

    try {
      const logoBuffer = await fetchImageBuffer("/winvale-logo.png");
      const logoParagraph = new Paragraph({
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 120, height: 60 },
          }),
        ],
        alignment: AlignmentType.RIGHT,
      });

      const text = previewRef.current.innerText;
      const lines = text.split("\n").filter(Boolean);

      const contentParagraphs = lines.map(
        (line) =>
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                font: "Times New Roman",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          })
      );

      const doc = new Document({
        sections: [{ children: [logoParagraph, ...contentParagraphs] }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${documentConfig.name}.docx`);
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
    <div className="min-h-screen p-6 lg:p-10 animate-fade-in" style={{ backgroundColor: colors.bg }}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: colors.fg }}>
            Document Preview
          </h1>
          <p className="font-medium" style={{ color: colors.muted }}>
            Review your generated content and field values before final export.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep("form-entry")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold transition-all hover:bg-slate-50 active:scale-95 hover:text-slate-900"
        >
          <Edit3 className="w-4 h-4" />
          Edit Values
        </button>
      </div>

      {/* Validation Warning */}
      {!isValid && (
        <div
          className="flex items-center gap-4 p-4 mb-8 rounded-2xl border animate-slide-up"
          style={{ backgroundColor: `${colors.destructive}0D`, borderColor: `${colors.destructive}40` }}
        >
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <AlertTriangle className="w-5 h-5" style={{ color: colors.destructive }} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold" style={{ color: colors.fg }}>
            Warning: Some required fields are missing or invalid. Please fix them before generating.
          </span>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Left: Field Values (2/5 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-transparent overflow-hidden animate-slide-up">
          <div className="px-6 py-5 border-b" style={{ backgroundColor: colors.secondaryBg, borderColor: colors.border }}>
            <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: colors.muted }}>
              Field Summary
            </h3>
          </div>

          <div className="p-6 max-h-[1155px] overflow-y-auto">
            <div className="space-y-4">
              {documentConfig.fields.map((field) => (
                <div key={field.id} className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.muted }}>
                    {field.label}
                  </p>
                  <p className="text-sm font-bold truncate" style={{ color: colors.fg }}>
                    {formData[field.id] || <span className="opacity-30">—</span>}
                  </p>
                  <div className="h-px w-full mt-3" style={{ backgroundColor: colors.bg }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Document Preview (3/5 width) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-transparent overflow-hidden animate-slide-up">
          <div className="px-8 py-5 border-b flex items-center gap-3" style={{ backgroundColor: colors.secondaryBg, borderColor: colors.border }}>
            <FileText className="w-5 h-5 text-[#3399cc]" />
            <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: colors.muted }}>
              Live Preview
            </h3>
          </div>

          <div className="p-8 bg-slate-100/50">
            <div
              ref={previewRef}
              className="bg-white  mx-auto rounded-sm border border-slate-200 p-12 min-h-[800px] w-full max-w-[900px] text-slate-800"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              <DocumentBodyRenderer
                documentId={documentConfig.id}
                data={{
                  ...formData,
                  submissionDate: new Date().toLocaleDateString("en-US"),
                  gsaOfficeCityStateZip: `${formData.gsaOfficeCity || ""}, ${formData.gsaOfficeState || ""} ${formData.gsaOfficeZip || ""}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-10 flex items-center justify-between pb-10 animate-slide-up">
        {isConfirmed ? (
          <div className="flex gap-4">
            <button
              onClick={resetWorkflow}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" strokeWidth={3} />
              Generate Another
            </button>
            <div className="flex items-center gap-2 text-green-600 font-bold animate-fade-in px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              <span>Document Ready!</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCurrentStep("form-entry")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold transition-all hover:bg-slate-50 active:scale-95 shadow-sm hover:text-slate-900"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
            Back to Form
          </button>
        )}

        <button
          onClick={() => isConfirmed ? downloadDOCX() : setShowConfirmModal(true)}
          disabled={isGenerating}
          className="btn-primary"
        >
          {isGenerating ? (
            "Processing..."
          ) : (
            <>
              <Download className="w-4 h-4" strokeWidth={3} />
              {isConfirmed ? "Download Final DOCX" : "Generate Document"}
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#3399cc]" />
              <h2 className="text-lg font-bold text-slate-900">
                Ready to generate?
              </h2>
            </div>

            <p className="text-sm text-slate-600">
              Please ensure all field values are accurate. This will finalize the formatting and prepare your download.
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
                onClick={() => {
                  setIsConfirmed(true);
                  setShowConfirmModal(false);
                }}
              >
                Confirm & Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-Download Confirmation Modal */}
      {showReDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Download Again?
              </h2>
            </div>

            <p className="text-sm text-slate-600">
              You have already downloaded this document recently. Would you like to download a new copy?
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