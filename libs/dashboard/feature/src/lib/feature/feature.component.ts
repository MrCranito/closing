import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'dashboard-feature',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
  host: {
    class: 'h-full w-full',
  },
})
export class FeatureComponent {}
