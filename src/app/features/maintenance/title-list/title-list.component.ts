import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title, TitleListResponse } from 'src/app/core/models/title.model';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadTitles();
  }

  loadTitles(): void {
    this.isLoading = true;

    // TODO: Replace with actual API call
    // Mock data for now
    setTimeout(() => {
      const mockData: TitleListResponse = {
        functionalTitleModel: [
          { id: '1', name: 'Software Engineer' },
          { id: '2', name: 'Senior Software Engineer' },
          { id: '3', name: 'Team Lead' },
          { id: '4', name: 'Project Manager' },
          { id: '5', name: 'Technical Architect' }
        ],
        totalCount: 5
      };

      this.titles = mockData.functionalTitleModel;
      this.totalCount = mockData.totalCount;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.filterTitles();
      this.isLoading = false;
    }, 500);
  }

  filterTitles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTitles = [...this.titles];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTitles = this.titles.filter((title) => title.name.toLowerCase().includes(term));
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.filterTitles();
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
      // TODO: Implement delete API call
      this.titles = this.titles.filter((b) => b.id !== title.id);
      this.totalCount--;
      this.filterTitles();
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
