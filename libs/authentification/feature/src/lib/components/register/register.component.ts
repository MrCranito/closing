import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@closing/shared/data-access';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-authentification-register',
  imports: [CommonModule, ButtonModule, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  // Form state using Signals
  private registerFormSignal = signal<FormGroup>(
    this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/), // At least 1 uppercase & 1 special character
        ],
      ],
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
  async onRegister() {
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

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
