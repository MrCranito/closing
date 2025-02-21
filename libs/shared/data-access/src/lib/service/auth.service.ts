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

  register(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.env.apiUrl + '/api/register', {
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.env.apiUrl + '/api/login', {
      email,
      password,
    });
  }

  registerWithGoogle(): Observable<User> {
    return this.http.get<User>(this.env.apiUrl + '/api/google/register');
  }

  loginWithGoogle(): Observable<User> {
    return this.http.get<User>(this.env.apiUrl + '/api/google/login');
  }
}
