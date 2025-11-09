import { useState } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { NumberRangeGenerator } from '../NumberRangeGenerator/NumberRangeGenerator';

export function Header() {
  const darkMode = useRequestStore((state) => state.darkMode);
  const toggleDarkMode = useRequestStore((state) => state.toggleDarkMode);
  const statistics = useRequestStore((state) => state.statistics);
  const resetAll = useRequestStore((state) => state.resetAll);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const exportStatistics = () => {
    const dataStr = JSON.stringify(statistics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistics-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csv = [
      ['Metric', 'Value'],
      ['Total Requests', statistics.totalRequests],
      ['Success Count', statistics.successCount],
      ['Error Count', statistics.errorCount],
      ['Success Rate (%)', statistics.successRate],
      ['Average Response Time (ms)', statistics.averageResponseTime],
      ['Min Response Time (ms)', statistics.minResponseTime],
      ['Max Response Time (ms)', statistics.maxResponseTime],
      ['Requests Per Second', statistics.requestsPerSecond],
    ].map(row => row.join(',')).join('\n');

    const dataBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistics-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b-2 border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Auto Request Sender
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Text Generator
            </button>
            {statistics.totalRequests > 0 && (
              <>
                <button
                  onClick={exportStatistics}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Export JSON
                </button>
                <button
                  onClick={exportCSV}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Export CSV
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data? This will clear all configuration, responses, and statistics.')) {
                  resetAll();
                }
              }}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Reset All
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 sm:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <NumberRangeGenerator isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} />
    </header>
  );
}

