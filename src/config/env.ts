// Environment configuration
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:10500',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;
