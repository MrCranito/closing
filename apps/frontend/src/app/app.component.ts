import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from '@closing/shared/utils';

@Component({
  standalone: true,
  imports: [RouterModule, ToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';

  private themeService = inject(ThemeService);

  isDarkMode$ = this.themeService.isDarkMode$;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
