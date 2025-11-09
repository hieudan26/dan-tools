"use client";

import JsonParser from "./components/JsonParser";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Parse JSON and export to Excel, TXT, and Properties files
          </p>
        </div>
        <JsonParser />
      </main>
    </div>
  );
}
