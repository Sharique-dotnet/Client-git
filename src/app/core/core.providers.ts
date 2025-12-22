import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

// Add interceptors here as they are created
// import { authInterceptor } from './interceptors/auth.interceptor';

// Note: AuthService is already provided in 'root' via @Injectable in features/auth/services/auth.service.ts
// No need to add it here

export const CORE_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  provideHttpClient(
    // withInterceptors([authInterceptor])
  ),
];
