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
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'lib-authentification-login',
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  protected loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  protected email = computed(() => this.loginForm.controls.email);
  protected password = computed(() => this.loginForm.controls.password);
  protected rememberMe = computed(() => this.loginForm.controls.rememberMe);

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
    if (this.loginForm.valid) {
      await this.authStore.login({
        email: this.loginForm.controls.email.value ?? '',
        password: this.loginForm.controls.password.value ?? '',
        rememberMe: this.loginForm.controls.rememberMe.value ?? false,
      });
    } else {
      this.loginForm.markAllAsTouched();
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
