import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthStore } from '@closing/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-authentification-forgot-password',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  // Form state using Signals
  protected forgotPasswordFormSignal = signal<FormGroup>(
    this.formBuilder.group({
      email: ['', [Validators.required]],
    })
  );

  // Computed signals for form and controls
  readonly form = computed(() => this.forgotPasswordFormSignal());
  readonly email = computed(() => this.form().get('email') as AbstractControl);

  // Computed signals for validation errors
  readonly emailErrors = computed(() => this.email()?.errors);
  readonly isFormValid = computed(() => this.form().valid);

  onSubmit() {
    this.authStore.updateEmail(this.email().value);
  }
}
