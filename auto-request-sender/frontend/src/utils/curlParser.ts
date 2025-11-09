import { parseCurl as parseCurlLib } from 'sweet-curl-parser';
import { RequestConfig, HttpMethod, BodyType } from '../types';

export function parseCurl(curlCommand: string): Partial<RequestConfig> | null {
  try {
    const result = parseCurlLib(curlCommand.trim(), {
      parseBody: true,
      strict: false,
      throwOnError: false,
    });

    if (!result.success) {
      console.error('Error parsing cURL:', result.errors);
      return null;
    }

    const data = result.data;
    if (!data) {
      return null;
    }

    const config: Partial<RequestConfig> = {
      headers: [],
      params: [],
      body: [],
      bodyType: 'json' as BodyType,
    };

    config.method = (data.method || 'GET').toUpperCase() as HttpMethod;
    config.url = data.url?.fullUrl || '';

    if (data.headers && data.headers.length > 0) {
      config.headers = data.headers.map((h) => ({
        key: h.name,
        value: h.value,
        enabled: true,
      }));
    }

    if (data.url.queryParams && data.url.queryParams.length > 0) {
      config.params = data.url.queryParams.map((p) => ({
        key: p.key,
        value: p.value,
        enabled: true,
      }));
    }

    if (data.body) {
      if (data.body.type === 'json') {
        try {
          let parsedBody: any;
          const bodyContent = data.body.content;
          if (bodyContent) {
            if (typeof bodyContent === 'string') {
              parsedBody = JSON.parse(bodyContent);
            } else if (typeof bodyContent === 'object' && bodyContent !== null) {
              parsedBody = bodyContent;
            } else {
              parsedBody = {};
            }
          } else {
            parsedBody = {};
          }
          
          if (typeof parsedBody === 'object' && parsedBody !== null && !Array.isArray(parsedBody)) {
            config.body = Object.entries(parsedBody).map(([key, value]) => {
              let stringValue: string;
              if (value === null) {
                stringValue = 'null';
              } else if (typeof value === 'object') {
                stringValue = JSON.stringify(value);
              } else {
                stringValue = String(value);
              }
              return {
                key,
                value: stringValue,
                enabled: true,
              };
            });
            config.bodyType = 'json';
          } else {
            config.body = [];
          }
        } catch {
          config.body = [];
        }
      } else if (data.body.type === 'form') {
        const bodyContent = data.body.content;
        const contentString = typeof bodyContent === 'string' ? bodyContent : '';
        const formPairs = (contentString || '').split('&');
        config.body = formPairs
          .map((pair: string) => {
            const [key, ...valueParts] = pair.split('=');
            return key ? { key, value: decodeURIComponent(valueParts.join('=') || ''), enabled: true } : null;
          })
          .filter((pair: { key: string; value: string; enabled: boolean } | null): pair is { key: string; value: string; enabled: boolean } => pair !== null);
        config.bodyType = 'form';
      } else {
        const bodyContent = data.body.content;
        const contentString = typeof bodyContent === 'string' ? bodyContent : '';
        config.body = [{ key: '', value: contentString || '', enabled: true }];
        config.bodyType = 'raw';
      }
    }

    return config;
  } catch (error) {
    console.error('Error parsing cURL:', error);
    return null;
  }
}

