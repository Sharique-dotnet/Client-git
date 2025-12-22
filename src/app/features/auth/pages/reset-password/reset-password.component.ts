import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  emailSent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Simulate sending reset email
    this.emailSent = true;
    this.successMessage = 'Password reset instructions have been sent to your email.';
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
