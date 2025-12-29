import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Band, BandViewModel } from '../models/band.model';

@Injectable({
  providedIn: 'root'
})
export class BandService {
  private apiUrl = `${environment.apiEndpoint}/Band`;

  constructor(private http: HttpClient) { }

  getBands(page: number = 0, pageSize: number = 10, name: string = ''): Observable<BandViewModel> {
    return this.http.get<BandViewModel>(`${this.apiUrl}/bandList/${page}/${pageSize}/${name}`);
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
