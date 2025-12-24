import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  
  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  totalPages: number = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['pageSize']) {
      this.calculatePages();
    }
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = this.getPageNumbers();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxPagesToShow / 2);
      const rightOffset = maxPagesToShow - leftOffset - 1;
      
      let start = Math.max(1, this.currentPage - leftOffset);
      let end = Math.min(this.totalPages, this.currentPage + rightOffset);
      
      if (this.currentPage <= leftOffset) {
        end = maxPagesToShow;
      } else if (this.currentPage >= this.totalPages - rightOffset) {
        start = this.totalPages - maxPagesToShow + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.emitPageChange();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page when page size changes
    this.calculatePages();
    this.emitPageChange();
  }

  private emitPageChange(): void {
    this.pageChange.emit({
      page: this.currentPage,
      pageSize: this.pageSize
    });
  }

  goToFirstPage(): void {
    this.onPageChange(1);
  }

  goToPreviousPage(): void {
    this.onPageChange(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.onPageChange(this.currentPage + 1);
  }

  goToLastPage(): void {
    this.onPageChange(this.totalPages);
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}
