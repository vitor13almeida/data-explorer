import { DataRow } from "@/services/types/Resources";

export function exportToCsv(
  rows: DataRow[],
  filename: string = "export.csv",
): void {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]).filter((key) => key !== "__id");

  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value == null) return `""`;
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
