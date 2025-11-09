export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type BodyType = 'json' | 'form' | 'raw';

export type CorsBypassMode = 'backend' | 'off';

export interface KeyValuePair {
  key: string;
  value: string;
  enabled: boolean;
  valueLines?: string[];
  hasFile?: boolean;
}

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: KeyValuePair[];
  bodyType: BodyType;
  corsBypassMode: CorsBypassMode;
  corsProxy: string;
  urlLines?: string[];
  urlHasFile?: boolean;
}

export interface Response {
  id: string;
  timestamp: number;
  status: number;
  statusText: string;
  responseTime: number;
  responseSize: number;
  headers: Record<string, string>;
  data: any;
  error?: string;
  request?: {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string>;
    body?: any;
    bodyType?: BodyType;
  };
}

export interface Statistics {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  successRate: number;
  startTime?: number;
  endTime?: number;
}

export type ExecutionState = 'idle' | 'running' | 'paused' | 'stopped';

export interface ExecutionSettings {
  delayBetweenBatches: number;
  concurrentConnections: number;
  totalRequests: number;
}

