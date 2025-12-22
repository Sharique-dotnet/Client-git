export const APP_CONSTANTS = {
  APP_NAME: 'Empower Client',
  APP_VERSION: '1.0.0',
  API_BASE_URL: '/api',
  DEFAULT_LANGUAGE: 'en',
  SESSION_TIMEOUT: 10 * 60 * 1000, // 10 minutes
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'username',
  IS_AUTHENTICATED: 'isAuthenticated',
  REMEMBER_ME: 'rememberMe',
};

export const ROUTE_PATHS = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login',
    REGISTER: 'register',
    RESET_PASSWORD: 'reset-password',
  },
  DASHBOARD: {
    BASE: 'dashboard',
  },
};
