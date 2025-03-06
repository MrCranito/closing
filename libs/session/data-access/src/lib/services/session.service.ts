import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../interfaces/session.interface';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment } from '@closing/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http: HttpClient = inject(HttpClient);
  private env: Environment = inject(ENVIRONMENT);

  fetch(
    page: number,
    size: number,
    sorts: string,
    filters: string
  ): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.env.apiUrl}/api/sessions?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }
}
