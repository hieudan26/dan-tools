import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestConfig, Response, ExecutionSettings } from '../types';

export async function sendRequest(
  config: RequestConfig
): Promise<Response> {
  const startTime = performance.now();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if (config.corsBypassMode === 'backend') {
    return sendRequestBackend(config, id, startTime);
  }

  let baseUrl = config.url;
  const urlParamsMap = new Map<string, string>();
  const paramsMap = new Map<string, string>();

  try {
    let requestUrl = config.url;
    baseUrl = requestUrl;

    try {
      const urlObj = new URL(requestUrl.includes('://') ? requestUrl : `https://${requestUrl}`);
      baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      urlObj.searchParams.forEach((value, key) => {
        urlParamsMap.set(key, value);
      });
    } catch {
      const questionIndex = requestUrl.indexOf('?');
      if (questionIndex > 0) {
        baseUrl = requestUrl.substring(0, questionIndex);
        const queryString = requestUrl.substring(questionIndex + 1);
        queryString.split('&').forEach((pair) => {
          const [key, ...valueParts] = pair.split('=');
          if (key) {
            urlParamsMap.set(decodeURIComponent(key), decodeURIComponent(valueParts.join('=') || ''));
          }
        });
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      method: config.method,
      url: baseUrl,
      headers: {},
      params: {},
    };

    config.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        axiosConfig.headers![h.key] = h.value;
      });
    
    urlParamsMap.forEach((value, key) => {
      paramsMap.set(key, value);
    });
    
    config.params
      .filter((p) => p.enabled && p.key)
      .forEach((p) => {
        paramsMap.set(p.key, p.value);
      });
    
    paramsMap.forEach((value: string, key: string) => {
      axiosConfig.params![key] = value;
    });

    const bodyArray = Array.isArray(config.body) ? config.body : [];
    if (bodyArray.length > 0 && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (config.bodyType === 'raw') {
        const rawBody = bodyArray.find(f => f.key === '') || bodyArray[0];
        if (rawBody && rawBody.enabled) {
          axiosConfig.data = rawBody.value;
        }
      } else {
        const enabledBodyFields = bodyArray.filter((f) => f.enabled && f.key);
        
        if (enabledBodyFields.length > 0) {
          if (config.bodyType === 'json') {
            const jsonObject: Record<string, any> = {};
            enabledBodyFields.forEach((field) => {
              try {
                const parsed = JSON.parse(field.value);
                jsonObject[field.key] = parsed;
              } catch {
                jsonObject[field.key] = field.value;
              }
            });
            axiosConfig.data = jsonObject;
            axiosConfig.headers!['Content-Type'] = 'application/json';
          } else if (config.bodyType === 'form') {
            const formData = new URLSearchParams();
            enabledBodyFields.forEach((field) => {
              formData.append(field.key, field.value);
            });
            axiosConfig.data = formData.toString();
            axiosConfig.headers!['Content-Type'] = 'application/x-www-form-urlencoded';
          }
        }
      }
    }

    const axiosResponse: AxiosResponse = await axios(axiosConfig);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const responseSize = JSON.stringify(axiosResponse.data).length;

    const requestHeaders: Record<string, string> = {};
    config.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        requestHeaders[h.key] = h.value;
      });

    const requestParams: Record<string, string> = {};
    paramsMap.forEach((value: string, key: string) => {
      requestParams[key] = value;
    });

    let requestBody: any = undefined;
    if (bodyArray.length > 0 && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (config.bodyType === 'raw') {
        const rawBody = bodyArray.find(f => f.key === '') || bodyArray[0];
        if (rawBody && rawBody.enabled) {
          requestBody = rawBody.value;
        }
      } else {
        const enabledBodyFields = bodyArray.filter((f) => f.enabled && f.key);
        if (enabledBodyFields.length > 0) {
          if (config.bodyType === 'json') {
            const jsonObject: Record<string, any> = {};
            enabledBodyFields.forEach((field) => {
              try {
                const parsed = JSON.parse(field.value);
                jsonObject[field.key] = parsed;
              } catch {
                jsonObject[field.key] = field.value;
              }
            });
            requestBody = jsonObject;
          } else if (config.bodyType === 'form') {
            requestBody = {};
            enabledBodyFields.forEach((field) => {
              requestBody[field.key] = field.value;
            });
          }
        }
      }
    }

    return {
      id,
      timestamp: Date.now(),
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      responseTime: Math.round(responseTime),
      responseSize,
      headers: axiosResponse.headers as Record<string, string>,
      data: axiosResponse.data,
      request: {
        method: config.method,
        url: baseUrl,
        headers: requestHeaders,
        params: Object.keys(requestParams).length > 0 ? requestParams : undefined,
        body: requestBody,
        bodyType: config.bodyType,
      },
    };
  } catch (error: any) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const requestHeaders: Record<string, string> = {};
    config.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        requestHeaders[h.key] = h.value;
      });

    const requestParams: Record<string, string> = {};
    paramsMap.forEach((value: string, key: string) => {
      requestParams[key] = value;
    });

    let requestBody: any = undefined;
    const bodyArray = Array.isArray(config.body) ? config.body : [];
    if (bodyArray.length > 0 && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (config.bodyType === 'raw') {
        const rawBody = bodyArray.find(f => f.key === '') || bodyArray[0];
        if (rawBody && rawBody.enabled) {
          requestBody = rawBody.value;
        }
      } else {
        const enabledBodyFields = bodyArray.filter((f) => f.enabled && f.key);
        if (enabledBodyFields.length > 0) {
          if (config.bodyType === 'json') {
            const jsonObject: Record<string, any> = {};
            enabledBodyFields.forEach((field) => {
              try {
                const parsed = JSON.parse(field.value);
                jsonObject[field.key] = parsed;
              } catch {
                jsonObject[field.key] = field.value;
              }
            });
            requestBody = jsonObject;
          } else if (config.bodyType === 'form') {
            requestBody = {};
            enabledBodyFields.forEach((field) => {
              requestBody[field.key] = field.value;
            });
          }
        }
      }
    }

    return {
      id,
      timestamp: Date.now(),
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Error',
      responseTime: Math.round(responseTime),
      responseSize: 0,
      headers: error.response?.headers || {},
      data: error.response?.data || null,
      error: error.message || 'Request failed',
      request: {
        method: config.method,
        url: baseUrl,
        headers: requestHeaders,
        params: Object.keys(requestParams).length > 0 ? requestParams : undefined,
        body: requestBody,
        bodyType: config.bodyType,
      },
    };
  }
}

async function sendRequestBackend(
  config: RequestConfig,
  id: string,
  startTime: number
): Promise<Response> {
  try {
    const backendUrl = config.corsProxy || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/proxy';

    const headers: Record<string, string> = {};
    config.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        headers[h.key] = h.value;
      });

    let baseUrl = config.url;
    const urlParamsMap = new Map<string, string>();

    try {
      const urlObj = new URL(config.url.includes('://') ? config.url : `https://${config.url}`);
      baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      urlObj.searchParams.forEach((value, key) => {
        urlParamsMap.set(key, value);
      });
    } catch {
      const questionIndex = config.url.indexOf('?');
      if (questionIndex > 0) {
        baseUrl = config.url.substring(0, questionIndex);
        const queryString = config.url.substring(questionIndex + 1);
        queryString.split('&').forEach((pair) => {
          const [key, ...valueParts] = pair.split('=');
          if (key) {
            urlParamsMap.set(decodeURIComponent(key), decodeURIComponent(valueParts.join('=') || ''));
          }
        });
      }
    }

    const paramsMap = new Map<string, string>();
    urlParamsMap.forEach((value, key) => {
      paramsMap.set(key, value);
    });
    
    config.params
      .filter((p) => p.enabled && p.key)
      .forEach((p) => {
        paramsMap.set(p.key, p.value);
      });
    
    const params: Record<string, string> = {};
    paramsMap.forEach((value: string, key: string) => {
      params[key] = value;
    });

    let bodyData: any = undefined;
    const bodyArray = Array.isArray(config.body) ? config.body : [];
    if (bodyArray.length > 0) {
      if (config.bodyType === 'raw') {
        const rawBody = bodyArray.find(f => f.key === '') || bodyArray[0];
        if (rawBody && rawBody.enabled) {
          bodyData = rawBody.value;
        }
      } else {
        const enabledBodyFields = bodyArray.filter((f) => f.enabled && f.key);
        if (enabledBodyFields.length > 0) {
          if (config.bodyType === 'json') {
            const jsonObject: Record<string, any> = {};
            enabledBodyFields.forEach((field) => {
              try {
                const parsed = JSON.parse(field.value);
                jsonObject[field.key] = parsed;
              } catch {
                jsonObject[field.key] = field.value;
              }
            });
            bodyData = jsonObject;
          } else if (config.bodyType === 'form') {
            const formData: Record<string, string> = {};
            enabledBodyFields.forEach((field) => {
              formData[field.key] = field.value;
            });
            bodyData = formData;
          }
        }
      }
    }

    const requestPayload = {
      url: baseUrl,
      method: config.method,
      headers,
      params,
      body: bodyData,
      bodyType: config.bodyType,
    };

    const axiosResponse: AxiosResponse = await axios.post(backendUrl, requestPayload);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const responseData = axiosResponse.data;
    const responseSize = JSON.stringify(responseData.data || {}).length;

    return {
      id,
      timestamp: Date.now(),
      status: responseData.status || axiosResponse.status,
      statusText: responseData.statusText || axiosResponse.statusText,
      responseTime: Math.round(responseTime),
      responseSize,
      headers: responseData.headers || {},
      data: responseData.data,
      request: {
        method: config.method,
        url: baseUrl,
        headers,
        params: Object.keys(params).length > 0 ? params : undefined,
        body: bodyData,
        bodyType: config.bodyType,
      },
    };
  } catch (error: any) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const requestHeaders: Record<string, string> = {};
    config.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        requestHeaders[h.key] = h.value;
      });

    let baseUrl = config.url;
    const urlParamsMap = new Map<string, string>();
    try {
      const urlObj = new URL(config.url.includes('://') ? config.url : `https://${config.url}`);
      baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      urlObj.searchParams.forEach((value, key) => {
        urlParamsMap.set(key, value);
      });
    } catch {
      const questionIndex = config.url.indexOf('?');
      if (questionIndex > 0) {
        baseUrl = config.url.substring(0, questionIndex);
        const queryString = config.url.substring(questionIndex + 1);
        queryString.split('&').forEach((pair) => {
          const [key, ...valueParts] = pair.split('=');
          if (key) {
            urlParamsMap.set(decodeURIComponent(key), decodeURIComponent(valueParts.join('=') || ''));
          }
        });
      }
    }

    const paramsMap = new Map<string, string>();
    urlParamsMap.forEach((value, key) => {
      paramsMap.set(key, value);
    });
    
    config.params
      .filter((p) => p.enabled && p.key)
      .forEach((p) => {
        paramsMap.set(p.key, p.value);
      });
    
    const params: Record<string, string> = {};
    paramsMap.forEach((value: string, key: string) => {
      params[key] = value;
    });

    let bodyData: any = undefined;
    const bodyArray = Array.isArray(config.body) ? config.body : [];
    if (bodyArray.length > 0) {
      if (config.bodyType === 'raw') {
        const rawBody = bodyArray.find(f => f.key === '') || bodyArray[0];
        if (rawBody && rawBody.enabled) {
          bodyData = rawBody.value;
        }
      } else {
        const enabledBodyFields = bodyArray.filter((f) => f.enabled && f.key);
        if (enabledBodyFields.length > 0) {
          if (config.bodyType === 'json') {
            const jsonObject: Record<string, any> = {};
            enabledBodyFields.forEach((field) => {
              try {
                const parsed = JSON.parse(field.value);
                jsonObject[field.key] = parsed;
              } catch {
                jsonObject[field.key] = field.value;
              }
            });
            bodyData = jsonObject;
          } else if (config.bodyType === 'form') {
            bodyData = {};
            enabledBodyFields.forEach((field) => {
              bodyData[field.key] = field.value;
            });
          }
        }
      }
    }

    return {
      id,
      timestamp: Date.now(),
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Error',
      responseTime: Math.round(responseTime),
      responseSize: 0,
      headers: error.response?.data?.headers || {},
      data: error.response?.data?.data || null,
      error: error.response?.data?.error || error.message || 'Backend request failed',
      request: {
        method: config.method,
        url: baseUrl,
        headers: requestHeaders,
        params: Object.keys(params).length > 0 ? params : undefined,
        body: bodyData,
        bodyType: config.bodyType,
      },
    };
  }
}

export class RequestQueue {
  private config: RequestConfig;
  private settings: ExecutionSettings;
  private onResponse: (response: Response) => void;
  private onComplete: () => void;
  private isRunning = false;
  private isPaused = false;
  private sentCount = 0;
  private intervalId: number | null = null;

  constructor(
    config: RequestConfig,
    settings: ExecutionSettings,
    onResponse: (response: Response) => void,
    onComplete: () => void
  ) {
    this.config = config;
    this.settings = settings;
    this.onResponse = onResponse;
    this.onComplete = onComplete;
  }

  private async processBatch() {
    if (!this.isRunning || this.isPaused) return;
    if (this.sentCount >= this.settings.totalRequests) {
      this.stop();
      return;
    }

    const delay = this.settings.delayBetweenBatches;
    const batchSize = this.settings.concurrentConnections;
    const remaining = this.settings.totalRequests - this.sentCount;
    const currentBatchSize = Math.min(batchSize, remaining);

    const promises: Promise<void>[] = [];
    for (let i = 0; i < currentBatchSize; i++) {
      if (this.sentCount >= this.settings.totalRequests) break;
      
      const promise = sendRequest(this.config).then((response) => {
        this.onResponse(response);
        this.sentCount++;
      });
      promises.push(promise);
    }

    await Promise.all(promises);

    if (this.sentCount < this.settings.totalRequests && this.isRunning && !this.isPaused) {
      this.intervalId = window.setTimeout(() => this.processBatch(), delay);
    } else if (this.sentCount >= this.settings.totalRequests) {
      this.stop();
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.sentCount = 0;
    this.processBatch();
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.processBatch();
    }
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.onComplete();
  }

  updateConfig(config: RequestConfig) {
    this.config = config;
  }

  updateSettings(settings: ExecutionSettings) {
    this.settings = settings;
  }
}

