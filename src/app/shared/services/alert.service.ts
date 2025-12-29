import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

export enum MessageSeverity {
  default = 'default',
  info = 'info',
  success = 'success',
  error = 'error',
  warning = 'warning'
}

export interface ToastOptions {
  title?: string;
  message: string;
  type?: MessageSeverity;
  timeout?: number;
  closeButton?: boolean;
  progressBar?: boolean;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private defaultTimeout = 5000;
  private defaultPosition: any = 'top-right';

  constructor(private toastr: ToastrService) {}

  // ==================== Toast Notifications ====================

  /**
   * Show a toast notification
   */
  showToast(options: ToastOptions): void {
    const config = {
      timeOut: options.timeout || this.defaultTimeout,
      closeButton: options.closeButton !== false,
      progressBar: options.progressBar !== false,
      positionClass: `toast-${this.defaultPosition}`
    };

    const type = options.type || MessageSeverity.default;
    const title = options.title || '';
    const message = options.message;

    switch (type) {
      case MessageSeverity.success:
        this.toastr.success(message, title, config);
        break;
      case MessageSeverity.error:
        this.toastr.error(message, title, config);
        break;
      case MessageSeverity.warning:
        this.toastr.warning(message, title, config);
        break;
      case MessageSeverity.info:
        this.toastr.info(message, title, config);
        break;
      default:
        this.toastr.show(message, title, config);
        break;
    }
  }

  /**
   * Show success toast
   */
  showSuccess(message: string, title: string = 'Success'): void {
    this.showToast({ message, title, type: MessageSeverity.success });
  }

  /**
   * Show error toast
   */
  showError(message: string, title: string = 'Error'): void {
    this.showToast({ message, title, type: MessageSeverity.error });
  }

  /**
   * Show warning toast
   */
  showWarning(message: string, title: string = 'Warning'): void {
    this.showToast({ message, title, type: MessageSeverity.warning });
  }

  /**
   * Show info toast
   */
  showInfo(message: string, title: string = 'Info'): void {
    this.showToast({ message, title, type: MessageSeverity.info });
  }

  /**
   * Clear all toasts
   */
  clearAllToasts(): void {
    this.toastr.clear();
  }

  // ==================== SweetAlert Dialogs ====================

  /**
   * Show confirmation dialog
   */
  async showConfirm(options: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title || 'Are you sure?',
      text: options.message,
      icon: options.icon || 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: options.confirmButtonText || 'Yes',
      cancelButtonText: options.cancelButtonText || 'Cancel',
      reverseButtons: true
    });

    return result.isConfirmed;
  }

  /**
   * Show delete confirmation dialog
   */
  async showDeleteConfirm(itemName: string = 'this item'): Promise<boolean> {
    return this.showConfirm({
      title: 'Delete Confirmation',
      message: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      icon: 'warning'
    });
  }

  /**
   * Show success alert
   */
  showSuccessAlert(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6'
    });
  }

  /**
   * Show error alert
   */
  showErrorAlert(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33'
    });
  }

  /**
   * Show warning alert
   */
  showWarningAlert(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f39c12'
    });
  }

  /**
   * Show info alert
   */
  showInfoAlert(title: string, message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonColor: '#3085d6'
    });
  }

  /**
   * Show custom alert with full SweetAlert2 options
   */
  showCustomAlert(options: SweetAlertOptions): void {
    Swal.fire(options);
  }

  /**
   * Show loading indicator
   */
  showLoading(title: string = 'Loading...', message?: string): void {
    Swal.fire({
      title: title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Close any open SweetAlert dialog
   */
  closeAlert(): void {
    Swal.close();
  }

  /**
   * Show input prompt dialog
   */
  async showPrompt(
    title: string,
    message: string,
    inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' = 'text',
    placeholder?: string
  ): Promise<string | null> {
    const result = await Swal.fire({
      title: title,
      text: message,
      input: inputType,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter something!';
        }
        return null;
      }
    });

    return result.isConfirmed ? result.value : null;
  }
}
