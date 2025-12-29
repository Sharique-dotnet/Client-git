/**
 * JWT ID Token Payload Interface
 * 
 * This interface represents the claims contained in the id_token JWT
 * returned from the OAuth2 token endpoint.
 * 
 * The id_token contains all user information and module access permissions,
 * eliminating the need to call /api/account/users/me after login.
 */
export interface IdTokenPayload {
  // Standard JWT Claims
  sub: string;                    // Subject (User ID)
  iss?: string;                   // Issuer
  aud?: string;                   // Audience
  exp?: number;                   // Expiration time
  iat?: number;                   // Issued at
  
  // User Identity Claims
  name: string;                   // Username (login name)
  fullname: string;               // Full display name
  email: string;                  // Email address
  phone?: string;                 // Phone number
  
  // Authorization Claims
  role: string | string[];        // User role(s) - can be single string or array
  permission: string | string[];  // Permission(s) - can be single string or array
  type: string;                   // User type (superadmin, admin, employee, candidate)
  
  // Module Access Flags (string "1" = enabled, "0" = disabled)
  leave?: string;                 // Leave Management module
  performance?: string;           // Performance Management module
  timesheet?: string;             // Timesheet module
  expanseManagement?: string;     // Expense Management module (note: spelling from API)
  recruitment?: string;           // Recruitment module
  salesMarketing?: string;        // Sales & Marketing module
  
  // Application Configuration
  configuration?: string;         // User-specific app configuration JSON
}

/**
 * Helper type to ensure module access flags are properly typed
 */
export interface ModuleAccess {
  leave: boolean;
  performance: boolean;
  timesheet: boolean;
  expenseManagement: boolean;     // Note: corrected spelling for TypeScript
  recruitment: boolean;
  salesMarketing: boolean;
}

/**
 * Helper function to convert JWT module flags to boolean
 */
export function parseModuleAccess(payload: IdTokenPayload): ModuleAccess {
  return {
    leave: payload.leave === '1',
    performance: payload.performance === '1',
    timesheet: payload.timesheet === '1',
    expenseManagement: payload.expanseManagement === '1',  // Map from API spelling
    recruitment: payload.recruitment === '1',
    salesMarketing: payload.salesMarketing === '1'
  };
}

/**
 * Helper function to ensure roles are always returned as an array
 */
export function normalizeRoles(role: string | string[]): string[] {
  return Array.isArray(role) ? role : [role];
}

/**
 * Helper function to ensure permissions are always returned as an array
 */
export function normalizePermissions(permission: string | string[]): string[] {
  return Array.isArray(permission) ? permission : [permission];
}
