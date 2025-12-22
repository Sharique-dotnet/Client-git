// Angular Import
import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, Location, LocationStrategy } from '@angular/common';

// Project Import
import { ConfigurationComponent } from './configuration/configuration.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { Footer } from './footer/footer';
import { LockScreenComponent } from './lock-screen/lock-screen.component';

@Component({
  selector: 'app-admin',
  imports: [ConfigurationComponent, RouterModule, NavBarComponent, NavigationComponent, CommonModule, BreadcrumbComponent, Footer, LockScreenComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);

  // public props
  navCollapsed!: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;

  // Lock screen props
  isLocked: boolean = false;
  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  // constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
  }

  ngOnInit(): void {
    // Start inactivity timer
    this.resetInactivityTimer();
  }

  ngOnDestroy(): void {
    // Clear timer on component destroy
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  // Detect user activity for auto-lock
  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  @HostListener('document:scroll')
  onUserActivity(): void {
    if (!this.isLocked) {
      this.resetInactivityTimer();
    }
  }

  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
        document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
      }
    }
  }

  // Reset inactivity timer
  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.lockScreen();
    }, this.INACTIVITY_TIMEOUT);
  }

  // Lock screen manually or automatically
  lockScreen(): void {
    this.isLocked = true;
    // Stop inactivity timer when locked
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  // Unlock screen
  unlockScreen(success: boolean): void {
    if (success) {
      this.isLocked = false;
      // Restart inactivity timer after unlock
      this.resetInactivityTimer();
    }
  }

  // public method
  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
  }
}
