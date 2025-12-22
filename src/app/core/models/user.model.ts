import { ModuleAccess } from './jwt-payload.model';

/**
 * User Model
 * 
 * Represents the authenticated user with all their properties,
 * roles, permissions, and module access.
 */
export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  
  // Authorization
  roles: string[];
  permissions: string[];
  type: string;  // superadmin, admin, employee, candidate
  
  // Module Access Control
  moduleAccess: ModuleAccess;
  
  // Optional properties
  isEnabled?: boolean;
  configuration?: any;  // User-specific app configuration
}

/**
 * Login Request Model
 */
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Token Response from OAuth2 /connect/token endpoint
 */
export interface TokenResponse {
  access_token: string;
  id_token: string;         // JWT containing user claims
  refresh_token?: string;
  token_type: string;       // "Bearer"
  expires_in: number;       // Seconds until expiration (typically 120)
}

/**
 * Storage keys for localStorage/sessionStorage
 */
export const StorageKeys = {
  ACCESS_TOKEN: 'access_token',
  ID_TOKEN: 'id_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  REMEMBER_ME: 'remember_me',
  TOKEN_EXPIRES_AT: 'token_expires_at',
  REDIRECT_URL: 'redirect_url'
} as const;
