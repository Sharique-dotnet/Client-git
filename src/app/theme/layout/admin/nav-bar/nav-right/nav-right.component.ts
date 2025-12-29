// angular import
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/core/services/auth.service';

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
  // services
  private authService = inject(AuthService);
  
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;

  @Output() lockScreen = new EventEmitter<void>();

  // constructor
  constructor(private router: Router) {
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  // Get username from AuthService
  get username(): string {
    return this.authService.currentUser()?.fullName || 'Guest';
  }

  // Lock screen functionality
  onLockScreen(): void {
    this.lockScreen.emit();
  }

  /**
   * Logout functionality
   * Pattern from Angular 4 ClientApp admin.component
   */
  onLogout(): void {
    this.authService.logout();
    this.authService.redirectLogoutUser();
  }

  // public method
  // eslint-disable-next-line
  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }
}
