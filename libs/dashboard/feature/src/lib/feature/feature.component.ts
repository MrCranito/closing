import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
