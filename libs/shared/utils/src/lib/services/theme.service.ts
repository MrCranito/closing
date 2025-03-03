import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$: Observable<boolean> =
    this.isDarkModeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  private initializeTheme(): void {
    // Check localStorage first
    const storedTheme = localStorage.getItem(this.THEME_KEY);
    if (storedTheme) {
      this.setTheme(storedTheme === 'dark');
      return;
    }

    // Fall back to system preference
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.setTheme(systemPrefersDark);
  }

  private setupSystemThemeListener(): void {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // Only update theme based on system if no manual preference is stored
        if (!localStorage.getItem(this.THEME_KEY)) {
          this.setTheme(e.matches);
        }
      });
  }

  public toggleTheme(): void {
    this.setTheme(!this.isDarkModeSubject.value);
  }

  private setTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');

    if (isDark) {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }

  public getCurrentTheme(): boolean {
    return this.isDarkModeSubject.value;
  }
}
