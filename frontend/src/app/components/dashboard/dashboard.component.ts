import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Variables para los datos
  dispositivos: any[] = [];
  sedes: any[] = [];
  instituciones: any[] = [];
  eventos: any[] = [];
  activaciones: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar dispositivos
    this.http.get('http://127.0.0.1:8000/api/dispositivos/').subscribe((data: any) => {
      this.dispositivos = data.dispositivos || [];
    });

    // Cargar sedes
    this.http.get('http://127.0.0.1:8000/api/sedes/').subscribe((data: any) => {
      this.sedes = data.sedes || [];
    });

    // Cargar dashboard (estadísticas generales)
    this.http.get('http://127.0.0.1:8000/api/dashboard/').subscribe((data: any) => {
      // Aquí puedes actualizar otros datos si es necesario
    });
  }
}