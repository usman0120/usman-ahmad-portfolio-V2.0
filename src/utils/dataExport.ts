import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to a JSON file and trigger a download.
 */
export const exportToJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Flatten a nested object for PDF table display.
 * Nested arrays or objects will be stringified.
 */
const flattenForPDF = (obj: any): Record<string, string> => {
  const result: Record<string, string> = {};
  
  if (!obj || typeof obj !== 'object') {
    return result;
  }
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value === null || value === undefined) {
      result[key] = '';
    } else if (typeof value === 'object') {
      // For arrays (like techStack) or objects, convert to a readable string
      result[key] = Array.isArray(value) ? value.join(', ') : JSON.stringify(value);
    } else {
      result[key] = String(value);
    }
  });
  
  return result;
};

/**
 * Export data to a beautifully formatted PDF file.
 */
export const exportToPDF = (data: any[], collectionName: string) => {
  const doc = new jsPDF('landscape');
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(`${collectionName} Data Report`, 14, 22);
  
  // Subtitle / Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleString();
  doc.text(`Generated on: ${dateStr}`, 14, 30);
  doc.text(`Total Records: ${data.length}`, 14, 35);
  
  if (data.length === 0) {
    doc.text('No data available in this collection.', 14, 50);
    doc.save(`${collectionName}_Report.pdf`);
    return;
  }
  
  // Flatten data and extract columns
  const flattenedData = data.map(flattenForPDF);
  
  // Collect all unique keys for headers
  const keysSet = new Set<string>();
  flattenedData.forEach(item => {
    Object.keys(item).forEach(key => keysSet.add(key));
  });
  
  // Put 'id' and 'name'/'title' first if they exist
  let headers = Array.from(keysSet);
  const priorityKeys = ['id', 'name', 'title', 'category'];
  headers.sort((a, b) => {
    const aPriority = priorityKeys.indexOf(a);
    const bPriority = priorityKeys.indexOf(b);
    if (aPriority > -1 && bPriority > -1) return aPriority - bPriority;
    if (aPriority > -1) return -1;
    if (bPriority > -1) return 1;
    return a.localeCompare(b);
  });
  
  const tableData = flattenedData.map(row => {
    return headers.map(header => row[header] || '');
  });
  
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 45,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left',
    },
    headStyles: {
      fillColor: [98, 140, 227], // Primary color
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 'wrap' }
    }
  });
  
  doc.save(`${collectionName}_Report.pdf`);
};
