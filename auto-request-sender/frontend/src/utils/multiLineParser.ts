import { RequestConfig } from '../types';

export function parseMultiLineText(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export function parseHeaderLine(line: string): { key: string; value: string } | null {
  const colonIndex = line.indexOf(':');
  if (colonIndex < 0) return null;
  
  const key = line.substring(0, colonIndex).trim();
  const value = line.substring(colonIndex + 1).trim();
  
  if (!key) return null;
  
  return { key, value };
}

export function parseParamLine(line: string): { key: string; value: string } | null {
  const equalIndex = line.indexOf('=');
  if (equalIndex < 0) return null;
  
  const key = line.substring(0, equalIndex).trim();
  const value = line.substring(equalIndex + 1).trim();
  
  if (!key) return null;
  
  return { key, value };
}

export function calculateRequestCount(config: RequestConfig): number {
  const urlCount = config.urlLines?.length || 0;
  
  const headerCounts = config.headers
    .filter(h => h.enabled && h.hasFile && h.valueLines)
    .map(h => h.valueLines!.length);
  const maxHeaderCount = headerCounts.length > 0 ? Math.max(...headerCounts) : 0;
  
  const paramCounts = config.params
    .filter(p => p.enabled && p.hasFile && p.valueLines)
    .map(p => p.valueLines!.length);
  const maxParamCount = paramCounts.length > 0 ? Math.max(...paramCounts) : 0;
  
  const bodyCounts = config.body
    .filter(b => b.enabled && b.hasFile && b.valueLines)
    .map(b => b.valueLines!.length);
  const maxBodyCount = bodyCounts.length > 0 ? Math.max(...bodyCounts) : 0;

  return Math.max(urlCount, maxHeaderCount, maxParamCount, maxBodyCount, 1);
}

export function getRequestValueAtIndex<T>(
  lines: string[] | undefined,
  index: number,
  defaultValue: T
): T {
  if (!lines || lines.length === 0) {
    return defaultValue;
  }
  
  if (index < lines.length) {
    return lines[index] as T;
  }
  
  return lines[lines.length - 1] as T;
}

export function buildRequestConfigAtIndex(
  config: RequestConfig,
  index: number
): RequestConfig {
  const url = getRequestValueAtIndex(config.urlLines, index, config.url);
  
  const headers = config.headers.map(header => {
    if (header.hasFile && header.valueLines && header.valueLines.length > 0) {
      const value = getRequestValueAtIndex(header.valueLines, index, header.value);
      return { ...header, value };
    }
    return header;
  });

  const params = config.params.map(param => {
    if (param.hasFile && param.valueLines && param.valueLines.length > 0) {
      const value = getRequestValueAtIndex(param.valueLines, index, param.value);
      return { ...param, value };
    }
    return param;
  });

  const body = config.body.map(field => {
    if (field.hasFile && field.valueLines && field.valueLines.length > 0) {
      const value = getRequestValueAtIndex(field.valueLines, index, field.value);
      return { ...field, value };
    }
    return field;
  });

  return {
    ...config,
    url,
    headers,
    params,
    body,
  };
}

