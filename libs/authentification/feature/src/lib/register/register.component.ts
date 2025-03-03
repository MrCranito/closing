import { Component, computed, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@closing/shared/data-access';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { User } from '@closing/shared/interfaces';
import { toObservable } from '@angular/core/rxjs-interop';
@Component({
  selector: 'lib-authentification-register',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  protected registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    lastname: ['', [Validators.required, Validators.minLength(1)]],
    firstname: ['', [Validators.required, Validators.minLength(1)]],
    termAndConditions: [false, [Validators.required]],
  });

  readonly email = computed(() => this.registerForm.controls.email);
  readonly password = computed(() => this.registerForm.controls.password);
  readonly lastname = computed(() => this.registerForm.controls.lastname);
  readonly firstname = computed(() => this.registerForm.controls.firstname);
  readonly termAndConditions = computed(
    () => this.registerForm.controls.termAndConditions
  );

  readonly isFormValid = computed(() => this.registerForm.valid);

  protected user: Signal<User | null> = this.authStore.user;
  protected loading: Signal<boolean | null> = this.authStore.loading;

  constructor() {
    toObservable(this.user).subscribe((user) => {
      if (user != null) {
        this.router.navigate(['/auth/not-verified-account']);
      }
    });
  }

  async submit() {
    if (this.isFormValid() && this.termAndConditions()) {
      await this.authStore.register({
        user: {
          email: this.registerForm.controls.email.value ?? '',
          password: this.registerForm.controls.password.value ?? '',
          lastname: this.registerForm.controls.lastname.value ?? '',
          firstname: this.registerForm.controls.firstname.value ?? '',
          isEmailVerified: false,
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onGoogleRegister(): void {
    this.authStore.loginWithGoogle();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  async sendEmailVerification() {
    await this.authStore.sendEmailVerification({ email: 'user@example.com' });
  }

  async requestPasswordReset() {
    await this.authStore.requestPasswordReset({ email: 'user@example.com' });
  }

  async resetPassword(token: string, newPassword: string) {
    await this.authStore.resetPassword({ token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    await this.authStore.changePassword({ currentPassword, newPassword });
  }
}
