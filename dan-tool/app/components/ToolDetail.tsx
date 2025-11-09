"use client";

import { Tool } from "../data/tools";

interface ToolDetailProps {
  tool: Tool | null;
  onClose: () => void;
}

export default function ToolDetail({ tool, onClose }: ToolDetailProps) {
  if (!tool) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center`}
            >
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {tool.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {tool.shortDescription}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {tool.description}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tính năng chính:
          </h3>
          <ul className="space-y-3 mb-8 text-gray-700 dark:text-gray-300">
            {tool.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {tool.status === "available" && (tool.url || tool.githubUrl) && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
                >
                  Mở {tool.name}
                </a>
              )}
              {tool.githubUrl && (
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Xem trên GitHub
                </a>
              )}
            </div>
          )}

          {tool.status === "coming-soon" && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Tool này đang được phát triển và sẽ sớm ra mắt!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

