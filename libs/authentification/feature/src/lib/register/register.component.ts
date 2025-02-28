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

  protected loading: Signal<boolean | null> = this.authStore.loading;

  protected registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/),
      ],
    ],
    lastname: ['', [Validators.required, Validators.minLength(1)]],
    firstname: ['', [Validators.required, Validators.minLength(1)]],
    companyName: ['', [Validators.required, Validators.minLength(1)]],
    termAndConditions: [null, [Validators.required]],
  });

  readonly email = computed(() => this.registerForm.controls.email);
  readonly password = computed(() => this.registerForm.controls.password);
  readonly lastname = computed(() => this.registerForm.controls.lastname);
  readonly firstname = computed(() => this.registerForm.controls.firstname);
  readonly termAndConditions = computed(
    () => this.registerForm.controls.termAndConditions
  );

  readonly isFormValid = computed(() => this.registerForm.valid);

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
}
