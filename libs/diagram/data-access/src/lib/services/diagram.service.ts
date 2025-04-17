import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Diagram } from '@closing/shared/interfaces';
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
  ): Observable<Diagram[]> {
    return this.http.get<Diagram[]>(
      `${this.baseUrl}?page=${page}&size=${size}&sorts=${sorts}&filters=${filters}`
    );
  }

  create(diagram: Partial<Diagram>): Observable<Diagram> {
    return this.http.post<Diagram>(this.baseUrl, diagram);
  }

  update(diagram: Diagram): Observable<Diagram> {
    return this.http.put<Diagram>(`${this.baseUrl}/${diagram._id}`, diagram);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<Diagram> {
    return this.http.get<Diagram>(`${this.baseUrl}/${id}`);
  }
}
