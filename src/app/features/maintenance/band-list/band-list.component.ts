import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandService } from '../../../core/services/band.service';
import { Band } from 'src/app/core/models/band.model';
import { AddBandComponent } from '../add-band/add-band.component';

@Component({
  selector: 'app-band-list',
  standalone: true,
  imports: [CommonModule, AddBandComponent],
  templateUrl: './band-list.component.html',
  styleUrls: ['./band-list.component.scss']
})
export class BandListComponent implements OnInit {
  bands: Band[] = [];
  loading: boolean = false;
  error: string = '';
  showAddBandModal: boolean = false;

  constructor(private bandService: BandService) { }

  ngOnInit(): void {
    this.loadBands();
  }

  loadBands(): void {
    this.loading = true;
    this.error = '';
    this.bandService.getBands().subscribe({
      next: (data) => {
        this.bands = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bands';
        this.loading = false;
        console.error('Error loading bands:', err);
      }
    });
  }

  openAddBandModal(): void {
    this.showAddBandModal = true;
  }

  closeAddBandModal(): void {
    this.showAddBandModal = false;
  }

  onBandAdded(): void {
    this.loadBands(); // Reload the band list after adding a new band
  }
}
