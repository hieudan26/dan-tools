"use client";

import { useState } from "react";
import { exportToExcel, exportToTxt, exportToProperties } from "../utils/exporters";

export default function JsonParser() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    setError("");
    
    if (value.trim()) {
      try {
        const parsed = JSON.parse(value);
        setParsedData(parsed);
      } catch (err) {
        setError("Invalid JSON format");
        setParsedData(null);
      }
    } else {
      setParsedData(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        setJsonInput(content);
        setParsedData(parsed);
        setError("");
      } catch (err) {
        setError("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  const isObject = parsedData !== null && typeof parsedData === "object" && !Array.isArray(parsedData);

  const handleExport = async (format: "excel" | "txt" | "properties") => {
    if (!parsedData) {
      setError("Please provide valid JSON first");
      return;
    }

    if (format === "properties" && !isObject) {
      setError("Properties export only works with JSON objects, not arrays");
      return;
    }

    try {
      switch (format) {
        case "excel":
          exportToExcel(parsedData);
          break;
        case "txt":
          exportToTxt(parsedData);
          break;
        case "properties":
          exportToProperties(parsedData);
          break;
      }
    } catch (err) {
      setError(`Failed to export to ${format}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-800">JSON Input</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Upload JSON File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white hover:file:from-blue-600 hover:file:to-blue-700 file:transition-all file:shadow-md hover:file:shadow-lg file:cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Or Paste JSON
          </label>
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            placeholder='{"key": "value", "nested": {"item": 123}}'
            className="w-full h-64 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all custom-scrollbar"
          />
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {parsedData && !error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Valid JSON</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => handleExport("excel")}
              disabled={!parsedData}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export to Excel</span>
            </button>
            <button
              onClick={() => handleExport("txt")}
              disabled={!parsedData}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export to TXT</span>
            </button>
            <div className="relative group">
              <button
                onClick={() => handleExport("properties")}
                disabled={!parsedData || !isObject}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Export to Properties</span>
              </button>
              {parsedData && !isObject && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-400 shadow-md z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Properties export only works with JSON objects, not arrays</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {parsedData && (
          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </h3>
            <pre className="text-xs overflow-auto max-h-60 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 custom-scrollbar">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
