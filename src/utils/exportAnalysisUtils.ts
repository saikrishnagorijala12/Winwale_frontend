import * as XLSX from "xlsx";

export function exportAnalysisToExcel(
  jobId: string | number,
  categorized: {
    additions: any[];
    deletions: any[];
    priceIncreases: any[];
    priceDecreases: any[];
    descriptionChanges: any[];
  },
  customFileName?: string,
) {
  const workbook = XLSX.utils.book_new();

  const sheets: Record<string, any[]> = {
    Additions: categorized.additions,
    Deletions: categorized.deletions,
    "Price Increases": categorized.priceIncreases,
    "Price Decreases": categorized.priceDecreases,
    "Description Changes": categorized.descriptionChanges,
  };

  Object.entries(sheets).forEach(([sheetName, actions]) => {
    if (!actions || actions.length === 0) return;

    const rows = actions.map((a: any) => ({
      "Part Number": a.manufacturer_part_number || "",
      "Product Name": a.product_name || "",
      "Old Price": a.old_price ?? "",
      "New Price": a.new_price ?? "",
      "Old Description": a.old_description || "",
      "New Description": a.new_description || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const fileName = customFileName || `ANAL-JOB-${jobId}-analysis.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
