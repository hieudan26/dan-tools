import { useState } from 'react';

interface NumberRangeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

type GeneratorMode = 'sequential' | 'random';

export function NumberRangeGenerator({ isOpen, onClose }: NumberRangeGeneratorProps) {
  const [mode, setMode] = useState<GeneratorMode>('sequential');
  const [startNumber, setStartNumber] = useState<number>(1);
  const [endNumber, setEndNumber] = useState<number>(100);
  const [totalLines, setTotalLines] = useState<number>(100);
  const [prefix, setPrefix] = useState<string>('');
  const [postfix, setPostfix] = useState<string>('');
  const [randomLength, setRandomLength] = useState<number>(8);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeLetters, setIncludeLetters] = useState<boolean>(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState<boolean>(false);
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);

  const generateRandomString = (length: number): string => {
    let charset = '';
    if (includeNumbers) charset += '0123456789';
    if (includeLetters) charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeSpecialChars) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset.length === 0) {
      alert('Please select at least one character type (numbers, letters, or special characters)');
      return '';
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  };

  const handleGenerate = () => {
    const lines: string[] = [];

    if (mode === 'sequential') {
      if (startNumber > endNumber) {
        alert('Start number must be less than or equal to end number');
        return;
      }

      for (let i = startNumber; i <= endNumber; i++) {
        lines.push(`${prefix}${i}${postfix}`);
      }
    } else {
      if (totalLines <= 0) {
        alert('Total lines must be greater than 0');
        return;
      }

      if (!includeNumbers && !includeLetters && !includeSpecialChars) {
        alert('Please select at least one character type');
        return;
      }

      for (let i = 0; i < totalLines; i++) {
        const randomStr = generateRandomString(randomLength);
        lines.push(`${prefix}${randomStr}${postfix}`);
      }
    }

    setGeneratedLines(lines);
  };

  const handleExport = () => {
    if (generatedLines.length === 0) {
      alert('Please generate content first');
      return;
    }

    const content = generatedLines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = mode === 'sequential' 
      ? `numbers-${startNumber}-to-${endNumber}.txt`
      : `random-${totalLines}lines-${randomLength}chars.txt`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculatedTotalLines = mode === 'sequential' 
    ? (endNumber >= startNumber ? endNumber - startNumber + 1 : 0)
    : totalLines;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Text Generator</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Generation Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('sequential')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    mode === 'sequential'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Sequential Numbers
                </button>
                <button
                  onClick={() => setMode('random')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    mode === 'random'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Random Strings
                </button>
              </div>
            </div>

            {mode === 'sequential' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Number
                  </label>
                  <input
                    type="number"
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Number
                  </label>
                  <input
                    type="number"
                    value={endNumber}
                    onChange={(e) => setEndNumber(parseInt(e.target.value) || 100)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Total Lines
                  </label>
                  <input
                    type="number"
                    value={totalLines}
                    onChange={(e) => setTotalLines(parseInt(e.target.value) || 100)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Character Length
                  </label>
                  <input
                    type="number"
                    value={randomLength}
                    onChange={(e) => setRandomLength(parseInt(e.target.value) || 8)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Character Types
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLetters}
                        onChange={(e) => setIncludeLetters(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Letters (a-z, A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSpecialChars}
                        onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Special Characters (!@#$%^&*...)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Prefix (optional)
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g., user_"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Postfix (optional)
                </label>
                <input
                  type="text"
                  value={postfix}
                  onChange={(e) => setPostfix(e.target.value)}
                  placeholder="e.g., _id"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  {mode === 'sequential' 
                    ? `Will generate ${calculatedTotalLines.toLocaleString()} lines (${startNumber} to ${endNumber})`
                    : `Will generate ${calculatedTotalLines.toLocaleString()} random strings, each ${randomLength} characters long`
                  }
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Generate
              </button>
              <button
                onClick={handleExport}
                disabled={generatedLines.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Export TXT
              </button>
            </div>

            {generatedLines.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Preview ({generatedLines.length} lines)
                  </label>
                  <button
                    onClick={() => {
                      const content = generatedLines.join('\n');
                      navigator.clipboard.writeText(content);
                      alert('Copied to clipboard!');
                    }}
                    className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Copy All
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-64 overflow-y-auto custom-scrollbar">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                    {generatedLines.slice(0, 100).join('\n')}
                    {generatedLines.length > 100 && `\n... and ${(generatedLines.length - 100).toLocaleString()} more lines`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

