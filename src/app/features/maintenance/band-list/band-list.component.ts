import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandService, Band } from '../../../core/services/band.service';

@Component({
  selector: 'app-band-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './band-list.component.html',
  styleUrls: ['./band-list.component.scss']
})
export class BandListComponent implements OnInit {
  bands: Band[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private bandService: BandService) {}

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
}
