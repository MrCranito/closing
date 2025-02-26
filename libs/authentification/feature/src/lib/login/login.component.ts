import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';
import { User } from '@closing/shared/interfaces';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-authentification-login',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  protected loginFormSignal = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected email = computed(() => this.loginFormSignal.controls.email);
  protected password = computed(() => this.loginFormSignal.controls.password);

  protected user: Signal<User | null> = this.authStore.user;
  protected loading: Signal<boolean | null> = this.authStore.loading;

  constructor() {
    toObservable(this.user).subscribe((user) => {
      if (user != null) {
        this.router.navigate(['/']);
      }
    });
  }

  // Register using traditional email/password
  async submit() {
    if (this.loginFormSignal.valid) {
      await this.authStore.login({
        email: this.loginFormSignal.controls.email.value ?? '',
        password: this.loginFormSignal.controls.password.value ?? '',
      });
    } else {
      this.loginFormSignal.markAllAsTouched();
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
