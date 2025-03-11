import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scenario } from '../interfaces/scenario.interface';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment } from '@closing/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ScenarioService {
  private http: HttpClient = inject(HttpClient);
  private env: Environment = inject(ENVIRONMENT);

  fetch(
    page: number,
    size: number,
    sorts: string,
    filters: string
  ): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(
      `${this.env.apiUrl}/api/scenarios?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }
}
