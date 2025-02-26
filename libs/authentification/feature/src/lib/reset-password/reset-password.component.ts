import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-authentification-reset-password',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private activatedRoute = inject(ActivatedRoute);

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

  protected id: string | null = null;

  ngOnInit(): void {
    // Get the token from the URL
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
  }

  // Forgot password using email
  async onSubmit() {
    if (this.isFormValid()) {
      const { email } = this.form().value;
      await this.authStore.updateEmail(email);
    } else {
      this.form().markAllAsTouched();
    }
  }
}
