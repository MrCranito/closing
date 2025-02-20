import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'lib-landing-feature',
  imports: [CommonModule, ButtonModule, CarouselModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
  host: {
    style: 'z-index: 1; position: relative',
  },
})
export class FeatureComponent {}
