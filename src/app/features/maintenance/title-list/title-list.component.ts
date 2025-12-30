import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from 'src/app/core/models/title.model';
import { TitleService } from 'src/app/core/services/title.service';
import { PaginationComponent, PageChangeEvent } from '../../../shared/components/pagination/pagination.component';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-title-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './title-list.component.html',
  styleUrls: ['./title-list.component.scss']
})
export class TitleListComponent implements OnInit {
  titles: Title[] = [];
  loading: boolean = false;
  error: string = '';

  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private titleService: TitleService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadTitles();
  }

  loadTitles(): void {
    this.loading = true;
    this.error = '';
    this.titleService.getTitles(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.titles = response.functionalTitleModel || [];
        this.totalItems = response.totalCount || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load titles';
        this.loading = false;
        this.alertService.showError('Failed to load titles', 'Error');
        console.error('Error loading titles:', err);
      }
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.loadTitles();
  }
}
