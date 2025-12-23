import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, timer } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { User, LoginRequest, TokenResponse } from '../models/user.model';
import { 
  IdTokenPayload, 
  parseModuleAccess, 
  normalizeRoles, 
  normalizePermissions 
} from '../models/jwt-payload.model';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/**
 * Authentication Service
 * 
 * Implements OAuth2 Password Grant flow with JWT token decoding.
 * Based on Angular 4 ClientApp authentication pattern, modernized for Angular 20.
 * 
 * Key Features:
 * - JWT id_token decoding for user data (no /users/me API call needed)
 * - Remember Me functionality (localStorage vs sessionStorage)
 * - Automatic token refresh
 * - Role-based redirect logic
 * - Module access control from JWT claims
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenEndpoint = `${environment.apiUrl}/connect/token`;
  
  // BehaviorSubjects for backward compatibility
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  // Signals for modern reactive patterns
  private currentUserSignal = signal<User | null>(null);
  
  // Public observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // Computed signals
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly userRoles = computed(() => this.currentUser()?.roles ?? []);
  public readonly userPermissions = computed(() => this.currentUser()?.permissions ?? []);
  public readonly moduleAccess = computed(() => this.currentUser()?.moduleAccess);
  public readonly isAuthenticated = computed(() => this.currentUser() !== null);
  
  // Token refresh timer
  private refreshTokenTimer?: any;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuth(): void {
    const user = this.storageService.getCurrentUser();
    const token = this.storageService.getToken();
    
    if (user && token && !this.storageService.isTokenExpired()) {
      this.currentUserSignal.set(user);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      this.startTokenRefresh();
    } else {
      this.clearAuthState();
    }
  }

  /**
   * Login with username and password (OAuth2 Password Grant)
   */
  login(request: LoginRequest): Observable<TokenResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', request.username);
    body.set('password', request.password);
    body.set('scope', 'openid profile email phone roles offline_access');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(this.tokenEndpoint, body.toString(), { headers })
      .pipe(
        tap(response => this.handleAuthSuccess(response, request.rememberMe)),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Handle successful authentication
   * Decodes JWT id_token to extract user information
   */
  private handleAuthSuccess(response: TokenResponse, rememberMe: boolean = false): void {
    const expiresAt = Date.now() + (response.expires_in * 1000);
    
    // Store tokens
    this.storageService.setToken(response.access_token, rememberMe);
    this.storageService.setIdToken(response.id_token, rememberMe);
    if (response.refresh_token) {
      this.storageService.setRefreshToken(response.refresh_token, rememberMe);
    }
    this.storageService.setTokenExpiresAt(expiresAt, rememberMe);
    this.storageService.setRememberMe(rememberMe);
    
    // Decode JWT id_token to extract user data
    const user = this.decodeIdToken(response.id_token);
    
    // Store user
    this.storageService.setCurrentUser(user, rememberMe);
    
    // Update state
    this.currentUserSignal.set(user);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    
    // Start token refresh
    this.startTokenRefresh();
  }

  /**
   * Decode JWT id_token and build User object
   * Implements the same logic as Angular 4 ClientApp
   */
  private decodeIdToken(idToken: string): User {
    try {
      const decoded = jwtDecode<IdTokenPayload>(idToken);
      
      return {
        id: decoded.sub,
        userName: decoded.name,
        fullName: decoded.fullname,
        email: decoded.email,
        phoneNumber: decoded.phone,
        roles: normalizeRoles(decoded.role),
        permissions: normalizePermissions(decoded.permission),
        type: decoded.type,
        moduleAccess: parseModuleAccess(decoded),
        isEnabled: true,
        configuration: decoded.configuration
      };
    } catch (error) {
      console.error('Error decoding id_token:', error);
      throw new Error('Invalid token format');
    }
  }

  /**
   * Refresh access token using refresh_token
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(this.tokenEndpoint, body.toString(), { headers })
      .pipe(
        tap(response => {
          const rememberMe = this.storageService.getRememberMe();
          this.handleAuthSuccess(response, rememberMe);
        }),
        catchError(error => {
          console.error('Token refresh failed:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Start automatic token refresh
   * Refreshes 10 seconds before expiration
   */
  private startTokenRefresh(): void {
    this.stopTokenRefresh();
    
    const expiresAt = this.storageService.getTokenExpiresAt();
    if (!expiresAt) return;
    
    const expiresIn = expiresAt - Date.now();
    const refreshIn = Math.max(expiresIn - 10000, 0); // 10 seconds before expiry
    
    if (refreshIn > 0) {
      this.refreshTokenTimer = timer(refreshIn).pipe(
        switchMap(() => this.refreshToken())
      ).subscribe({
        error: (err) => console.error('Auto refresh failed:', err)
      });
    }
  }

  /**
   * Stop token refresh timer
   */
  private stopTokenRefresh(): void {
    if (this.refreshTokenTimer) {
      this.refreshTokenTimer.unsubscribe();
      this.refreshTokenTimer = undefined;
    }
  }

  /**
   * Logout and clear all authentication data
   * Pattern from Angular 4 ClientApp AuthService
   */
  logout(): void {
    this.stopTokenRefresh();
    this.storageService.clearAuthData();
    this.clearAuthState();
  }

  /**
   * Redirect user to login page after logout
   * Pattern from Angular 4 ClientApp AuthService
   */
  redirectLogoutUser(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this.currentUserSignal.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Redirect user after successful login based on their role
   * Implements the same logic as Angular 4 ClientApp
   */
  redirectAfterLogin(): void {
    const user = this.currentUserSignal();
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Check for saved redirect URL
    const redirectUrl = this.storageService.getRedirectUrl();
    if (redirectUrl) {
      this.storageService.clearRedirectUrl();
      this.router.navigateByUrl(redirectUrl);
      return;
    }

    // Role-based routing (from Angular 4 ClientApp)
    if (user.roles.includes('candidate')) {
      this.router.navigate(['/candidate/job-application']);
    }
    else if (user.type === 'superadmin') {
      this.router.navigate(['/administrator/client']);
    }
    else if (user.roles.includes('administrator')) {
      this.router.navigate(['/dashboard']);
    }
    else if (user.roles.includes('Employee')) {
      this.router.navigate(['/dashboard']);
    }
    else {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.currentUser()?.permissions ?? [];
    return permissions.includes(permission);
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const roles = this.currentUser()?.roles ?? [];
    return roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.currentUser()?.roles ?? [];
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Get access token for HTTP requests
   */
  getAccessToken(): string | null {
    return this.storageService.getToken();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    return this.storageService.isTokenExpired();
  }
}
