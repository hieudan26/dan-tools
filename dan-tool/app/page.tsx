"use client";

import { useState } from "react";
import { tools, Tool } from "./data/tools";
import ToolCard from "./components/ToolCard";
import ToolDetail from "./components/ToolDetail";

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-14 h-14 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Dan Tools
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 font-medium mb-2">
              A collection of useful tools for developers
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <div className="h-1 w-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <ToolCard
                  tool={tool}
                  onClick={() => setSelectedTool(tool)}
                />
              </div>
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-gray-500 dark:text-gray-400">
                No tools available yet. Add new tools in{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  app/data/tools.ts
                </code>
              </p>
            </div>
          )}

          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-12">
            <p>Dan Tools - A collection of useful tools for developers</p>
          </div>
        </div>
      </div>

      <ToolDetail
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </main>
  );
}
