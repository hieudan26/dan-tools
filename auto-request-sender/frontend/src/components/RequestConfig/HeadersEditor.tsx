import { useRef } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { KeyValuePair } from '../../types';
import { parseMultiLineText, calculateRequestCount } from '../../utils/multiLineParser';

interface HeaderItemProps {
  header: KeyValuePair;
  index: number;
  onUpdate: (index: number, field: keyof KeyValuePair, value: string | boolean) => void;
  onRemove: (index: number) => void;
  onFileUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

function HeaderItem({ header, index, onUpdate, onRemove, onFileUpload, onRemoveFile }: HeaderItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
        <input
          type="checkbox"
          checked={header.enabled}
          onChange={(e) => onUpdate(index, 'enabled', e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0 accent-blue-600"
        />
        <input
          type="text"
          value={header.key}
          onChange={(e) => onUpdate(index, 'key', e.target.value)}
          placeholder="Header name"
          className="w-32 sm:w-40 px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto min-w-0">
        <input
          type="text"
          value={header.value}
          onChange={(e) => onUpdate(index, 'value', e.target.value)}
          placeholder="Header value"
          disabled={header.hasFile}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.text"
          onChange={(e) => onFileUpload(index, e)}
          className="hidden"
        />
        {header.hasFile ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold whitespace-nowrap">
              {header.valueLines?.length || 0} values
            </span>
            <button
              onClick={() => onRemoveFile(index)}
              className="px-3 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all whitespace-nowrap"
            >
              Remove File
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all whitespace-nowrap flex-shrink-0"
          >
            📁 Upload
          </button>
        )}
      </div>
      <button
        onClick={() => onRemove(index)}
        className="px-3 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all whitespace-nowrap flex-shrink-0"
      >
        Remove
      </button>
    </div>
  );
}

export function HeadersEditor() {
  const config = useRequestStore((state) => state.config);
  const headers = useRequestStore((state) => state.config.headers);
  const setConfig = useRequestStore((state) => state.setConfig);

  const addHeader = () => {
    const newHeaders = [...headers, { key: '', value: '', enabled: true }];
    setConfig({ headers: newHeaders });
  };

  const updateHeader = (index: number, field: keyof KeyValuePair, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setConfig({ headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setConfig({ headers: newHeaders });
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = parseMultiLineText(content);
      const newHeaders = [...headers];
      newHeaders[index] = {
        ...newHeaders[index],
        valueLines: lines,
        hasFile: true,
        value: lines.length > 0 ? `${lines.length} values from file` : '',
      };
      setConfig({ headers: newHeaders });
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = (index: number) => {
    const newHeaders = [...headers];
    newHeaders[index] = {
      ...newHeaders[index],
      valueLines: undefined,
      hasFile: false,
      value: '',
    };
    setConfig({ headers: newHeaders });
  };

  const requestCount = calculateRequestCount(config);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mb-4">
        <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700">
          Headers
        </label>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {requestCount > 1 && (
            <span className="text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-700 whitespace-nowrap">
              {requestCount} requests
            </span>
          )}
          <button
            onClick={addHeader}
            className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex-1 sm:flex-none whitespace-nowrap"
          >
            + Add Header
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {headers.map((header, index) => (
          <HeaderItem
            key={index}
            header={header}
            index={index}
            onUpdate={updateHeader}
            onRemove={removeHeader}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
          />
        ))}
        {headers.length === 0 && (
          <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No headers. Click "Add Header" to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

