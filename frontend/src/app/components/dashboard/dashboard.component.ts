import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment local';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  datos: any = {};
  backendStatus: string = 'Conectando...';
  errorDetalle: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const url = `${environment.apiUrl}/dashboard/`;
    console.log('URL a conectar:', url);
    
    this.http.get(url)
      .pipe(
        timeout(10000), // 10 segundos de espera máxima
        catchError((err) => {
          console.error('Error completo:', err);
          this.backendStatus = '❌ Error de conexión';
          if (err.name === 'TimeoutError') {
            this.errorDetalle = 'El servidor no responde (timeout)';
          } else {
            this.errorDetalle = err.message;
          }
          return of(null); // Retorna observable vacío para evitar error
        })
      )
      .subscribe({
        next: (data) => {
          if (data) {
            console.log('Datos recibidos:', data);
            this.datos = data;
            this.backendStatus = '✅ Conectado';
          }
        }
      });
  }
}