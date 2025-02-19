import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'lib-landing-feature',
  imports: [CommonModule, ButtonModule, CarouselModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
  host: {
    class: 'h-full w-full'
  }
})
export class FeatureComponent {

  features = [
    { icon: 'pi pi-check-circle', title: 'Feature 1', description: 'Description of Feature 1' },
    { icon: 'pi pi-star', title: 'Feature 2', description: 'Description of Feature 2' },
    { icon: 'pi pi-thumbs-up', title: 'Feature 3', description: 'Description of Feature 3' }
  ];
  testimonials = [
    { quote: 'This product changed my life!', author: 'John Doe' },
    { quote: 'Incredible experience, highly recommend!', author: 'Jane Smith' }
  ];
}
