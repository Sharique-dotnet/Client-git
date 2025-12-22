// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  // Default credentials
  private readonly DEFAULT_USERNAME = 'admin';
  private readonly DEFAULT_PASSWORD = 'admin123';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [this.DEFAULT_USERNAME, [Validators.required]],
      password: [this.DEFAULT_PASSWORD, [Validators.required]],
      rememberMe: [true]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { username, password } = this.loginForm.value;

    // Validate credentials
    if (username === this.DEFAULT_USERNAME && password === this.DEFAULT_PASSWORD) {
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);

      // Redirect to sample page
      this.router.navigate(['/sample-page']);
    } else {
      this.errorMessage = 'Invalid username or password. Use admin/admin123';
    }
  }
}
