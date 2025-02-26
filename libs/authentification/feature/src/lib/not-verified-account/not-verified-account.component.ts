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
import { CheckboxModule } from 'primeng/checkbox';
import { User } from '@closing/shared/interfaces';

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
export class NotVerifiedComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);

  protected user: User | null = this.authStore.user();

  async onSubmit() {}
}
