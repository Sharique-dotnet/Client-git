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
  showBandModal: boolean = false;
  selectedBand: Band | null = null;
  
  // Pagination properties (0-based indexing)
  currentPage: number = 0;
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
    this.selectedBand = null;
    this.showBandModal = true;
  }

  openEditBandModal(band: Band): void {
    this.selectedBand = { ...band }; // Create a copy to avoid direct mutation
    this.showBandModal = true;
  }

  closeBandModal(): void {
    this.showBandModal = false;
    this.selectedBand = null;
  }

  onBandAdded(): void {
    this.currentPage = 0; // Reset to first page (0) after adding
    this.loadBands();
  }

  onBandUpdated(): void {
    this.loadBands(); // Reload current page after updating
  }

  deleteBand(band: Band): void {
    if (confirm(`Are you sure you want to delete "${band.name}"?`)) {
      this.bandService.deleteBand(band.id).subscribe({
        next: () => {
          // If current page becomes empty and it's not the first page, go to previous page
          if (this.bands.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }
          this.loadBands();
        },
        error: (err) => {
          this.error = 'Failed to delete band';
          console.error('Error deleting band:', err);
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    }
  }
}
