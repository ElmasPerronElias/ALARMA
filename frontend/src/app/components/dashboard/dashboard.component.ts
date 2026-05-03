import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/dashboard/`).subscribe({
      next: (data: any) => {
        this.datos = data;
        this.backendStatus = '✅ Conectado a Railway';
      },
      error: (err) => {
        this.backendStatus = '❌ Error de conexión';
        console.error(err);
      }
    });
  }
}