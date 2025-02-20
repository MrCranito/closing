import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-shared-nav-bar',
  imports: [CommonModule, ButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  private router: Router = inject(Router);

  navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }

  navigateToTreeEdit(): void {
    this.router.navigate(['/tree-edit']);
  }

  navigateToLanding(): void {
    this.router.navigate(['/']);
  }
}
