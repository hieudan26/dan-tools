export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type BodyType = 'json' | 'form' | 'raw';

export interface KeyValuePair {
  key: string;
  value: string;
  enabled: boolean;
}

export type CorsBypassMode = 'backend' | 'off';

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
  bodyType: BodyType;
  corsBypassMode: CorsBypassMode;
  corsProxy: string;
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

