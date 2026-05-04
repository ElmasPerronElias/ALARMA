// services/keep-alive.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment local';
import { interval, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KeepAliveService {
  constructor(private http: HttpClient) {
    // Hacer ping cada 30 segundos
    interval(30000).pipe(
      switchMap(() => this.http.get(`${environment.apiUrl}/dashboard/`))
    ).subscribe();
  }
}