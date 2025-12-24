import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Band {
  id: number;
  name: string;
  description?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BandService {
  private apiUrl = `${environment.apiEndpoint}/bands`;

  constructor(private http: HttpClient) {}

  getBands(): Observable<Band[]> {
    return this.http.get<Band[]>(this.apiUrl);
  }

  getBandById(id: number): Observable<Band> {
    return this.http.get<Band>(`${this.apiUrl}/${id}`);
  }

  createBand(band: Band): Observable<Band> {
    return this.http.post<Band>(this.apiUrl, band);
  }

  updateBand(id: number, band: Band): Observable<Band> {
    return this.http.put<Band>(`${this.apiUrl}/${id}`, band);
  }

  deleteBand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
