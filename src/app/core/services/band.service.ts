import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Band {
  id: string;
  name: string;
}

export interface BandViewModel {
  bandModel: Band[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BandService {
  private apiUrl = `${environment.apiEndpoint}/Band`;

  constructor(private http: HttpClient) { }

  getBands(page?: number, pageSize?: number, name?: string): Observable<Band[]> {
    const pageNum = page || 0;
    const size = pageSize || 10;
    const searchName = name || '';

    return this.http.get<BandViewModel>(`${this.apiUrl}/bandList/${pageNum}/${size}/${searchName}`)
      .pipe(
        map(response => response.bandModel || [])
      );
  }

  getBandById(id: string): Observable<Band> {
    return this.http.get<Band>(`${this.apiUrl}/band/${id}`);
  }

  createBand(band: Band): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, band);
  }

  updateBand(id: string, band: Band): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, band);
  }

  deleteBand(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
