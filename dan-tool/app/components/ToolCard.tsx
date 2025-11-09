"use client";

import { Tool } from "../data/tools";

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={tool.icon}
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {tool.name}
            </h3>
            {tool.status === "coming-soon" && (
              <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                Sắp ra mắt
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {tool.shortDescription}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <span>Xem chi tiết →</span>
      </div>
    </div>
  );
}

