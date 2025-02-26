import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AuthStore } from '@closing/shared/data-access';

@Component({
  selector: 'lib-shared-nav-bar',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    DividerModule,
  ],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  protected isMenuOpened: boolean = false;

  openMenu() {
    this.isMenuOpened = true;
  }

  logOut(): void {
    this.authStore.logOut();
  }

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
