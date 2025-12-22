import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, timer } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, TokenResponse, User } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private tokenRefreshSubscription: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = this.storageService.getToken();
    const user = this.storageService.getUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      this.startTokenRefresh();
    }
  }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', credentials.username)
      .set('password', credentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(environment.tokenEndpoint, body.toString(), { headers })
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => this.handleAuthError(error))
      );
  }

  logout(): void {
    this.stopTokenRefresh();
    this.storageService.clearAll();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(environment.tokenEndpoint, body.toString(), { headers })
      .pipe(
        tap(response => {
          this.storageService.setToken(response.access_token);
          if (response.refresh_token) {
            this.storageService.setRefreshToken(response.refresh_token);
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiEndpoint}/account/users/me`)
      .pipe(
        tap(user => {
          this.storageService.setUser(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  private handleAuthSuccess(response: TokenResponse): void {
    this.storageService.setToken(response.access_token);
    if (response.refresh_token) {
      this.storageService.setRefreshToken(response.refresh_token);
    }
    this.isAuthenticatedSubject.next(true);
    this.startTokenRefresh();
  }

  private handleAuthError(error: any): Observable<never> {
    console.error('Authentication error:', error);
    return throwError(() => error);
  }

  private startTokenRefresh(): void {
    this.stopTokenRefresh();
    
    // Refresh token every minute (token expires in 2 minutes)
    this.tokenRefreshSubscription = timer(environment.tokenRefreshInterval, environment.tokenRefreshInterval)
      .pipe(
        switchMap(() => this.refreshToken())
      )
      .subscribe({
        error: (err) => console.error('Token refresh failed:', err)
      });
  }

  private stopTokenRefresh(): void {
    if (this.tokenRefreshSubscription) {
      this.tokenRefreshSubscription.unsubscribe();
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(role) : false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserValue;
    return user ? user.permissions.includes(permission) : false;
  }
}
