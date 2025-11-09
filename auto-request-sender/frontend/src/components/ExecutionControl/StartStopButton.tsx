import { useState } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import axios from 'axios';
import { calculateRequestCount } from '../../utils/multiLineParser';

export function StartStopButton() {
  const executionState = useRequestStore((state) => state.executionState);
  const config = useRequestStore((state) => state.config);
  const executionSettings = useRequestStore((state) => state.executionSettings);
  const setExecutionState = useRequestStore((state) => state.setExecutionState);
  const addResponse = useRequestStore((state) => state.addResponse);
  const clearResponses = useRequestStore((state) => state.clearResponses);
  const [isLoading, setIsLoading] = useState(false);

  const getBackendUrl = () => {
    let baseUrl = config.corsProxy || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    if (baseUrl.includes('/api/proxy')) {
      baseUrl = baseUrl.replace('/api/proxy', '');
    }
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `http://${baseUrl}`;
    }
    return baseUrl;
  };

  const handleStart = async () => {
    if (!config.url && (!config.urlHasFile || !config.urlLines || config.urlLines.length === 0)) {
      alert('Please enter a URL or upload a file');
      return;
    }

    if (config.corsBypassMode !== 'backend') {
      alert('Please enable "Use Backend Proxy" to use batch processing');
      return;
    }

    clearResponses();
    setExecutionState('running');
    setIsLoading(true);
    
    const hasFileUpload = config.urlHasFile || 
      config.headers.some(h => h.hasFile) || 
      config.params.some(p => p.hasFile) || 
      config.body.some(b => b.hasFile);
    
    const calculatedCount = calculateRequestCount(config);
    const requestCount = hasFileUpload ? calculatedCount : executionSettings.totalRequests;

    const backendUrl = getBackendUrl();

    try {
      let baseUrl = config.url;
      if (!config.urlHasFile) {
        try {
          const urlObj = new URL(config.url.includes('://') ? config.url : `https://${config.url}`);
          baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch {
          const questionIndex = config.url.indexOf('?');
          if (questionIndex > 0) {
            baseUrl = config.url.substring(0, questionIndex);
          }
        }
      } else {
        baseUrl = config.urlLines && config.urlLines.length > 0 ? config.urlLines[0] : config.url;
      }

      const response = await axios.post(`${backendUrl}/api/batch`, {
        url: baseUrl,
        method: config.method,
        headers: config.headers,
        params: config.params,
        body: config.body,
        bodyType: config.bodyType,
        delayBetweenBatches: executionSettings.delayBetweenBatches,
        concurrentConnections: executionSettings.concurrentConnections,
        totalRequests: requestCount,
        urlLines: config.urlLines,
        urlHasFile: config.urlHasFile || false,
      });

      if (response.data.success && response.data.results) {
        response.data.results.forEach((result: any) => {
          addResponse(result);
        });
      }

      setExecutionState('idle');
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error starting batch:', error);
      alert('Failed to start batch: ' + (error.message || 'Unknown error'));
      setExecutionState('idle');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleStart}
          disabled={isLoading || executionState === 'running'}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading || executionState === 'running' ? 'Processing...' : 'Start'}
        </button>
      </div>
      {(isLoading || executionState === 'running') && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Processing requests...</span>
          </div>
        </div>
      )}
    </div>
  );
}
