// Angular Import
import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, Location, LocationStrategy } from '@angular/common';

// Project Import - Using existing theme components
import { ConfigurationComponent } from '../../theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from '../../theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from '../../theme/layout/admin/navigation/navigation.component';
import { BreadcrumbComponent } from '../../theme/shared/components/breadcrumb/breadcrumb.component';
import { Footer } from '../../theme/layout/admin/footer/footer';
import { LockScreenComponent } from '../../theme/layout/admin/lock-screen/lock-screen.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    BreadcrumbComponent,
    Footer,
    LockScreenComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
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

  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
  }

  ngOnInit(): void {
    this.resetInactivityTimer();
  }

  ngOnDestroy(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

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
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
        document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
      }
    }
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.lockScreen();
    }, this.INACTIVITY_TIMEOUT);
  }

  lockScreen(): void {
    this.isLocked = true;
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  unlockScreen(success: boolean): void {
    if (success) {
      this.isLocked = false;
      this.resetInactivityTimer();
    }
  }

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
