import { useRequestStore } from '../../stores/requestStore';
import { HttpMethod } from '../../types';

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

export function MethodSelector() {
  const method = useRequestStore((state) => state.config.method);
  const setConfig = useRequestStore((state) => state.setConfig);

  return (
    <div>
      <label className="block text-sm font-semibold mb-3 dark:text-gray-200 text-gray-700">
        HTTP Method
      </label>
      <select
        value={method}
        onChange={(e) => setConfig({ method: e.target.value as HttpMethod })}
        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 font-medium cursor-pointer appearance-none bg-white dark:bg-gray-900"
        style={{ minHeight: '56px' }}
      >
        {methods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

