import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT, Environment, Tree } from '@closing/shared/interfaces';
import { Observable, map } from 'rxjs';

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

  create(tree: Partial<Tree>): Observable<Tree> {
    return this.http.post<Tree>(`${this.env.apiUrl}/api/tree`, tree);
  }

  update(tree: Tree): Observable<Tree> {
    return this.http.put<Tree>(`${this.env.apiUrl}/api/tree`, tree);
  }

  delete(id: string): Observable<string> {
    return this.http
      .delete<void>(`${this.env.apiUrl}/api/tree/${id}`)
      .pipe(map(() => id));
  }

  getById(id: string): Observable<Tree> {
    return this.http.get<Tree>(`${this.env.apiUrl}/api/tree/${id}`);
  }
}
