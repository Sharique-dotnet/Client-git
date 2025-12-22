// Angular Common Imports
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Shared UI Components
import { CardComponent } from './ui/card/card.component';
import { BreadcrumbComponent } from './ui/breadcrumb/breadcrumb.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';

// Common imports for standalone components
export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NgbModule,
  CardComponent,
  BreadcrumbComponent,
  SpinnerComponent
];

// Export individual components for selective imports
export { CardComponent, BreadcrumbComponent, SpinnerComponent };
