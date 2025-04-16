import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tree } from '@closing/shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiagramService {
  private readonly baseUrl = '/api/diagram';

  constructor(private http: HttpClient) {}

  fetch(
    page: number,
    size: number,
    sorts: string,
    filters: string
  ): Observable<Tree[]> {
    return this.http.get<Tree[]>(
      `${this.baseUrl}?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }

  create(diagram: Partial<Tree>): Observable<Tree> {
    return this.http.post<Tree>(this.baseUrl, diagram);
  }

  update(diagram: Tree): Observable<Tree> {
    return this.http.put<Tree>(`${this.baseUrl}/${diagram._id}`, diagram);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<Tree> {
    return this.http.get<Tree>(`${this.baseUrl}/${id}`);
  }
}
