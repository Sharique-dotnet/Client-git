export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        classes: 'nav-item',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'modules',
    title: 'Modules',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'employee',
        title: 'Employee Management',
        type: 'collapse',
        icon: 'feather icon-users',
        children: [
          {
            id: 'employee-list',
            title: 'Employee List',
            type: 'item',
            url: '/employees',
            icon: 'feather icon-list'
          },
          {
            id: 'departments',
            title: 'Departments',
            type: 'item',
            url: '/departments',
            icon: 'feather icon-briefcase'
          },
          {
            id: 'designations',
            title: 'Designations',
            type: 'item',
            url: '/designations',
            icon: 'feather icon-award'
          }
        ]
      },
      {
        id: 'leave',
        title: 'Leave Management',
        type: 'collapse',
        icon: 'feather icon-calendar',
        children: [
          {
            id: 'my-leaves',
            title: 'My Leaves',
            type: 'item',
            url: '/leaves/my-leaves',
            icon: 'feather icon-calendar'
          },
          {
            id: 'leave-requests',
            title: 'Leave Requests',
            type: 'item',
            url: '/leaves/requests',
            icon: 'feather icon-inbox'
          }
        ]
      },
      {
        id: 'timesheet',
        title: 'Timesheet',
        type: 'collapse',
        icon: 'feather icon-clock',
        children: [
          {
            id: 'my-timesheet',
            title: 'My Timesheet',
            type: 'item',
            url: '/timesheet/my-timesheet',
            icon: 'feather icon-clock'
          },
          {
            id: 'manage-timesheet',
            title: 'Manage Timesheet',
            type: 'item',
            url: '/timesheet/manage',
            icon: 'feather icon-check-square'
          }
        ]
      },
      {
        id: 'recruitment',
        title: 'Recruitment',
        type: 'collapse',
        icon: 'feather icon-user-plus',
        children: [
          {
            id: 'job-vacancies',
            title: 'Job Vacancies',
            type: 'item',
            url: '/recruitment/vacancies',
            icon: 'feather icon-briefcase'
          },
          {
            id: 'candidates',
            title: 'Candidates',
            type: 'item',
            url: '/recruitment/candidates',
            icon: 'feather icon-users'
          },
          {
            id: 'interviews',
            title: 'Interviews',
            type: 'item',
            url: '/recruitment/interviews',
            icon: 'feather icon-message-square'
          }
        ]
      },
      {
        id: 'performance',
        title: 'Performance',
        type: 'collapse',
        icon: 'feather icon-trending-up',
        children: [
          {
            id: 'my-goals',
            title: 'My Goals',
            type: 'item',
            url: '/performance/my-goals',
            icon: 'feather icon-target'
          },
          {
            id: 'review-goals',
            title: 'Review Goals',
            type: 'item',
            url: '/performance/review',
            icon: 'feather icon-check-circle'
          }
        ]
      },
      {
        id: 'expense',
        title: 'Expense Management',
        type: 'collapse',
        icon: 'feather icon-dollar-sign',
        children: [
          {
            id: 'my-expenses',
            title: 'My Expenses',
            type: 'item',
            url: '/expenses/my-expenses',
            icon: 'feather icon-credit-card'
          },
          {
            id: 'approve-expenses',
            title: 'Approve Expenses',
            type: 'item',
            url: '/expenses/approve',
            icon: 'feather icon-check-square'
          }
        ]
      }
    ]
  }
];
