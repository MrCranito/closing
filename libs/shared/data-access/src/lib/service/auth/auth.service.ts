import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment, User } from '@closing/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private env: Environment = inject(ENVIRONMENT);

  register(user: User): Observable<User> {
    return this.http.post<User>(this.env.apiUrl + '/api/auth/register', user);
  }

  update(user: Partial<User>, companyName: string): Observable<User> {
    return this.http.put<User>(this.env.apiUrl + '/api/auth/update', {
      user,
      companyName,
    });
  }

  login(
    email: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(
      this.env.apiUrl + '/api/auth/login',
      {
        email,
        password,
      }
    );
  }

  sendEmailVerification(email: string) {
    return this.http.post(this.env.apiUrl + '/api/auth/email-verification', {
      email,
    });
  }

  updateEmail(id: string, email: string): Observable<User> {
    return this.http.patch<User>(
      this.env.apiUrl + `/api/auth/update-email/${id}`,
      {
        email,
      }
    );
  }

  validateToken(): Observable<User> {
    return this.http.get<User>(this.env.apiUrl + '/api/auth/validate');
  }

  registerWithGoogle(): Observable<User> {
    return this.http.get<User>(this.env.apiUrl + '/api/auth/google/register');
  }

  loginWithGoogle(): Observable<User> {
    return this.http.get<User>(this.env.apiUrl + '/api/auth/google/login');
  }

  // Password reset methods
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(this.env.apiUrl + '/api/auth/forgot-password', {
      email,
    });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(this.env.apiUrl + '/api/auth/reset-password', {
      token,
      newPassword,
    });
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http.post<void>(this.env.apiUrl + '/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  verifyEmail(token: string) {
    return this.http.post(this.env.apiUrl + '/api/auth/verify-email', null, {
      params: { token },
    });
  }
}
