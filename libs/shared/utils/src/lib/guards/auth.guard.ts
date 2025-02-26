import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@closing/shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }

    if (!this.authStore.user()?.isEmailVerified) {
      this.router.navigate(['/auth/not-verified-account']);
    }
    return true;
  }
}
