import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  // Dashboard overview component
}
