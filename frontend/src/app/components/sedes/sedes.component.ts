import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {
  sedes: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarSedes();
  }

  cargarSedes() {
    this.apiService.getSedes().subscribe({
      next: (response: any) => {
        console.log('Sedes recibidas:', response);
        this.sedes = response.sedes || [];
      },
      error: (err) => {
        console.error('Error al cargar sedes:', err);
      }
    });
  }
}