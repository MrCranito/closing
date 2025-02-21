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

  canActivate(): boolean {
    console.log('AuthGuard#canActivate called');
    console.log(
      'this.authStore.isAuthenticated()',
      this.authStore.isAuthenticated()
    );
    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
