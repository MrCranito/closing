import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { MainNavigationRoutes } from '@closing/shared/interfaces';
import { ThemeStore } from '@closing/shared/data-access';

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
  private themeStore = inject(ThemeStore);
  protected isDarkMode = this.themeStore.mode() === 'dark';

  constructor() {
    // Initialize theme on component creation
    this.themeStore.initializeTheme();
  }

  protected menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: MainNavigationRoutes.Dashboard,
    },
    {
      label: 'Diagrams',
      icon: 'pi pi-sitemap',
      routerLink: MainNavigationRoutes.Diagram,
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

  toggleTheme(): void {
    this.themeStore.toggleTheme();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }

  navigateToDiagramEdit(): void {
    this.router.navigate(['/diagram-edit']);
  }

  navigateToLanding(): void {
    this.router.navigate(['/']);
  }
}
