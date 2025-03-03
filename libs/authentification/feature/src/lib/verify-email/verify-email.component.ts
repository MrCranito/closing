import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';

@Component({
  selector: 'lib-authentification-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-screen items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p class="text-gray-600">
          Please wait while we verify your email address.
        </p>
      </div>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit {
  private authStore = inject(AuthStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const token = params['token'];
      if (token) {
        try {
          await this.authStore.verifyEmail({ token });
          // After successful verification, validate the token to update the user state
          this.authStore.validateToken();
          this.router.navigate(['/']);
        } catch (error) {
          this.router.navigate(['/auth/login']);
        }
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
