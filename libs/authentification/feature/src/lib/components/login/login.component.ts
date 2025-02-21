import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';

@Component({
  selector: 'lib-authentification-login',
  imports: [CommonModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  // Form state using Signals
  private registerFormSignal = signal<FormGroup>(
    this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  );

  // Computed signals for form and controls
  readonly form = computed(() => this.registerFormSignal());
  readonly name = computed(() => this.form().get('name') as AbstractControl);
  readonly email = computed(() => this.form().get('email') as AbstractControl);
  readonly password = computed(
    () => this.form().get('password') as AbstractControl
  );

  // Computed signals for validation errors
  readonly nameErrors = computed(() => this.name()?.errors);
  readonly emailErrors = computed(() => this.email()?.errors);
  readonly passwordErrors = computed(() => this.password()?.errors);
  readonly isFormValid = computed(() => this.form().valid);

  // Register using traditional email/password
  async onLogin() {
    if (this.isFormValid()) {
      const { name, email, password } = this.form().value;
      await this.authStore.register(email, password);
    } else {
      this.form().markAllAsTouched();
    }
  }

  onGoogleRegister(): void {
    this.authStore.loginWithGoogle();
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
