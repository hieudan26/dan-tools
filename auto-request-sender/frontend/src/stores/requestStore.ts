import { create } from 'zustand';
import { RequestConfig, Response, Statistics, ExecutionState, ExecutionSettings } from '../types';
import { calculateStatistics } from '../utils/statistics';

interface RequestStore {
  config: RequestConfig;
  executionState: ExecutionState;
  executionSettings: ExecutionSettings;
  responses: Response[];
  statistics: Statistics;
  darkMode: boolean;
  
  setConfig: (config: Partial<RequestConfig>) => void;
  setExecutionState: (state: ExecutionState) => void;
  setExecutionSettings: (settings: Partial<ExecutionSettings>) => void;
  addResponse: (response: Response) => void;
  clearResponses: () => void;
  updateStatistics: () => void;
  toggleDarkMode: () => void;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
  resetAll: () => void;
}

const defaultConfig: RequestConfig = {
  url: '',
  method: 'GET',
  headers: [],
  params: [],
  body: [],
  bodyType: 'json',
  corsBypassMode: 'off',
  corsProxy: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/proxy',
};

const defaultSettings: ExecutionSettings = {
  delayBetweenBatches: 1000,
  concurrentConnections: 1,
  totalRequests: 10,
};

const defaultStatistics: Statistics = {
  totalRequests: 0,
  successCount: 0,
  errorCount: 0,
  averageResponseTime: 0,
  minResponseTime: 0,
  maxResponseTime: 0,
  requestsPerSecond: 0,
  successRate: 0,
};

export const useRequestStore = create<RequestStore>((set, get) => ({
  config: defaultConfig,
  executionState: 'idle',
  executionSettings: defaultSettings,
  responses: [],
  statistics: defaultStatistics,
  darkMode: false,

  setConfig: (partialConfig) => {
    set((state) => ({
      config: { ...state.config, ...partialConfig },
    }));
    get().saveToLocalStorage();
  },

  setExecutionState: (state) => {
    set({ executionState: state });
  },

  setExecutionSettings: (settings) => {
    set((state) => ({
      executionSettings: { ...state.executionSettings, ...settings },
    }));
    get().saveToLocalStorage();
  },

  addResponse: (response) => {
    set((state) => {
      const exists = state.responses.some((r) => r.id === response.id);
      if (exists) {
        return state;
      }
      const newResponses = [...state.responses, response];
      return { responses: newResponses };
    });
    get().updateStatistics();
  },

  clearResponses: () => {
    set({ responses: [], statistics: defaultStatistics });
  },

  updateStatistics: () => {
    const { responses } = get();
    const stats = calculateStatistics(responses);
    set({ statistics: stats });
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(newDarkMode));
      return { darkMode: newDarkMode };
    });
  },

  loadFromLocalStorage: () => {
    try {
      const savedConfig = localStorage.getItem('requestConfig');
      const savedSettings = localStorage.getItem('executionSettings');
      const savedDarkMode = localStorage.getItem('darkMode');

      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.body && !Array.isArray(config.body)) {
          config.body = [];
        }
        set({ config: { ...defaultConfig, ...config } });
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.requestsPerSecond && !settings.delayBetweenBatches) {
          settings.delayBetweenBatches = 1000 / settings.requestsPerSecond;
          delete settings.requestsPerSecond;
        }
        set({ executionSettings: { ...defaultSettings, ...settings } });
      }

      if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark');
        set({ darkMode: true });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  },

  saveToLocalStorage: () => {
    try {
      const { config, executionSettings } = get();
      localStorage.setItem('requestConfig', JSON.stringify(config));
      localStorage.setItem('executionSettings', JSON.stringify(executionSettings));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  resetAll: () => {
    set({
      config: defaultConfig,
      executionSettings: defaultSettings,
      responses: [],
      statistics: defaultStatistics,
      executionState: 'idle',
    });
    try {
      localStorage.removeItem('requestConfig');
      localStorage.removeItem('executionSettings');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
}));

