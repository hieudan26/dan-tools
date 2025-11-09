import { useEffect, useState } from 'react';
import { Container } from './components/Layout/Container';
import { Header } from './components/Layout/Header';
import { UrlInput } from './components/RequestConfig/UrlInput';
import { MethodSelector } from './components/RequestConfig/MethodSelector';
import { CorsBypass } from './components/RequestConfig/CorsBypass';
import { HeadersEditor } from './components/RequestConfig/HeadersEditor';
import { ParamsEditor } from './components/RequestConfig/ParamsEditor';
import { BodyEditor } from './components/RequestConfig/BodyEditor';
import { SpeedControl } from './components/ExecutionControl/SpeedControl';
import { ConcurrentControl } from './components/ExecutionControl/ConcurrentControl';
import { StartStopButton } from './components/ExecutionControl/StartStopButton';
import { ResponseList } from './components/ResponseDisplay/ResponseList';
import { Statistics } from './components/ResponseDisplay/Statistics';
import { useRequestStore } from './stores/requestStore';
import { parseCurl } from './utils/curlParser';

function App() {
  const loadFromLocalStorage = useRequestStore((state) => state.loadFromLocalStorage);
  const config = useRequestStore((state) => state.config);
  const setConfig = useRequestStore((state) => state.setConfig);
  const [inputValue, setInputValue] = useState(config.url);
  const [isParsing, setIsParsing] = useState(false);
  const [isFromParse, setIsFromParse] = useState(false);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (!isFromParse) {
      setInputValue(config.url);
    }
  }, [config.url, isFromParse]);

  const looksLikeCurl = inputValue.trim().toLowerCase().startsWith('curl');

  const handleParseClick = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue.toLowerCase().startsWith('curl')) {
      return;
    }

    setIsParsing(true);
    setIsFromParse(true);
    setTimeout(() => {
      const parsed = parseCurl(trimmedValue);
      if (parsed) {
        setConfig(parsed);
        setTimeout(() => {
          setInputValue(parsed.url || '');
          setIsParsing(false);
          setTimeout(() => {
            setIsFromParse(false);
          }, 100);
        }, 0);
      } else {
        alert('Invalid cURL command');
        setIsParsing(false);
        setIsFromParse(false);
      }
    }, 100);
  };

  return (
    <Container>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-800">Request Configuration</h2>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <UrlInput inputValue={inputValue} setInputValue={setInputValue} skipValidation={isParsing} />
                  </div>
                  <div className="sm:w-48 space-y-3">
                    <MethodSelector />
                    {looksLikeCurl && (
                      <button
                        onClick={handleParseClick}
                        disabled={isParsing}
                        className="w-full px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ minHeight: '56px' }}
                      >
                        {isParsing ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Parsing...</span>
                          </>
                        ) : (
                          <span>Parse cURL</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <CorsBypass />
                <BodyEditor />
                <HeadersEditor />
                <ParamsEditor />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-800">Execution Control</h2>
              <div className="space-y-6">
                <SpeedControl />
                <ConcurrentControl />
                <StartStopButton />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <ResponseList />
            </div>
          </div>

          <div className="space-y-6">
            <Statistics />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default App;

