import { Injectable } from '@angular/core';
import { StorageKeys, User } from '../models/user.model';

/**
 * Storage Service
 * 
 * Manages localStorage and sessionStorage for authentication tokens and user data.
 * Implements "Remember Me" functionality by using localStorage for permanent storage
 * and sessionStorage for temporary storage.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  /**
   * Save data with Remember Me logic
   * - If rememberMe is true, uses localStorage (persists across sessions)
   * - If rememberMe is false, uses sessionStorage (clears on browser close)
   */
  private saveData(key: string, value: string, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(key, value);
  }

  /**
   * Get data from either localStorage or sessionStorage
   */
  private getData(key: string): string | null {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  /**
   * Remove data from both storages
   */
  private removeData(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  // Token Management

  setToken(token: string, rememberMe: boolean = false): void {
    this.saveData(StorageKeys.ACCESS_TOKEN, token, rememberMe);
  }

  getToken(): string | null {
    return this.getData(StorageKeys.ACCESS_TOKEN);
  }

  setIdToken(token: string, rememberMe: boolean = false): void {
    this.saveData(StorageKeys.ID_TOKEN, token, rememberMe);
  }

  getIdToken(): string | null {
    return this.getData(StorageKeys.ID_TOKEN);
  }

  setRefreshToken(token: string, rememberMe: boolean = false): void {
    this.saveData(StorageKeys.REFRESH_TOKEN, token, rememberMe);
  }

  getRefreshToken(): string | null {
    return this.getData(StorageKeys.REFRESH_TOKEN);
  }

  // User Management

  setCurrentUser(user: User, rememberMe: boolean = false): void {
    this.saveData(StorageKeys.CURRENT_USER, JSON.stringify(user), rememberMe);
  }

  getCurrentUser(): User | null {
    const userData = this.getData(StorageKeys.CURRENT_USER);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Remember Me

  setRememberMe(rememberMe: boolean): void {
    localStorage.setItem(StorageKeys.REMEMBER_ME, String(rememberMe));
  }

  getRememberMe(): boolean {
    return localStorage.getItem(StorageKeys.REMEMBER_ME) === 'true';
  }

  // Token Expiration

  setTokenExpiresAt(expiresAt: number, rememberMe: boolean = false): void {
    this.saveData(StorageKeys.TOKEN_EXPIRES_AT, String(expiresAt), rememberMe);
  }

  getTokenExpiresAt(): number | null {
    const expiresAt = this.getData(StorageKeys.TOKEN_EXPIRES_AT);
    return expiresAt ? Number(expiresAt) : null;
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiresAt();
    if (!expiresAt) return true;
    
    return Date.now() >= expiresAt;
  }

  // Redirect URL (for post-login navigation)

  setRedirectUrl(url: string): void {
    sessionStorage.setItem(StorageKeys.REDIRECT_URL, url);
  }

  getRedirectUrl(): string | null {
    return sessionStorage.getItem(StorageKeys.REDIRECT_URL);
  }

  clearRedirectUrl(): void {
    sessionStorage.removeItem(StorageKeys.REDIRECT_URL);
  }

  // Clear All Authentication Data

  clearAuthData(): void {
    this.removeData(StorageKeys.ACCESS_TOKEN);
    this.removeData(StorageKeys.ID_TOKEN);
    this.removeData(StorageKeys.REFRESH_TOKEN);
    this.removeData(StorageKeys.CURRENT_USER);
    this.removeData(StorageKeys.TOKEN_EXPIRES_AT);
    // Keep REMEMBER_ME for UX
  }

  // Complete Clear (including Remember Me)

  clearAll(): void {
    this.clearAuthData();
    localStorage.removeItem(StorageKeys.REMEMBER_ME);
    this.clearRedirectUrl();
  }
}
