import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, Dispositivo, Sede } from '../../services/crud.service';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.css']
})
export class DispositivosComponent implements OnInit {
  dispositivos: Dispositivo[] = [];
  sedes: Sede[] = [];
  formData: Dispositivo = { sede: 0, nombre: '', codigo_dispositivo: '', tipo: 'ESP32', activo: true };
  editando = false;
  isLoading = true;
  showModal = false;
  searchTerm = '';

  tipos = ['ESP32', 'TIMBRE1', 'TIMBRE2', 'CONTROLADOR'];

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.cargar();
    this.cargarSedes();
  }

  cargar() {
    this.isLoading = true;
    this.crud.getDispositivos().subscribe({
      next: (data) => {
        this.dispositivos = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  cargarSedes() {
    this.crud.getSedes().subscribe(data => this.sedes = data);
  }

  abrirModal(editar = false, item?: Dispositivo) {
    this.editando = editar;
    if (editar && item) {
      this.formData = { ...item };
    } else {
      this.formData = { sede: 0, nombre: '', codigo_dispositivo: '', tipo: 'ESP32', activo: true };
    }
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.formData = { sede: 0, nombre: '', codigo_dispositivo: '', tipo: 'ESP32', activo: true };
    this.editando = false;
  }

  guardar() {
    if (this.editando) {
      this.crud.updateDispositivo(this.formData.id!, this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    } else {
      this.crud.createDispositivo(this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este dispositivo?')) {
      this.crud.deleteDispositivo(id).subscribe(() => this.cargar());
    }
  }

  get dispositivosFiltrados() {
    if (!this.searchTerm) return this.dispositivos;
    return this.dispositivos.filter(d =>
      d.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      d.codigo_dispositivo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      d.sede_nombre?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}