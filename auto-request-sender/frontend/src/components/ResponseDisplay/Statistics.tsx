import { useState } from 'react';
import { useRequestStore } from '../../stores/requestStore';

export function Statistics() {
  const statistics = useRequestStore((state) => state.statistics);
  const [expanded, setExpanded] = useState(false);

  if (statistics.totalRequests === 0) {
    return null;
  }

  const mainStats = [
    { label: 'Total', value: statistics.totalRequests, color: 'blue' },
    { label: 'Success', value: statistics.successCount, color: 'green' },
    { label: 'Errors', value: statistics.errorCount, color: 'red' },
    { label: 'Success Rate', value: `${statistics.successRate}%`, color: 'purple' },
  ];

  const detailStats = [
    { label: 'Avg Time', value: `${statistics.averageResponseTime}ms`, color: 'yellow' },
    { label: 'Min/Max', value: `${statistics.minResponseTime}ms / ${statistics.maxResponseTime}ms`, color: 'indigo' },
    { label: 'RPS', value: statistics.requestsPerSecond, color: 'pink' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      pink: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold dark:text-white">Statistics</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {mainStats.map((stat) => (
          <div
            key={stat.label}
            className={`p-3 rounded ${getColorClasses(stat.color)}`}
          >
            <div className="text-xs font-medium mb-1">{stat.label}</div>
            <div className="text-lg font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
      {expanded && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {detailStats.map((stat) => (
            <div
              key={stat.label}
              className={`p-2 rounded ${getColorClasses(stat.color)}`}
            >
              <div className="text-xs font-medium mb-1">{stat.label}</div>
              <div className="text-sm font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

