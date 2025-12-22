import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

/**
 * Login Component
 * 
 * Handles user authentication with username/password.
 * Based on Angular 4 ClientApp login pattern.
 * 
 * Features:
 * - Form validation
 * - Remember Me functionality
 * - Error handling with OAuth2 error_description
 * - Loading state
 * - Auto-redirect if already logged in
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  private loginSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Auto-redirect if already authenticated
    if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.authService.redirectAfterLogin();
    }
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe ?? false
    };

    this.loginSubscription = this.authService.login(loginRequest).subscribe({
      next: () => {
        console.log('Login successful');
        this.isLoading = false;
        
        // Redirect based on user role (handled in authService)
        this.authService.redirectAfterLogin();
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        // Extract error_description from OAuth2 response (like ClientApp)
        if (error.error?.error_description) {
          this.errorMessage = error.error.error_description;
        }
        else if (error.error?.error) {
          this.errorMessage = this.getErrorMessage(error.error.error);
        }
        else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your network connection.';
        }
        else if (error.status === 400) {
          this.errorMessage = 'Invalid username or password.';
        }
        else if (error.status === 401) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
        else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
      }
    });
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'invalid_grant': 'Invalid username or password.',
      'invalid_client': 'Invalid client configuration.',
      'unsupported_grant_type': 'Unsupported authentication method.',
      'invalid_scope': 'Invalid permission scope requested.'
    };

    return errorMessages[errorCode] || 'Authentication failed. Please try again.';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Convenience getters for template
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }
}
