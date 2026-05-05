import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService, Institucion } from '../../services/crud.service';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css']
})
export class InstitucionesComponent implements OnInit {
  instituciones: Institucion[] = [];
  formData: Institucion = { nombre: '', activo: true };
  editando = false;
  isLoading = true;
  showModal = false;
  searchTerm = '';

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.isLoading = true;
    this.crud.getInstituciones().subscribe({
      next: (data) => {
        this.instituciones = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  abrirModal(editar = false, item?: Institucion) {
    this.editando = editar;
    if (editar && item) {
      this.formData = { ...item };
    } else {
      this.formData = { nombre: '', activo: true };
    }
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.formData = { nombre: '', activo: true };
    this.editando = false;
  }

  guardar() {
    if (this.editando) {
      this.crud.updateInstitucion(this.formData.id!, this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    } else {
      this.crud.createInstitucion(this.formData).subscribe(() => {
        this.cargar();
        this.cerrarModal();
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta institución?')) {
      this.crud.deleteInstitucion(id).subscribe(() => this.cargar());
    }
  }

  get institucionesFiltradas() {
    if (!this.searchTerm) return this.instituciones;
    return this.instituciones.filter(i => 
      i.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.ruc?.includes(this.searchTerm)
    );
  }
}