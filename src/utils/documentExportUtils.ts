import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  Header,
} from "docx";
import { saveAs } from "file-saver";

export const convertTiptapToDocx = async (
  json: any,
  options: { logoUrl?: string; fileName: string },
) => {
  const children: any[] = [];
  let header: Header | undefined;

  if (options.logoUrl) {
    try {
      const response = await fetch(options.logoUrl, {
        cache: "reload",
      });

      if (!response.ok) {
        throw new Error(`Logo fetch failed with status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");

      let imageType: "png" | "jpg" | "gif";

      if (contentType?.includes("png")) imageType = "png";
      else if (contentType?.includes("jpeg")) imageType = "jpg";
      else if (contentType?.includes("gif")) imageType = "gif";
      else imageType = "png";

      const buffer = await response.arrayBuffer();

      // Create a temporary image to read natural size
      const blob = new Blob([buffer]);
      const imageBitmap = await createImageBitmap(blob);

      const naturalWidth = imageBitmap.width;
      const naturalHeight = imageBitmap.height;

      const maxWidth = 120;
      const maxHeight = 80;

      let width = naturalWidth;
      let height = naturalHeight;

      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const scale = Math.min(widthRatio, heightRatio);

      const finalWidth = Math.round(width * scale);
      const finalHeight = Math.round(height * scale);

      header = new Header({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: buffer,
                transformation: {
                  width: finalWidth,
                  height: finalHeight,
                },
                type: imageType,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      });
    } catch (e) {
      console.error("Failed to load logo for DOCX", e);
    }
  }

  const processNode = (node: any) => {
    if (node.type === "paragraph") {
      const textRuns = (node.content || [])
        .map((child: any) => {
          if (child.type === "text") {
            return new TextRun({
              text: child.text,
              bold: child.marks?.some((m: any) => m.type === "bold"),
              italics: child.marks?.some((m: any) => m.type === "italic"),
              underline: child.marks?.some((m: any) => m.type === "underline")
                ? {}
                : undefined,
              font: "Times New Roman",
              size: 24,
            });
          } else if (child.type === "hardBreak") {
            return new TextRun({ break: 1 });
          }
          return null;
        })
        .filter(Boolean);

      children.push(
        new Paragraph({
          children: textRuns,
          spacing: { after: 240, line: 360 },
        }),
      );
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      node.content?.forEach((listItem: any) => {
        if (listItem.type === "listItem") {
          listItem.content?.forEach((paragraphNode: any) => {
            if (paragraphNode.type === "paragraph") {
              const textRuns = (paragraphNode.content || [])
                .map((child: any) => {
                  if (child.type === "text") {
                    return new TextRun({
                      text: child.text,
                      bold: child.marks?.some((m: any) => m.type === "bold"),
                      italics: child.marks?.some(
                        (m: any) => m.type === "italic",
                      ),
                      underline: child.marks?.some(
                        (m: any) => m.type === "underline",
                      )
                        ? {}
                        : undefined,
                      font: "Times New Roman",
                      size: 24,
                    });
                  } else if (child.type === "hardBreak") {
                    return new TextRun({ break: 1 });
                  }
                  return null;
                })
                .filter(Boolean);

              children.push(
                new Paragraph({
                  children: textRuns,
                  bullet: node.type === "bulletList" ? { level: 0 } : undefined,
                  numbering:
                    node.type === "orderedList"
                      ? { reference: "primary-numbering", level: 0 }
                      : undefined,
                  spacing: { after: 120, line: 360 },
                }),
              );
            }
          });
        }
      });
    } else if (node.type === "heading") {
      const textRuns = (node.content || [])
        .map((child: any) => {
          if (child.type === "text") {
            return new TextRun({
              text: child.text,
              bold: true,
              font: "Times New Roman",
              size: 32 - (node.attrs.level || 1) * 2,
            });
          }
          return null;
        })
        .filter(Boolean);
      children.push(
        new Paragraph({
          children: textRuns,
          spacing: { before: 240, after: 120 },
        }),
      );
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
    sections: [
      {
        headers: header ? { default: header } : undefined,
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${options.fileName}.docx`);
};
