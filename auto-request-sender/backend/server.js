import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/proxy', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, params = {}, body, bodyType } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const config = {
      method: method.toUpperCase(),
      url: url,
      headers: { ...headers },
      params: { ...params },
      validateStatus: () => true,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      if (bodyType === 'json') {
        try {
          config.data = typeof body === 'string' ? JSON.parse(body) : body;
          config.headers['Content-Type'] = 'application/json';
        } catch {
          config.data = body;
        }
      } else if (bodyType === 'form') {
        const formData = new URLSearchParams();
        if (typeof body === 'string') {
          body.split('&').forEach((pair) => {
            const [key, value] = pair.split('=');
            if (key && value) {
              formData.append(key, decodeURIComponent(value));
            }
          });
        } else if (typeof body === 'object' && body !== null) {
          Object.entries(body).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
        }
        config.data = formData.toString();
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        config.data = body;
      }
    }

    const response = await axios(config);

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
    });
  }
});

function getValueAtIndex(lines, index, defaultValue) {
  if (!lines || lines.length === 0) {
    return defaultValue;
  }
  if (index < lines.length) {
    return lines[index];
  }
  return lines[lines.length - 1];
}

function parseHeaderLine(line) {
  const colonIndex = line.indexOf(':');
  if (colonIndex < 0) return null;
  const key = line.substring(0, colonIndex).trim();
  const value = line.substring(colonIndex + 1).trim();
  if (!key) return null;
  return { key, value };
}

function parseParamLine(line) {
  const equalIndex = line.indexOf('=');
  if (equalIndex < 0) return null;
  const key = line.substring(0, equalIndex).trim();
  const value = line.substring(equalIndex + 1).trim();
  if (!key) return null;
  return { key, value };
}

function buildRequestConfig(config, index) {
  const url = getValueAtIndex(config.urlLines, index, config.url);
  
  let headers = {};
  if (config.headers && Array.isArray(config.headers)) {
    config.headers.forEach(header => {
      if (header.enabled && header.key) {
        if (header.hasFile && header.valueLines && header.valueLines.length > 0) {
          const value = getValueAtIndex(header.valueLines, index, header.value);
          headers[header.key] = value;
        } else {
          headers[header.key] = header.value;
        }
      }
    });
  } else if (config.headers && typeof config.headers === 'object') {
    headers = { ...config.headers };
  }

  let params = {};
  if (config.params && Array.isArray(config.params)) {
    config.params.forEach(param => {
      if (param.enabled && param.key) {
        if (param.hasFile && param.valueLines && param.valueLines.length > 0) {
          const value = getValueAtIndex(param.valueLines, index, param.value);
          params[param.key] = value;
        } else {
          params[param.key] = param.value;
        }
      }
    });
  } else if (config.params && typeof config.params === 'object') {
    params = { ...config.params };
  }

  let body = config.body;
  if (config.body && Array.isArray(config.body)) {
    if (config.bodyType === 'raw') {
      const rawField = config.body.find(f => f.key === '' || !f.key);
      if (rawField && rawField.enabled) {
        if (rawField.hasFile && rawField.valueLines && rawField.valueLines.length > 0) {
          body = getValueAtIndex(rawField.valueLines, index, rawField.value);
        } else {
          body = rawField.value;
        }
      }
    } else if (config.bodyType === 'json') {
      body = {};
      config.body.forEach(field => {
        if (field.enabled && field.key) {
          if (field.hasFile && field.valueLines && field.valueLines.length > 0) {
            const value = getValueAtIndex(field.valueLines, index, field.value);
            try {
              body[field.key] = JSON.parse(value);
            } catch {
              body[field.key] = value;
            }
          } else {
            try {
              body[field.key] = JSON.parse(field.value);
            } catch {
              body[field.key] = field.value;
            }
          }
        }
      });
    } else if (config.bodyType === 'form') {
      body = {};
      config.body.forEach(field => {
        if (field.enabled && field.key) {
          if (field.hasFile && field.valueLines && field.valueLines.length > 0) {
            const value = getValueAtIndex(field.valueLines, index, field.value);
            body[field.key] = value;
          } else {
            body[field.key] = field.value;
          }
        }
      });
    }
  }

  return {
    url,
    method: config.method,
    headers,
    params,
    body,
    bodyType: config.bodyType,
  };
}

app.post('/api/batch', async (req, res) => {
  try {
    const { 
      url, 
      method = 'GET', 
      headers = [], 
      params = [], 
      body = [], 
      bodyType,
      delayBetweenBatches = 1000,
      concurrentConnections = 1,
      totalRequests = 10,
      urlLines = [],
      urlHasFile = false,
    } = req.body;

    if (!url && (!urlHasFile || !urlLines || urlLines.length === 0)) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const results = await processBatchRequests({
      url,
      method,
      headers,
      params,
      body,
      bodyType,
      delayBetweenBatches,
      concurrentConnections,
      totalRequests,
      urlLines,
      urlHasFile,
    });

    const successCount = results.filter(r => r.status >= 200 && r.status < 300).length;
    const errorCount = results.filter(r => r.status >= 400 || r.error).length;

    res.json({
      success: true,
      results,
      totalRequests: results.length,
      successCount,
      errorCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function processBatchRequests(config) {
  const {
    url,
    method,
    headers,
    params,
    body,
    bodyType,
    delayBetweenBatches,
    concurrentConnections,
    totalRequests,
    urlLines,
    urlHasFile,
  } = config;

  const results = [];
  const delay = delayBetweenBatches;
  let sentCount = 0;

  while (sentCount < totalRequests) {
    const remaining = totalRequests - sentCount;
    const currentBatchSize = Math.min(concurrentConnections, remaining);
    
    const batchPromises = [];
    
    for (let i = 0; i < currentBatchSize; i++) {
      const requestIndex = sentCount;
      sentCount++;
      
      const requestConfig = buildRequestConfig({
        url,
        method,
        headers,
        params,
        body,
        bodyType,
        urlLines,
        urlHasFile,
      }, requestIndex);
      
      batchPromises.push(sendSingleRequest(requestConfig));
    }
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (sentCount < totalRequests && delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return results;
}

async function sendSingleRequest(config) {
  const { url, method, headers, params, body, bodyType } = config;
  const startTime = Date.now();
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const axiosConfig = {
      method: method.toUpperCase(),
      url: url,
      headers: { ...headers },
      params: { ...params },
      validateStatus: () => true,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      if (bodyType === 'json') {
        try {
          axiosConfig.data = typeof body === 'string' ? JSON.parse(body) : body;
          axiosConfig.headers['Content-Type'] = 'application/json';
        } catch {
          axiosConfig.data = body;
        }
      } else if (bodyType === 'form') {
        const formData = new URLSearchParams();
        if (typeof body === 'string') {
          body.split('&').forEach((pair) => {
            const [key, value] = pair.split('=');
            if (key && value) {
              formData.append(key, decodeURIComponent(value));
            }
          });
        } else if (typeof body === 'object' && body !== null) {
          Object.entries(body).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
        }
        axiosConfig.data = formData.toString();
        axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        axiosConfig.data = body;
      }
    }

    const response = await axios(axiosConfig);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      id: uniqueId,
      timestamp: Date.now(),
      status: response.status,
      statusText: response.statusText,
      responseTime: Math.round(responseTime),
      responseSize: JSON.stringify(response.data || {}).length,
      headers: response.headers,
      data: response.data,
      request: {
        method: method,
        url: url,
        headers: headers,
        params: params,
        body: body,
        bodyType: bodyType,
      },
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      id: uniqueId,
      timestamp: Date.now(),
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Error',
      responseTime: Math.round(responseTime),
      responseSize: 0,
      headers: error.response?.headers || {},
      data: error.response?.data || null,
      error: error.message || 'Request failed',
      request: {
        method: method,
        url: url,
        headers: headers,
        params: params,
        body: body,
        bodyType: bodyType,
      },
    };
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Proxy endpoint: http://localhost:${PORT}/api/proxy`);
    console.log(`🔗 Batch endpoint: http://localhost:${PORT}/api/batch`);
  });
}

export default app;
