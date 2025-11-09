import * as XLSX from "xlsx";

export function exportToExcel(data: any) {
  let rows: any[] = [];
  
  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
      rows = data.map(item => flattenObjectToRow(item));
    } else {
      rows = data.map((item, index) => ({ index, value: item }));
    }
  } else if (typeof data === "object" && data !== null) {
    rows = [flattenObjectToRow(data)];
  } else {
    rows = [{ value: data }];
  }
  
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "export.xlsx");
}

function flattenObjectToRow(obj: any, prefix = "", result: any = {}): any {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        flattenObjectToRow(value, newKey, result);
      } else if (Array.isArray(value)) {
        result[newKey] = JSON.stringify(value);
      } else {
        result[newKey] = value;
      }
    });
  } else {
    result[prefix || "value"] = obj;
  }
  return result;
}

export function exportToTxt(data: any) {
  let rows: any[] = [];
  
  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
      rows = data.map(item => flattenObjectToRow(item));
    } else {
      rows = data.map((item, index) => ({ index, value: item }));
    }
  } else if (typeof data === "object" && data !== null) {
    rows = [flattenObjectToRow(data)];
  } else {
    rows = [{ value: data }];
  }
  
  if (rows.length === 0) {
    return;
  }
  
  const allKeys = new Set<string>();
  rows.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });
  
  const columns = Array.from(allKeys).sort();
  const lines: string[] = [];
  
  lines.push(columns.join(" | "));
  
  rows.forEach(row => {
    const values = columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) {
        return "";
      }
      return String(value);
    });
    lines.push(values.join(" | "));
  });
  
  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "export.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToProperties(data: any) {
  const content = formatToProperties(data);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "export.properties";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function flattenObject(obj: any, prefix = "", result: any[] = []): any[] {
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === "object" && item !== null) {
        flattenObject(item, `${prefix}[${index}].`, result);
      } else {
        result.push({ key: `${prefix}[${index}]`, value: String(item) });
      }
    });
  } else if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else if (Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result.push({ key: newKey, value: String(obj[key]) });
      }
    });
  } else {
    result.push({ key: prefix || "value", value: String(obj) });
  }
  return result;
}

function formatToTxt(obj: any, indent = 0): string {
  let result = "";
  const indentStr = "  ".repeat(indent);

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      result += `${indentStr}[${index}]:\n`;
      result += formatToTxt(item, indent + 1);
    });
  } else if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        result += `${indentStr}${key}:\n`;
        result += formatToTxt(value, indent + 1);
      } else {
        result += `${indentStr}${key}: ${value}\n`;
      }
    });
  } else {
    result += `${indentStr}${obj}\n`;
  }

  return result;
}

function formatToProperties(obj: any, prefix = ""): string {
  let result = "";
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}[${index}]` : `[${index}]`;
      if (typeof item === "object" && item !== null) {
        result += formatToProperties(item, key);
      } else {
        result += `${key}=${escapeValue(String(item))}\n`;
      }
    });
  } else if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        result += formatToProperties(value, newKey);
      } else {
        result += `${newKey}=${escapeValue(String(value))}\n`;
      }
    });
  } else {
    result += `${prefix || "value"}=${escapeValue(String(obj))}\n`;
  }

  return result;
}

function escapeValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/=/g, "\\=")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

