import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Title, TitleViewModel } from '../models/title.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private apiUrl = `${environment.apiEndpoint}/Title`;

  constructor(private http: HttpClient) {}

  getTitles(page: number = 0, pageSize: number = 10, name: string = ''): Observable<TitleViewModel> {
    return this.http.get<TitleViewModel>(`${this.apiUrl}/titleList/${page}/${pageSize}/${name}`);
  }

  getTitleById(id: string): Observable<Title> {
    return this.http.get<Title>(`${this.apiUrl}/title/${id}`);
  }

  createTitle(title: Title): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, title);
  }

  updateTitle(id: string, title: Title): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, title);
  }

  deleteTitle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
