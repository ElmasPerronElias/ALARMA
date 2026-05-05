import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  ultimasActivaciones: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.isLoading = true;
    const url = `${environment.apiUrl}/dashboard/`;
    
    this.http.get(url)
      .pipe(
        timeout(15000),
        catchError((err) => {
          this.isLoading = false;
          this.backendStatus = '❌ Error';
          this.errorMessage = err.message;
          return of(null);
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.datos = data;
            this.backendStatus = '✅ Conectado';
            this.isLoading = false;
          }
        }
      });
  }
}