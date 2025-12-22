// angular import
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent {
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  username: string = '';

  @Output() lockScreen = new EventEmitter<void>();

  // constructor
  constructor(private router: Router) {
    this.visibleUserList = false;
    this.chatMessage = false;
    this.loadUserData();
  }

  // Load user data from localStorage
  loadUserData(): void {
    this.username = localStorage.getItem('username') || 'Guest';
  }

  // Lock screen functionality
  onLockScreen(): void {
    this.lockScreen.emit();
  }

  // Logout functionality
  onLogout(): void {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');

    // Redirect to login page
    this.router.navigate(['/login']);
  }

  // public method
  // eslint-disable-next-line
  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }
}
