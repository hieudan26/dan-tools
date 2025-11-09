import { useEffect } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { calculateRequestCount } from '../../utils/multiLineParser';

export function ConcurrentControl() {
  const config = useRequestStore((state) => state.config);
  const concurrentConnections = useRequestStore((state) => state.executionSettings.concurrentConnections);
  const totalRequests = useRequestStore((state) => state.executionSettings.totalRequests);
  const setExecutionSettings = useRequestStore((state) => state.setExecutionSettings);

  useEffect(() => {
    const calculatedCount = calculateRequestCount(config);
    const hasFileUpload = config.urlHasFile || 
      config.headers.some(h => h.hasFile) || 
      config.params.some(p => p.hasFile) || 
      config.body.some(b => b.hasFile);
    
    if (hasFileUpload) {
      setExecutionSettings({ 
        totalRequests: calculatedCount,
        concurrentConnections: 1
      });
    }
  }, [config, setExecutionSettings]);

  const hasFileUpload = config.urlHasFile || 
    config.headers.some(h => h.hasFile) || 
    config.params.some(p => p.hasFile) || 
    config.body.some(b => b.hasFile);
  const calculatedCount = calculateRequestCount(config);
  const displayTotalRequests = hasFileUpload ? calculatedCount : totalRequests;

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold mb-3 dark:text-gray-200 text-gray-700">
          Concurrent Connections
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={concurrentConnections}
          onChange={(e) => setExecutionSettings({ concurrentConnections: parseInt(e.target.value) || 1 })}
          disabled={hasFileUpload}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {hasFileUpload && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto set to 1 when file uploaded</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold mb-3 dark:text-gray-200 text-gray-700">
          Total Requests
        </label>
        <input
          type="number"
          min="1"
          value={displayTotalRequests}
          onChange={(e) => setExecutionSettings({ totalRequests: parseInt(e.target.value) || 1 })}
          disabled={hasFileUpload}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {hasFileUpload && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto calculated from max lines</p>
        )}
      </div>
    </div>
  );
}

