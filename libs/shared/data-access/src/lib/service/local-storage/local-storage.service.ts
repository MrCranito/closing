import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private tokenKey = 'auth_token';
  token = signal<string | null>(this.getToken());

  constructor() {}

  // Save token in local storage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.token.set(token); // Update signal value
  }

  // Retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from local storage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null); // Clear signal value
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
