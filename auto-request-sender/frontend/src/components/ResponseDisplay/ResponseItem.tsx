import { useState } from 'react';
import { Response } from '../../types';

interface ResponseItemProps {
  response: Response;
}

export function ResponseItem({ response }: ResponseItemProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (status >= 500) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatData = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4 dark:bg-gray-800/50 bg-white shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${getStatusColor(response.status)}`}>
            {response.status || 'Error'}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {response.responseTime}ms
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatSize(response.responseSize)}
            </span>
          </div>
          {response.error && (
            <div className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {response.error}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {expanded && (
        <div className="mt-6 space-y-5 pt-5 border-t-2 border-gray-200 dark:border-gray-700">
          {response.request && (
            <div>
              <h4 className="text-sm font-bold mb-3 dark:text-gray-200 text-gray-700 uppercase tracking-wide">Request</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-20">Method:</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-bold">
                    {response.request.method}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">URL:</span>
                  <span className="text-sm text-gray-800 dark:text-gray-200 break-all font-mono">
                    {response.request.url}
                  </span>
                </div>
                {response.request.params && Object.keys(response.request.params).length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-2">Params:</span>
                    <pre className="bg-gray-900 dark:bg-gray-950 p-3 rounded-lg text-xs overflow-auto dark:text-gray-300 text-gray-100 font-mono custom-scrollbar">
                      {JSON.stringify(response.request.params, null, 2)}
                    </pre>
                  </div>
                )}
                {response.request.headers && Object.keys(response.request.headers).length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-2">Headers:</span>
                    <pre className="bg-gray-900 dark:bg-gray-950 p-3 rounded-lg text-xs overflow-auto dark:text-gray-300 text-gray-100 font-mono custom-scrollbar">
                      {JSON.stringify(response.request.headers, null, 2)}
                    </pre>
                  </div>
                )}
                {response.request.body !== undefined && (
                  <div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                      Body {response.request.bodyType ? `(${response.request.bodyType})` : ''}:
                    </span>
                    <pre className="bg-gray-900 dark:bg-gray-950 p-3 rounded-lg text-xs overflow-auto max-h-48 dark:text-gray-300 text-gray-100 font-mono custom-scrollbar">
                      {typeof response.request.body === 'string' 
                        ? response.request.body 
                        : JSON.stringify(response.request.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
          {response.data && (
            <div>
              <h4 className="text-sm font-bold mb-3 dark:text-gray-200 text-gray-700 uppercase tracking-wide">Response Body</h4>
              <pre className="bg-gray-900 dark:bg-gray-950 p-5 rounded-xl text-xs overflow-auto max-h-96 dark:text-gray-300 text-gray-100 font-mono shadow-inner border border-gray-800 dark:border-gray-700 custom-scrollbar">
                {formatData(response.data)}
              </pre>
            </div>
          )}
          {Object.keys(response.headers).length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-3 dark:text-gray-200 text-gray-700 uppercase tracking-wide">Response Headers</h4>
              <pre className="bg-gray-900 dark:bg-gray-950 p-5 rounded-xl text-xs overflow-auto dark:text-gray-300 text-gray-100 font-mono shadow-inner border border-gray-800 dark:border-gray-700 custom-scrollbar">
                {JSON.stringify(response.headers, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

