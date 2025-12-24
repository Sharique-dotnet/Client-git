import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandService } from '../../../core/services/band.service';
import { Band } from 'src/app/core/models/band.model';
import { AddBandComponent } from '../add-band/add-band.component';
import { PaginationComponent, PageChangeEvent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-band-list',
  standalone: true,
  imports: [CommonModule, AddBandComponent, PaginationComponent],
  templateUrl: './band-list.component.html',
  styleUrls: ['./band-list.component.scss']
})
export class BandListComponent implements OnInit {
  bands: Band[] = [];
  loading: boolean = false;
  error: string = '';
  showAddBandModal: boolean = false;
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private bandService: BandService) { }

  ngOnInit(): void {
    this.loadBands();
  }

  loadBands(): void {
    this.loading = true;
    this.error = '';
    this.bandService.getBands(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.bands = response.bandModel || [];
        this.totalItems = response.totalCount || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bands';
        this.loading = false;
        console.error('Error loading bands:', err);
      }
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.loadBands();
  }

  openAddBandModal(): void {
    this.showAddBandModal = true;
  }

  closeAddBandModal(): void {
    this.showAddBandModal = false;
  }

  onBandAdded(): void {
    this.currentPage = 1; // Reset to first page after adding
    this.loadBands(); // Reload the band list after adding a new band
  }
}
