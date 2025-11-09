import { useRef } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { KeyValuePair } from '../../types';
import { parseMultiLineText, calculateRequestCount } from '../../utils/multiLineParser';

interface ParamItemProps {
  param: KeyValuePair;
  index: number;
  onUpdate: (index: number, field: keyof KeyValuePair, value: string | boolean) => void;
  onRemove: (index: number) => void;
  onFileUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

function ParamItem({ param, index, onUpdate, onRemove, onFileUpload, onRemoveFile }: ParamItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <input
          type="checkbox"
          checked={param.enabled}
          onChange={(e) => onUpdate(index, 'enabled', e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        <input
          type="text"
          value={param.key}
          onChange={(e) => onUpdate(index, 'key', e.target.value)}
          placeholder="Parameter name"
          className="flex-1 min-w-0 px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-900/30 shadow-sm"
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
        <input
          type="text"
          value={param.value}
          onChange={(e) => onUpdate(index, 'value', e.target.value)}
          placeholder="Parameter value"
          disabled={param.hasFile}
          className="flex-1 min-w-0 px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-900/30 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.text"
          onChange={(e) => onFileUpload(index, e)}
          className="hidden"
        />
        {param.hasFile ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
              {param.valueLines?.length || 0} values
            </span>
            <button
              onClick={() => onRemoveFile(index)}
              className="px-2 sm:px-3 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all whitespace-nowrap"
            >
              Remove File
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 sm:px-3 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all whitespace-nowrap flex-shrink-0"
          >
            📁 Upload
          </button>
        )}
      </div>
      <button
        onClick={() => onRemove(index)}
        className="px-3 sm:px-4 py-2 sm:py-3 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg font-medium w-full sm:w-auto whitespace-nowrap"
      >
        Remove
      </button>
    </div>
  );
}

export function ParamsEditor() {
  const config = useRequestStore((state) => state.config);
  const params = useRequestStore((state) => state.config.params);
  const url = useRequestStore((state) => state.config.url);
  const setConfig = useRequestStore((state) => state.setConfig);

  const buildUrlWithParams = (baseUrl: string, paramsList: KeyValuePair[]): string => {
    const enabledParams = paramsList.filter(p => p.enabled && p.key);
    if (enabledParams.length === 0) {
      return baseUrl;
    }
    
    const queryString = enabledParams
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value || '')}`)
      .join('&');
    
    return `${baseUrl}?${queryString}`;
  };

  const getBaseUrl = (fullUrl: string): string => {
    try {
      const urlObj = new URL(fullUrl.includes('://') ? fullUrl : `https://${fullUrl}`);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      const questionIndex = fullUrl.indexOf('?');
      return questionIndex > 0 ? fullUrl.substring(0, questionIndex) : fullUrl;
    }
  };

  const updateParamsAndUrl = (newParams: KeyValuePair[]) => {
    const hasFileUpload = newParams.some(p => p.hasFile);
    if (!hasFileUpload) {
      const baseUrl = getBaseUrl(url);
      const newUrl = buildUrlWithParams(baseUrl, newParams);
      setConfig({ params: newParams, url: newUrl });
    } else {
      setConfig({ params: newParams });
    }
  };

  const addParam = () => {
    const newParams = [...params, { key: '', value: '', enabled: true }];
    updateParamsAndUrl(newParams);
  };

  const updateParam = (index: number, field: keyof KeyValuePair, value: string | boolean) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    
    if (field === 'key' && !value) {
      const filteredParams = newParams.filter((_, i) => i !== index);
      updateParamsAndUrl(filteredParams);
    } else {
      updateParamsAndUrl(newParams);
    }
  };

  const removeParam = (index: number) => {
    const newParams = params.filter((_, i) => i !== index);
    updateParamsAndUrl(newParams);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = parseMultiLineText(content);
      const newParams = [...params];
      newParams[index] = {
        ...newParams[index],
        valueLines: lines,
        hasFile: true,
        value: lines.length > 0 ? `${lines.length} values from file` : '',
      };
      updateParamsAndUrl(newParams);
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = (index: number) => {
    const newParams = [...params];
    newParams[index] = {
      ...newParams[index],
      valueLines: undefined,
      hasFile: false,
      value: '',
    };
    updateParamsAndUrl(newParams);
  };

  const requestCount = calculateRequestCount(config);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mb-4">
        <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700">
          Query Parameters
        </label>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {requestCount > 1 && (
            <span className="text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-700 whitespace-nowrap">
              {requestCount} requests
            </span>
          )}
          <button
            onClick={addParam}
            className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex-1 sm:flex-none whitespace-nowrap"
          >
            + Add Parameter
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {params.map((param, index) => (
          <ParamItem
            key={index}
            param={param}
            index={index}
            onUpdate={updateParam}
            onRemove={removeParam}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
          />
        ))}
        {params.length === 0 && (
          <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No parameters. Click "Add Parameter" to add one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

