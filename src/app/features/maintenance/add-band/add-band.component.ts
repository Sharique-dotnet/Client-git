import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BandService } from '../../../core/services/band.service';
import { Band } from '../../../core/models/band.model';
import { AlertService } from '../../../shared/services/alert.service';

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
  isEditMode: boolean = false;

  constructor(
    private bandService: BandService,
    private alertService: AlertService
  ) {}

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
      this.alertService.showWarning('Please enter a band name', 'Validation Error');
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.band) {
      // Update existing band
      const updatedBand: Band = {
        id: this.band.id,
        name: this.bandName.trim()
      };

      this.bandService.updateBand(this.band.id, updatedBand).subscribe({
        next: () => {
          this.loading = false;
          this.alertService.showSuccess(`"${updatedBand.name}" has been updated successfully`, 'Updated');
          
          setTimeout(() => {
            this.bandUpdated.emit();
            this.onClose();
          }, 500);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error || 'Failed to update band. Please try again.';
          this.alertService.showError(this.error, 'Update Failed');
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
          this.loading = false;
          this.alertService.showSuccess(`"${newBand.name}" has been added successfully`, 'Added');
          this.bandName = '';
          
          setTimeout(() => {
            this.bandAdded.emit();
            this.onClose();
          }, 500);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error || 'Failed to add band. Please try again.';
          this.alertService.showError(this.error, 'Add Failed');
          console.error('Error adding band:', err);
        }
      });
    }
  }
}
