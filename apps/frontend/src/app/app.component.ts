import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ThemeStore } from '@closing/shared/data-access';

@Component({
  standalone: true,
  imports: [RouterModule, ToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';

  private themeStore = inject(ThemeStore);

  constructor() {
    this.themeStore.initializeTheme();
  }
}
