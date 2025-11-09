import { Response } from '../types';
import * as XLSX from 'xlsx';

export function exportToJSON(responses: Response[], onlySuccess: boolean = false) {
  const dataToExport = onlySuccess 
    ? responses.filter(r => r.status >= 200 && r.status < 300)
    : responses;

  const exportData = dataToExport.map(response => {
    const row: any = {
      'ID': response.id,
      'Timestamp': new Date(response.timestamp).toISOString(),
      'Status': response.status,
      'Status Text': response.statusText,
      'Response Time (ms)': response.responseTime,
      'Response Size': response.responseSize,
      'Error': response.error || '',
    };

    if (response.request) {
      row['Request Method'] = response.request.method;
      row['Request URL'] = response.request.url;
      if (response.request.params) {
        row['Request Params'] = JSON.stringify(response.request.params);
      }
      if (response.request.headers) {
        row['Request Headers'] = JSON.stringify(response.request.headers);
      }
      if (response.request.body) {
        row['Request Body'] = typeof response.request.body === 'string' 
          ? response.request.body 
          : JSON.stringify(response.request.body);
      }
      if (response.request.bodyType) {
        row['Request Body Type'] = response.request.bodyType;
      }
    }

    if (response.data) {
      if (typeof response.data === 'object') {
        Object.keys(response.data).forEach(key => {
          const value = response.data[key];
          row[`Response.${key}`] = typeof value === 'object' ? JSON.stringify(value) : String(value);
        });
      } else {
        row['Response Data'] = String(response.data);
      }
    }

    if (response.headers) {
      Object.keys(response.headers).forEach(key => {
        row[`Response Header.${key}`] = response.headers[key];
      });
    }

    return row;
  });

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `responses_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(responses: Response[], onlySuccess: boolean = false) {
  const dataToExport = onlySuccess 
    ? responses.filter(r => r.status >= 200 && r.status < 300)
    : responses;

  const exportData = dataToExport.map(response => {
    const row: any = {
      'ID': response.id,
      'Timestamp': new Date(response.timestamp).toISOString(),
      'Status': response.status,
      'Status Text': response.statusText,
      'Response Time (ms)': response.responseTime,
      'Response Size': response.responseSize,
      'Error': response.error || '',
    };

    if (response.request) {
      row['Request Method'] = response.request.method;
      row['Request URL'] = response.request.url;
      if (response.request.params) {
        row['Request Params'] = JSON.stringify(response.request.params);
      }
      if (response.request.headers) {
        row['Request Headers'] = JSON.stringify(response.request.headers);
      }
      if (response.request.body) {
        row['Request Body'] = typeof response.request.body === 'string' 
          ? response.request.body 
          : JSON.stringify(response.request.body);
      }
      if (response.request.bodyType) {
        row['Request Body Type'] = response.request.bodyType;
      }
    }

    if (response.data) {
      if (typeof response.data === 'object') {
        Object.keys(response.data).forEach(key => {
          const value = response.data[key];
          row[`Response.${key}`] = typeof value === 'object' ? JSON.stringify(value) : String(value);
        });
      } else {
        row['Response Data'] = String(response.data);
      }
    }

    if (response.headers) {
      Object.keys(response.headers).forEach(key => {
        row[`Response Header.${key}`] = response.headers[key];
      });
    }

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
  XLSX.writeFile(workbook, `responses_${new Date().toISOString().split('T')[0]}.xlsx`);
}

