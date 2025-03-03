import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { User } from '@closing/shared/interfaces';
import { Signal } from '@angular/core';

@Component({
  selector: 'lib-authentification-not-verified-account',
  imports: [
    CommonModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './not-verified-account.component.html',
})
export class NotVerifiedComponent implements OnInit {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);

  protected user: Signal<User | null> = this.authStore.user;
  protected isResendingEmail = signal(false);
  protected cooldownTime = signal(0); // Cooldown timer in seconds
  protected cooldownInterval: any;

  ngOnInit() {
    // First validate the token to ensure we have the latest user data
    this.authStore.validateToken();
  }

  ngOnDestroy() {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  async onSubmit() {
    if (!this.user()?.email || this.cooldownTime() > 0) return;

    this.isResendingEmail.set(true);
    try {
      await this.authStore.sendEmailVerification({
        email: this.user()!.email,
      });
      // Start cooldown timer (60 seconds)
      this.startCooldown(60);
    } finally {
      this.isResendingEmail.set(false);
    }
  }

  private startCooldown(seconds: number) {
    this.cooldownTime.set(seconds);
    this.cooldownInterval = setInterval(() => {
      const currentTime = this.cooldownTime();
      if (currentTime <= 1) {
        clearInterval(this.cooldownInterval);
        this.cooldownTime.set(0);
      } else {
        this.cooldownTime.set(currentTime - 1);
      }
    }, 1000);
  }

  goToLogin() {
    this.authStore.logOut();
    this.router.navigate(['/auth/login']);
  }
}
