import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'lib-shared-side-nav',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './side-nav.component.html',
  host: {
    class: 'h-full w-64',
  },
})
export class SideNavComponent {
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
