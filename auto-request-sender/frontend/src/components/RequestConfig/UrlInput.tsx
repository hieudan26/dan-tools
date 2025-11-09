import { useRequestStore } from '../../stores/requestStore';
import { KeyValuePair } from '../../types';
import { calculateRequestCount } from '../../utils/multiLineParser';

interface UrlInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  skipValidation?: boolean;
}

export function UrlInput({ inputValue, setInputValue, skipValidation = false }: UrlInputProps) {
  const setConfig = useRequestStore((state) => state.setConfig);
  const config = useRequestStore((state) => state.config);
  const currentParams = useRequestStore((state) => state.config.params);
  const looksLikeCurl = inputValue.trim().toLowerCase().startsWith('curl');
  
  const shouldSkipValidation = skipValidation || looksLikeCurl;

  const parseUrlParams = (url: string) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return { fullUrl: url, params: [] };
    }

    const hasQueryParams = trimmedUrl.includes('=') || trimmedUrl.includes('&');
    
    if (!hasQueryParams) {
      return { fullUrl: trimmedUrl, params: [] };
    }

    const questionIndex = trimmedUrl.indexOf('?');
    if (questionIndex < 0) {
      return { fullUrl: trimmedUrl, params: [] };
    }

    const queryString = trimmedUrl.substring(questionIndex + 1);
    
    if (!queryString) {
      return { fullUrl: trimmedUrl, params: [] };
    }

    const params: KeyValuePair[] = [];
    const pairs = queryString.split('&');
    
    pairs.forEach((pair) => {
      if (!pair) return;
      
      const equalIndex = pair.indexOf('=');
      if (equalIndex < 0) {
        return;
      }
      
      const key = pair.substring(0, equalIndex);
      const value = pair.substring(equalIndex + 1);
      
      if (key) {
        try {
          params.push({ 
            key: decodeURIComponent(key), 
            value: decodeURIComponent(value), 
            enabled: true 
          });
        } catch {
          params.push({ 
            key: key, 
            value: value, 
            enabled: true 
          });
        }
      }
    });

    return { fullUrl: trimmedUrl, params };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (!shouldSkipValidation) {
      const { fullUrl, params } = parseUrlParams(value);
      
      const existingParamsMap = new Map<string, KeyValuePair>();
      currentParams.forEach(p => {
        if (p.enabled && p.key && !existingParamsMap.has(p.key)) {
          existingParamsMap.set(p.key, p);
        }
      });
      
      params.forEach(urlParam => {
        existingParamsMap.set(urlParam.key, urlParam);
      });
      
      const mergedParams = Array.from(existingParamsMap.values());
      
      setConfig({ 
        url: fullUrl,
        params: mergedParams
      });
    }
  };

  const handleBlur = () => {
    if (!shouldSkipValidation) {
      const { fullUrl, params } = parseUrlParams(inputValue.trim());
      
      setConfig({ 
        url: fullUrl,
        params: params.length > 0 ? params : currentParams
      });
    }
  };

  const requestCount = calculateRequestCount(config);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700">
          URL or cURL Command
        </label>
        <div className="flex items-center gap-2">
          {requestCount > 1 && (
            <span className="text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-700">
              {requestCount} requests
            </span>
          )}
          {looksLikeCurl && (
            <span className="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-700">
              cURL detected
            </span>
          )}
        </div>
      </div>
      {looksLikeCurl ? (
        <div>
          <textarea
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={`curl -X POST https://api.example.com/endpoint -H 'Content-Type: application/json' -d '{"key":"value"}'`}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-blue-900/30 font-mono text-sm shadow-sm resize-none hover:border-gray-300 dark:hover:border-gray-600"
            rows={4}
          />
        </div>
      ) : (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://api.example.com/endpoint or curl command..."
          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900/30 shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
        />
      )}
    </div>
  );
}

