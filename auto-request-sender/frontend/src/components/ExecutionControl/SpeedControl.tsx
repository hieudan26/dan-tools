import { useRequestStore } from '../../stores/requestStore';

export function SpeedControl() {
  const delayBetweenBatches = useRequestStore((state) => state.executionSettings.delayBetweenBatches);
  const setExecutionSettings = useRequestStore((state) => state.setExecutionSettings);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700">
          Delay Between Batches (ms)
        </label>
        <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-xl font-bold text-lg shadow-sm">
          {delayBetweenBatches}ms
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="10000"
        step="100"
        value={delayBetweenBatches}
        onChange={(e) => setExecutionSettings({ delayBetweenBatches: parseInt(e.target.value) })}
        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
        <span>0ms</span>
        <span>10000ms</span>
      </div>
    </div>
  );
}

