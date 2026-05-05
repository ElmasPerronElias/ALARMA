import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, Sede, Institucion } from '../../services/crud.service';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {
  sedes: Sede[] = [];
  instituciones: Institucion[] = [];
  formData: Sede = { institucion: 0, nombre: '', codigo: '', direccion: '', activo: true };
  editando = false;
  isLoading = true;
  showModal = false;
  searchTerm = '';

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.cargar();
    this.cargarInstituciones();
  }

  cargar() {
    this.isLoading = true;
    this.crud.getSedes().subscribe({
      next: (data) => {
        this.sedes = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  cargarInstituciones() {
    this.crud.getInstituciones().subscribe(data => this.instituciones = data);
  }

  abrirModal(editar = false, item?: Sede) {
    this.editando = editar;
    if (editar && item) {
      this.formData = { ...item };
    } else {
      this.formData = { institucion: 0, nombre: '', codigo: '', direccion: '', activo: true };
    }
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.formData = { institucion: 0, nombre: '', codigo: '', direccion: '', activo: true };
    this.editando = false;
  }

  guardar() {
    if (this.editando) {
      this.crud.updateSede(this.formData.id!, this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    } else {
      this.crud.createSede(this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta sede?')) {
      this.crud.deleteSede(id).subscribe(() => this.cargar());
    }
  }

  get sedesFiltradas() {
    if (!this.searchTerm) return this.sedes;
    return this.sedes.filter(s =>
      s.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.institucion_nombre?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}