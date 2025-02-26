import { inject, Injectable } from '@angular/core';
import { AuthStore } from '@closing/shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class AuthInitService {
  private authStore = inject(AuthStore);

  initAuth() {
    this.authStore.validateToken();
    return;
  }
}
