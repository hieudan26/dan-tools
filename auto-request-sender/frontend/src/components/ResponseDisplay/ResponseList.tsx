import { useState, useEffect, useRef } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { ResponseItem } from './ResponseItem';
import { exportToJSON, exportToExcel } from '../../utils/exportUtils';

export function ResponseList() {
  const responses = useRequestStore((state) => state.responses);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const successCount = responses.filter(r => r.status >= 200 && r.status < 300).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };

    if (exportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportMenuOpen]);

  const handleExportJSON = (onlySuccess: boolean) => {
    exportToJSON(responses, onlySuccess);
    setExportMenuOpen(false);
  };

  const handleExportExcel = (onlySuccess: boolean) => {
    exportToExcel(responses, onlySuccess);
    setExportMenuOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white text-gray-800">Responses</h2>
        <div className="flex items-center gap-3">
          {responses.length > 0 && (
            <>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-xl font-semibold text-sm shadow-sm">
                {responses.length} {responses.length === 1 ? 'response' : 'responses'}
                {successCount > 0 && (
                  <span className="ml-2 text-green-700 dark:text-green-300">
                    ({successCount} success)
                  </span>
                )}
              </span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-2">
                    <button
                      onClick={() => handleExportJSON(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span className="font-mono">JSON</span>
                      <span className="text-xs text-gray-500">All ({responses.length})</span>
                    </button>
                    {successCount > 0 && (
                      <button
                        onClick={() => handleExportJSON(true)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <span className="font-mono">JSON</span>
                        <span className="text-xs text-green-600 dark:text-green-400">Success only ({successCount})</span>
                      </button>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => handleExportExcel(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span className="font-mono">Excel</span>
                      <span className="text-xs text-gray-500">All ({responses.length})</span>
                    </button>
                    {successCount > 0 && (
                      <button
                        onClick={() => handleExportExcel(true)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <span className="font-mono">Excel</span>
                        <span className="text-xs text-green-600 dark:text-green-400">Success only ({successCount})</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => useRequestStore.getState().clearResponses()}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>
      <div className="max-h-[700px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {responses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
              No responses yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Start sending requests to see results
            </p>
          </div>
        ) : (
          responses.map((response) => (
            <ResponseItem key={response.id} response={response} />
          ))
        )}
      </div>
    </div>
  );
}

