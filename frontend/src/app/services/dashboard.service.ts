import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // 🔥 Mantiene Railway activo (ping cada 4 minutos)
    interval(240000).pipe(
      switchMap(() => this.http.get(`${this.apiUrl}/dashboard/`))
    ).subscribe();
  }

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