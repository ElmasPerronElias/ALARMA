import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get(`${this.apiUrl}/dashboard/`);
  }

  getDispositivos() {
    return this.http.get(`${this.apiUrl}/dispositivos/`);
  }

  getSedes() {
    return this.http.get(`${this.apiUrl}/sedes/`);
  }

  getHorarios() {
    return this.http.get(`${this.apiUrl}/horarios/`);
  }

  getInstituciones() {
    return this.http.get(`${this.apiUrl}/instituciones/`);
  }

  getNotificaciones() {
    return this.http.get(`${this.apiUrl}/notificaciones/`);
  }
}