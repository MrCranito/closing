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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-authentification-veryfying-account',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './veryfying-account.component.html',
})
export class VeryfyingAccountComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  protected notVerifiedAccountForm = this.formBuilder.group({
    lastname: ['', [Validators.required]],
    firstname: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
  });

  protected lastname = computed(
    () => this.notVerifiedAccountForm.controls.lastname
  );
  protected firstname = computed(
    () => this.notVerifiedAccountForm.controls.firstname
  );
  protected companyName = computed(
    () => this.notVerifiedAccountForm.controls.companyName
  );

  // Forgot password using email
  async onSubmit() {
    if (this.notVerifiedAccountForm.valid) {
      await this.authStore.updateUserInfo({
        lastname: this.lastname().value ?? '',
        firstname: this.firstname().value ?? '',
        companyName: this.companyName().value ?? '',
      });
    } else {
      this.notVerifiedAccountForm.markAllAsTouched();
    }
  }
}
