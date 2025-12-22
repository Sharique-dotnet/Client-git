// Authentication Models

export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  jobTitle?: string;
  phoneNumber?: string;
  roles: string[];
  permissions: string[];
  isEnabled: boolean;
}

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  jobTitle?: string;
  phoneNumber?: string;
  configuration?: string;
  isEnabled: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
