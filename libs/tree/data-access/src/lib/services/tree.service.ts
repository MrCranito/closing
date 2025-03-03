import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT, Environment, Tree } from '@closing/shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private http: HttpClient = inject(HttpClient);
  private env: Environment = inject(ENVIRONMENT);

  fetch(
    page: number,
    size: number,
    sorts: string,
    filters: string
  ): Observable<Tree[]> {
    return this.http.get<Tree[]>(
      `${this.env.apiUrl}/api/tree?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }
}
