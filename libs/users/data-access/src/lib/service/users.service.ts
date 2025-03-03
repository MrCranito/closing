import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment } from '@closing/shared/interfaces';
import { User } from '@closing/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http: HttpClient = inject(HttpClient);
  private env: Environment = inject(ENVIRONMENT);

  fetch(
    page: number,
    size: number,
    sorts: string,
    filters: string
  ): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.env.apiUrl}/api/users?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }
}
