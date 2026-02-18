import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    ImageRun,
} from "docx";
import { saveAs } from "file-saver";
 
export const convertTiptapToDocx = async (json: any, options: { logoUrl?: string, fileName: string }) => {
    const children: any[] = [];
 
    // Add Logo if provided
    if (options.logoUrl) {
        try {
            const response = await fetch(options.logoUrl);
            const buffer = await response.arrayBuffer();
            children.push(
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: buffer,
                            transformation: { width: 120, height: 60 },
                        } as any),
                    ],
                    alignment: AlignmentType.RIGHT,
                })
            );
        } catch (e) {
            console.error("Failed to load logo for DOCX", e);
        }
    }
 
    const processNode = (node: any) => {
        if (node.type === "paragraph") {
            const textRuns = (node.content || []).map((child: any) => {
                if (child.type === "text") {
                    return new TextRun({
                        text: child.text,
                        bold: child.marks?.some((m: any) => m.type === "bold"),
                        italics: child.marks?.some((m: any) => m.type === "italic"),
                        underline: child.marks?.some((m: any) => m.type === "underline") ? {} : undefined,
                        font: "Times New Roman",
                        size: 24, 
                    });
                } else if (child.type === "hardBreak") {
                    return new TextRun({ break: 1 });
                }
                return null;
            }).filter(Boolean);
 
            children.push(
                new Paragraph({
                    children: textRuns,
                    spacing: { after: 240, line: 360 }, 
                })
            );
        } else if (node.type === "bulletList" || node.type === "orderedList") {
            node.content?.forEach((listItem: any) => {
                if (listItem.type === "listItem") {
                    listItem.content?.forEach((paragraphNode: any) => {
                        if (paragraphNode.type === "paragraph") {
                            const textRuns = (paragraphNode.content || []).map((child: any) => {
                                if (child.type === "text") {
                                    return new TextRun({
                                        text: child.text,
                                        bold: child.marks?.some((m: any) => m.type === "bold"),
                                        italics: child.marks?.some((m: any) => m.type === "italic"),
                                        underline: child.marks?.some((m: any) => m.type === "underline") ? {} : undefined,
                                        font: "Times New Roman",
                                        size: 24,
                                    });
                                } else if (child.type === "hardBreak") {
                                    return new TextRun({ break: 1 });
                                }
                                return null;
                            }).filter(Boolean);
 
                            children.push(
                                new Paragraph({
                                    children: textRuns,
                                    bullet: node.type === "bulletList" ? { level: 0 } : undefined,
                                    numbering: node.type === "orderedList" ? { reference: "primary-numbering", level: 0 } : undefined,
                                    spacing: { after: 120, line: 360 },
                                })
                            );
                        }
                    });
                }
            });
        } else if (node.type === "heading") {
            const textRuns = (node.content || []).map((child: any) => {
                if (child.type === "text") {
                    return new TextRun({
                        text: child.text,
                        bold: true,
                        font: "Times New Roman",
                        size: 32 - (node.attrs.level * 2), 
                    });
                }
                return null;
            }).filter(Boolean);
            children.push(new Paragraph({ children: textRuns, spacing: { before: 240, after: 120 } }));
        }
    };
 
    json.content?.forEach(processNode);
 
    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: "primary-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "lowerLetter",
                            text: "%1)",
                            alignment: AlignmentType.LEFT,
                        },
                    ],
                },
            ],
        },
        sections: [{ children }],
    });
 
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${options.fileName}.docx`);
};
 