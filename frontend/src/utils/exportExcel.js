import { ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([ExcelExportModule]);

export function formatExportDate(value) {
  if (!value) return "N/A";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function formatExportValue(value) {
  return value === null || value === undefined || value === "" ? "N/A" : value;
}

export function exportGridData({
  api,
  fileName,
  sheetName,
  columnKeys,
  headerNames,
  onSuccess,
  onError,
}) {
  try {
    if (!api?.exportDataAsExcel) {
      throw new Error("Excel export is not available on this grid.");
    }

    api.exportDataAsExcel({
      fileName,
      sheetName,
      columnKeys,
      processHeaderCallback: ({ column }) =>
        headerNames[column.getColId()] || column.getColDef().headerName,
      processCellCallback: ({ column, value }) => {
        if (column.getColId() === "eventDate" || column.getColId() === "gccLeaderActionDate" || column.getColId() === "actionDate") {
          return formatExportDate(value);
        }
        if (column.getColId() === "budget") {
          return value === null || value === undefined || value === "" ? "N/A" : Number(value);
        }
        return formatExportValue(value);
      },
    });

    onSuccess?.();
  } catch (error) {
    console.error("Excel export failed:", error);
    onError?.(error);
  }
}

export function getExportFileName(prefix) {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}_${date}.xlsx`;
}
