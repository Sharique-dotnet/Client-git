export const environment = {
  production: true,
  apiUrl: 'https://api.empower360plus.com',
  apiEndpoint: 'https://api.empower360plus.com/api',
  tokenEndpoint: 'https://api.empower360plus.com/connect/token',
  tokenRefreshInterval: 60000, // 1 minute (token expires in 2 minutes)
  clientId: 'empower-angular-client',
  appName: 'Empower360Plus',
  appVersion: '1.0.0',
  // Add retry configuration
  httpRetry: {
    count: 3,
    delay: 1000
  },
  // Timeout configuration
  httpTimeout: 30000 // 30 seconds
};
