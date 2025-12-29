import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from 'src/app/core/models/title.model';
import { TitleService } from 'src/app/core/services/title.service';

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
  searchTerm: string = '';
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.loadTitles();
  }

  loadTitles(): void {
    this.isLoading = true;

    this.titleService.getTitleList(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.titles = res.functionalTitleModel ?? [];
        this.filteredTitles = [...this.titles];
        this.totalCount = res.totalCount ?? 0;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.isLoading = false;
      },
      error: () => {
        this.titles = [];
        this.filteredTitles = [];
        this.totalCount = 0;
        this.totalPages = 0;
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadTitles();
  }

  onAdd(): void {
    // Navigate to add title page
    this.router.navigate(['/maintenance/title/add']);
  }

  onEdit(title: Title): void {
    // Navigate to edit title page
    this.router.navigate(['/maintenance/title/edit', title.id]);
  }

  onDelete(title: Title): void {
    if (confirm(`Are you sure you want to delete "${title.name}"?`)) {
      this.titleService.deleteTitle(title.id).subscribe({
        next: () => this.loadTitles(),
        error: () => this.loadTitles()
      });
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTitles();
    }
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
