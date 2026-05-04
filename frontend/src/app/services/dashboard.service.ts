import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment local';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboard() {
    return this.http.get(`${this.apiUrl}/dashboard/`);
  }

  getDispositivos() {
    return this.http.get(`${this.apiUrl}/dispositivos/`);
  }

  getSedes() {
    return this.http.get(`${this.apiUrl}/sedes/`);
  }
}