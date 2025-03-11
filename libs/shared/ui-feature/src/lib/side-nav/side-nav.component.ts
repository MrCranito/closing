import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { MainNavigationRoutes } from '@closing/shared/interfaces';

export interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'lib-shared-side-nav',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './side-nav.component.html',
  host: {
    class: 'h-full',
  },
})
export class SideNavComponent {
  private router: Router = inject(Router);

  protected menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: MainNavigationRoutes.Dashboard,
    },
    {
      label: 'Trees',
      icon: 'pi pi-sitemap',
      routerLink: MainNavigationRoutes.Tree,
    },
    {
      label: 'Scenarios',
      icon: 'pi pi-file-pdf',
      routerLink: MainNavigationRoutes.Scenario,
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      routerLink: MainNavigationRoutes.Users,
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: MainNavigationRoutes.Settings,
    },
  ];

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
