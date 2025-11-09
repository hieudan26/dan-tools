import { useState, useEffect, useRef } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { BodyType, KeyValuePair } from '../../types';
import { parseMultiLineText, calculateRequestCount } from '../../utils/multiLineParser';

type BodyEditMode = 'json' | 'fields';

interface BodyFieldItemProps {
  field: KeyValuePair;
  index: number;
  onUpdate: (index: number, field: keyof KeyValuePair, value: string | boolean) => void;
  onRemove: (index: number) => void;
  onFileUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

function BodyFieldItem({ field, index, onUpdate, onRemove, onFileUpload, onRemoveFile }: BodyFieldItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <input
          type="checkbox"
          checked={field.enabled}
          onChange={(e) => onUpdate(index, 'enabled', e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        <input
          type="text"
          value={field.key}
          onChange={(e) => onUpdate(index, 'key', e.target.value)}
          placeholder="Field name"
          className="flex-1 min-w-0 px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-900/30 shadow-sm"
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
        <input
          type="text"
          value={field.value}
          onChange={(e) => onUpdate(index, 'value', e.target.value)}
          placeholder="Field value"
          disabled={field.hasFile}
          className="flex-1 min-w-0 px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-900/30 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.text"
          onChange={(e) => onFileUpload(index, e)}
          className="hidden"
        />
        {field.hasFile ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
              {field.valueLines?.length || 0} values
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

export function BodyEditor() {
  const config = useRequestStore((state) => state.config);
  const body = useRequestStore((state) => state.config.body);
  const bodyType = useRequestStore((state) => state.config.bodyType);
  const method = useRequestStore((state) => state.config.method);
  const setConfig = useRequestStore((state) => state.setConfig);
  
  const [editMode, setEditMode] = useState<BodyEditMode>('json');
  const [jsonText, setJsonText] = useState<string>('');

  const canHaveBody = ['POST', 'PUT', 'PATCH'].includes(method);
  const isJsonType = bodyType === 'json';
  const isFormType = bodyType === 'form';
  const isRawType = bodyType === 'raw';
  const bodyArray = Array.isArray(body) ? body : [];

  useEffect(() => {
    if (isJsonType) {
      setEditMode('json');
    } else {
      setEditMode('fields');
    }
  }, [isJsonType]);
  
  const rawTextValue = isRawType && bodyArray.length > 0 && bodyArray[0].key === '' 
    ? bodyArray[0].value 
    : isRawType && bodyArray.length === 0 
    ? '' 
    : '';

  useEffect(() => {
    if (isJsonType && editMode === 'json') {
      const enabledFields = bodyArray.filter(f => f.enabled && f.key);
      if (enabledFields.length > 0) {
        try {
          const jsonObj: Record<string, any> = {};
          enabledFields.forEach(field => {
            try {
              const parsed = JSON.parse(field.value);
              jsonObj[field.key] = parsed;
            } catch {
              jsonObj[field.key] = field.value;
            }
          });
          setJsonText(JSON.stringify(jsonObj, null, 2));
        } catch {
          setJsonText('');
        }
      } else {
        setJsonText('');
      }
    }
  }, [bodyArray, isJsonType, editMode]);

  const convertJsonToFields = (jsonStr: string): KeyValuePair[] => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return Object.entries(parsed).map(([key, value]) => ({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
          enabled: true,
        }));
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleModeChange = (newMode: BodyEditMode) => {
    const hasFileUpload = bodyArray.some(f => f.hasFile);
    if (hasFileUpload) {
      return;
    }
    
    if (newMode === 'json' && editMode === 'fields') {
      const enabledFields = bodyArray.filter(f => f.enabled && f.key);
      if (enabledFields.length > 0) {
        try {
          const jsonObj: Record<string, any> = {};
          enabledFields.forEach(field => {
            try {
              const parsed = JSON.parse(field.value);
              jsonObj[field.key] = parsed;
            } catch {
              jsonObj[field.key] = field.value;
            }
          });
          setJsonText(JSON.stringify(jsonObj, null, 2));
        } catch {
          setJsonText('');
        }
      } else {
        setJsonText('');
      }
    } else if (newMode === 'fields' && editMode === 'json') {
      const fields = convertJsonToFields(jsonText);
      if (fields.length > 0) {
        setConfig({ body: fields });
      } else {
        setConfig({ body: [] });
      }
    }
    setEditMode(newMode);
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
  };

  const handleJsonBlur = () => {
    if (isJsonType && editMode === 'json') {
      const fields = convertJsonToFields(jsonText);
      setConfig({ body: fields });
    }
  };

  const addBodyField = () => {
    const newBody = [...bodyArray, { key: '', value: '', enabled: true }];
    setConfig({ body: newBody });
  };

  const updateBodyField = (index: number, field: keyof KeyValuePair, value: string | boolean) => {
    const newBody = [...bodyArray];
    newBody[index] = { ...newBody[index], [field]: value };
    setConfig({ body: newBody });
  };

  const removeBodyField = (index: number) => {
    const newBody = bodyArray.filter((_, i) => i !== index);
    setConfig({ body: newBody });
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = parseMultiLineText(content);
      const newBody = [...bodyArray];
      newBody[index] = {
        ...newBody[index],
        valueLines: lines,
        hasFile: true,
        value: lines.length > 0 ? `${lines.length} values from file` : '',
      };
      
      if (isRawType) {
        setConfig({ body: newBody, bodyType: 'json' });
        setEditMode('fields');
      } else {
        setConfig({ body: newBody });
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = (index: number) => {
    const newBody = [...bodyArray];
    newBody[index] = {
      ...newBody[index],
      valueLines: undefined,
      hasFile: false,
      value: '',
    };
    setConfig({ body: newBody });
  };

  const hasFileUpload = bodyArray.some(f => f.hasFile);
  const requestCount = calculateRequestCount(config);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mb-4">
        <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700">
          Request Body {!canHaveBody && <span className="text-xs font-normal text-gray-500">(only for POST/PUT/PATCH)</span>}
        </label>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {requestCount > 1 && (
            <span className="text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-700 whitespace-nowrap">
              {requestCount} requests
            </span>
          )}
          <select
            value={bodyType}
            onChange={(e) => {
              const newType = e.target.value as BodyType;
              if (hasFileUpload) {
                return;
              }
              const oldType = bodyType;
              
              if (newType === 'raw') {
                let currentRaw = '';
                if (oldType === 'raw') {
                  currentRaw = bodyArray.length > 0 && bodyArray[0].key === '' 
                    ? bodyArray[0].value 
                    : '';
                } else if (oldType === 'json' && editMode === 'json') {
                  currentRaw = jsonText || '';
                } else {
                  const enabledFields = bodyArray.filter(f => f.enabled && f.key);
                  if (enabledFields.length > 0) {
                    try {
                      const jsonObj: Record<string, any> = {};
                      enabledFields.forEach(field => {
                        try {
                          const parsed = JSON.parse(field.value);
                          jsonObj[field.key] = parsed;
                        } catch {
                          jsonObj[field.key] = field.value;
                        }
                      });
                      currentRaw = JSON.stringify(jsonObj, null, 2);
                    } catch {
                      currentRaw = '';
                    }
                  }
                }
                setConfig({ body: [{ key: '', value: currentRaw, enabled: true }], bodyType: newType });
              } else if (newType === 'json') {
                let fieldsToSet: KeyValuePair[] = [];
                if (oldType === 'raw') {
                  const rawValue = bodyArray.length > 0 && bodyArray[0].key === '' 
                    ? bodyArray[0].value 
                    : '';
                  if (rawValue.trim()) {
                    try {
                      const parsed = JSON.parse(rawValue);
                      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                        fieldsToSet = Object.entries(parsed).map(([key, value]) => ({
                          key,
                          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
                          enabled: true,
                        }));
                      }
                    } catch {
                      fieldsToSet = [];
                    }
                  }
                } else {
                  fieldsToSet = bodyArray;
                }
                setConfig({ body: fieldsToSet, bodyType: newType });
                setEditMode('json');
              } else {
                setConfig({ bodyType: newType });
                setEditMode('fields');
              }
            }}
            disabled={!canHaveBody || hasFileUpload}
            className="px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium w-auto min-w-[100px]"
          >
            <option value="json">JSON</option>
            <option value="form">Form Data</option>
            <option value="raw">Raw Text</option>
          </select>
          {canHaveBody && isJsonType && (
            <div className="flex gap-0 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => handleModeChange('json')}
                disabled={hasFileUpload}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  editMode === 'json'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                JSON
              </button>
              <button
                onClick={() => handleModeChange('fields')}
                disabled={hasFileUpload}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  editMode === 'fields'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Fields
              </button>
            </div>
          )}
          {canHaveBody && (isFormType || (isJsonType && editMode === 'fields')) && (
            <button
              onClick={addBodyField}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              + Add Field
            </button>
          )}
        </div>
      </div>
      {canHaveBody ? (
        <>
          {isRawType && !hasFileUpload ? (
            <div>
              <textarea
                value={rawTextValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfig({ body: [{ key: '', value, enabled: true }] });
                }}
                placeholder="Enter raw text body..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 font-mono text-sm shadow-sm resize-none hover:border-gray-300 dark:hover:border-gray-600 min-h-[200px]"
                rows={10}
              />
            </div>
          ) : isJsonType && editMode === 'json' ? (
            <div>
              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                onBlur={handleJsonBlur}
                placeholder='{"key": "value", "number": 123}'
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 font-mono text-sm shadow-sm resize-none hover:border-gray-300 dark:hover:border-gray-600 min-h-[200px]"
                rows={10}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {bodyArray.map((field, index) => (
                <BodyFieldItem
                  key={index}
                  field={field}
                  index={index}
                  onUpdate={updateBodyField}
                  onRemove={removeBodyField}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                />
              ))}
              {bodyArray.length === 0 && (
                <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No body fields. Click "Add Field" to add one.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Body is only available for POST, PUT, and PATCH methods.
          </p>
        </div>
      )}
    </div>
  );
}

