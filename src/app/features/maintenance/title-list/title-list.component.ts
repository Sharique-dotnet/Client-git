import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from 'src/app/core/models/title.model';
import { TitleService } from 'src/app/core/services/title.service';

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-title-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './title-list.component.html',
  styleUrls: ['./title-list.component.scss']
})
export class TitleListComponent implements OnInit {
  titles: Title[] = [];
  filteredTitles: Title[] = [];

  loading: boolean = false;
  error: string = '';

  searchTerm: string = '';

  // Pagination properties (0-based indexing) - aligned with BandListComponent
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private router: Router,
    private titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.loadTitles();
  }

  get totalPages(): number {
    return Math.ceil((this.totalItems || 0) / this.pageSize);
  }

  loadTitles(): void {
    this.loading = true;
    this.error = '';

    this.titleService.getTitleList(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.titles = res.functionalTitleModel || [];
        this.filteredTitles = [...this.titles];
        this.totalItems = res.totalCount || 0;
        this.loading = false;
      },
      error: () => {
        this.titles = [];
        this.filteredTitles = [];
        this.totalItems = 0;
        this.loading = false;
        this.error = 'Failed to load titles';
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0; // Reset to first page (0) on search
    this.loadTitles();
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.loadTitles();
  }

  onPageSizeChange(pageSize: number): void {
    this.currentPage = 0;
    this.pageSize = pageSize;
    this.loadTitles();
  }

  // Generates 1-based page numbers for display, while currentPage stays 0-based
  getPaginationPages(): number[] {
    const total = this.totalPages;
    if (total <= 1) return [];

    const pages: number[] = [];
    const maxVisiblePages = 5;

    const currentDisplayPage = this.currentPage + 1;

    let startPage = Math.max(1, currentDisplayPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(displayPage: number): void {
    const targetPage = displayPage - 1;
    if (targetPage >= 0 && targetPage < this.totalPages) {
      this.onPageChange({ page: targetPage, pageSize: this.pageSize });
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.onPageChange({ page: this.currentPage - 1, pageSize: this.pageSize });
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.onPageChange({ page: this.currentPage + 1, pageSize: this.pageSize });
    }
  }

  onAdd(): void {
    this.router.navigate(['/maintenance/title/add']);
  }

  onEdit(title: Title): void {
    this.router.navigate(['/maintenance/title/edit', title.id]);
  }

  onDelete(title: Title): void {
    if (confirm(`Are you sure you want to delete "${title.name}"?`)) {
      this.titleService.deleteTitle(title.id).subscribe({
        next: () => {
          // If current page becomes empty and it's not the first page, go to previous page
          if (this.filteredTitles.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }
          this.loadTitles();
        },
        error: () => {
          this.error = 'Failed to delete title';
          this.loadTitles();
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    }
  }
}
