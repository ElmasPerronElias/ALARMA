import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.css']
})
export class DispositivosComponent implements OnInit {
  dispositivos: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarDispositivos();
  }

  cargarDispositivos() {
    this.api.getDispositivos().subscribe(data => {
      this.dispositivos = data;
    });
  }

  activarTimbre(dispositivoId: number) {
    this.api.activarTimbre(dispositivoId).subscribe({
      next: (res) => {
        alert('Timbre activado exitosamente');
        this.cargarDispositivos();
      },
      error: (err) => {
        alert('Error al activar el timbre');
      }
    });
  }
}