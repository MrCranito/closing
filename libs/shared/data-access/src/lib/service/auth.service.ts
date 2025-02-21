import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@closing/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);

  register(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/register', { email, password });
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password });
  }

  registerWithGoogle(): Observable<User> {
    return this.http.get<User>('/api/google/register');
  }

  loginWithGoogle(): Observable<User> {
    return this.http.get<User>('/api/google/login');
  }
}
