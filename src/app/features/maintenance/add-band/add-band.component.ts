import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BandService } from '../../../core/services/band.service';
import { Band } from '../../../core/models/band.model';

@Component({
  selector: 'app-add-band',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-band.component.html',
  styleUrls: ['./add-band.component.scss']
})
export class AddBandComponent implements OnInit {
  @Input() band: Band | null = null; // For edit mode
  @Output() close = new EventEmitter<void>();
  @Output() bandAdded = new EventEmitter<void>();
  @Output() bandUpdated = new EventEmitter<void>();

  bandName: string = '';
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;

  constructor(private bandService: BandService) {}

  ngOnInit(): void {
    if (this.band) {
      this.isEditMode = true;
      this.bandName = this.band.name;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.bandName.trim()) {
      this.error = 'Band name is required';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    if (this.isEditMode && this.band) {
      // Update existing band
      const updatedBand: Band = {
        id: this.band.id,
        name: this.bandName.trim()
      };

      this.bandService.updateBand(this.band.id, updatedBand).subscribe({
        next: () => {
          this.successMessage = 'Band updated successfully!';
          this.loading = false;
          
          setTimeout(() => {
            this.bandUpdated.emit();
            this.onClose();
          }, 1000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error || 'Failed to update band. Please try again.';
          console.error('Error updating band:', err);
        }
      });
    } else {
      // Create new band
      const newBand: Band = {
        id: '',
        name: this.bandName.trim()
      };

      this.bandService.createBand(newBand).subscribe({
        next: () => {
          this.successMessage = 'Band added successfully!';
          this.loading = false;
          this.bandName = '';
          
          setTimeout(() => {
            this.bandAdded.emit();
            this.onClose();
          }, 1000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error || 'Failed to add band. Please try again.';
          console.error('Error adding band:', err);
        }
      });
    }
  }
}
