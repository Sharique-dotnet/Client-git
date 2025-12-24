import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Band, BandViewModel } from '../models/band.model';

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
