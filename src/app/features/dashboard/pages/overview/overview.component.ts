import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Dashboard Overview Component
 * 
 * Displays module-based task cards based on user's module access.
 * Pattern based on Angular 4 ClientApp dashboard-default component.
 * 
 * Features:
 * - Module-specific task cards (Leave, Timesheet, Performance, Recruitment)
 * - Conditional rendering based on moduleAccess from JWT
 * - Modern Angular 20 standalone component
 */
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  private authService = inject(AuthService);
  
  // User information
  currentUser = this.authService.currentUser;
  
  // Module access flags (from JWT claims)
  isLeave = false;
  isTimesheet = false;
  isPerformance = false;
  isRecruitment = false;
  isExpenseManagement = false;
  isSalesMarketing = false;
  
  // Task lists (to be populated from API later)
  leaveTaskList: any[] = [];
  timesheetTaskList: any[] = [];
  performanceTaskList: any[] = [];
  recruitmentTaskList: any[] = [];
  
  loadingIndicator = true;

  ngOnInit(): void {
    this.initializeModuleAccess();
    this.loadDashboardData();
  }

  /**
   * Initialize module access flags from user's JWT claims
   * Same pattern as Angular 4 ClientApp
   */
  private initializeModuleAccess(): void {
    const moduleAccess = this.authService.moduleAccess();
    
    if (moduleAccess) {
      this.isLeave = moduleAccess.leave;
      this.isTimesheet = moduleAccess.timesheet;
      this.isPerformance = moduleAccess.performance;
      this.isRecruitment = moduleAccess.recruitment;
      this.isExpenseManagement = moduleAccess.expenseManagement;
      this.isSalesMarketing = moduleAccess.salesMarketing;
    }
  }

  /**
   * Load dashboard data based on enabled modules
   * TODO: Integrate with DashboardService when ready
   */
  private loadDashboardData(): void {
    // Simulate data loading
    setTimeout(() => {
      this.loadingIndicator = false;
      
      // Mock data for demonstration
      // In production, this will call dashboard service APIs
      if (this.isLeave) {
        this.leaveTaskList = [
          // Will be populated from API
        ];
      }
      
      if (this.isTimesheet) {
        this.timesheetTaskList = [
          // Will be populated from API
        ];
      }
      
      if (this.isPerformance) {
        this.performanceTaskList = [
          // Will be populated from API
        ];
      }
    }, 500);
  }

  /**
   * Get greeting message based on time of day
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
