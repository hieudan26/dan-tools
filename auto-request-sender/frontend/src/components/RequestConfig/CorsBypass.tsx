import { useRequestStore } from '../../stores/requestStore';

export function CorsBypass() {
  const corsBypassMode = useRequestStore((state) => state.config.corsBypassMode);
  const corsProxy = useRequestStore((state) => state.config.corsProxy);
  const setConfig = useRequestStore((state) => state.setConfig);

  return (
    <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 shadow-sm">
      <div className="mb-4">
        <label className="flex items-center gap-3 text-sm font-semibold dark:text-gray-200 text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={corsBypassMode === 'backend'}
            onChange={(e) => setConfig({ corsBypassMode: e.target.checked ? 'backend' : 'off' })}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          Use Backend Proxy (Bypass CORS)
        </label>
      </div>
      
      {corsBypassMode === 'backend' && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-200 shadow-sm">
            <strong className="font-semibold">Info:</strong> Using local backend proxy server. Make sure backend is running.
            <br className="my-1" />
            Run: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md font-mono text-xs shadow-sm">cd backend && npm install && npm start</code>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200 text-gray-700">
              Backend URL
            </label>
            <input
              type="text"
              value={corsProxy}
              onChange={(e) => setConfig({ corsProxy: e.target.value })}
              placeholder={import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api/proxy"}
              className="w-full px-5 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-900/30 shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

