import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../interfaces/session.interface';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment } from '@closing/shared/interfaces';

export interface SessionPaginationResponse {
  items: Session[];
  total: number;
}

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
  ): Observable<SessionPaginationResponse> {
    return this.http.get<SessionPaginationResponse>(
      `${this.env.apiUrl}/api/sessions?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }
}
