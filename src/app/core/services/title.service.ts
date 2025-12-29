import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Title, TitleListResponse } from '../models/title.model';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly controllerUrl = '/api/Title';

  constructor(private http: HttpClient) {}

  getTitleList(page?: number, pageSize?: number, name?: string): Observable<TitleListResponse> {
    const safePage = page ?? 0;
    const safePageSize = pageSize ?? 10;

    let url = `${this.controllerUrl}/titleList/${safePage}/${safePageSize}`;

    const search = (name ?? '').trim();
    if (search) {
      url += `/${encodeURIComponent(search)}`;
    }

    return this.http.get<TitleListResponse>(url);
  }

  getTitleById(id: string): Observable<Title> {
    return this.http.get<Title>(`${this.controllerUrl}/title/${id}`);
  }

  createTitle(model: Pick<Title, 'name'>): Observable<void> {
    return this.http.post<void>(`${this.controllerUrl}/create`, model);
  }

  updateTitle(id: string, model: Pick<Title, 'name'>): Observable<void> {
    return this.http.put<void>(`${this.controllerUrl}/update/${id}`, model);
  }

  deleteTitle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.controllerUrl}/delete/${id}`);
  }
}
