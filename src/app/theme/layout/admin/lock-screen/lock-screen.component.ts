import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {
  @Output() unlockScreen = new EventEmitter<boolean>();

  lockForm: FormGroup;
  username: string = '';
  errorMessage: string = '';
  lockedTime: string = '';

  private readonly STORED_PASSWORD = 'admin123'; // Default password

  constructor(private fb: FormBuilder) {
    this.lockForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'User';
    this.lockedTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  onUnlock(): void {
    this.errorMessage = '';

    if (this.lockForm.invalid) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    const password = this.lockForm.value.password;

    // Validate password
    if (password === this.STORED_PASSWORD) {
      // Unlock successful
      this.unlockScreen.emit(true);
    } else {
      this.errorMessage = 'Incorrect password. Please try again.';
      this.lockForm.patchValue({ password: '' });
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onUnlock();
    }
  }
}
