import { inject, Injectable } from '@angular/core';
import { AuthStore } from '@closing/shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class AuthInitService {
  private authStore = inject(AuthStore);

  initAuth() {
    // Initial token validation
    this.authStore.validateToken();

    // Start periodic token validation
    this.authStore.startPeriodicTokenValidation();

    return;
  }
}
