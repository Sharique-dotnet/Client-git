export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001',
  apiEndpoint: 'https://localhost:5001/api',
  tokenEndpoint: 'https://localhost:5001/connect/token',
  tokenRefreshInterval: 60000, // 1 minute (token expires in 2 minutes)
  clientId: 'empower-angular-client',
  appName: 'Empower360Plus',
  // Add retry configuration
  httpRetry: {
    count: 3,
    delay: 1000
  },
  // Timeout configuration
  httpTimeout: 30000 // 30 seconds
};
